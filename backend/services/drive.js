
const { google } = require('googleapis');
const credentials = require('../config/credentials.json');
const projectFolderID = '1surIZv3i1tH1m_rMzmvUGiZi1ctVLlih';
const colabFolderID = '1H9fbcCPtcpZJyyAwtiCaXd8AuWnY_MdK';
const stream = require('stream');
const fs = require('fs-extra');

var drive, jwtClient;
var expiry_date;

module.exports = {
  connectDrive: async function () {

    jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive'],
    );

    // Authenticate request
    await jwtClient.authorize(async function (err, tokens) {
      if (err) {
        return;
      } else {
        console.log("Google autorization complete");
        expiry_date = tokens.expiry_date;
      }
    });
    try {
      drive = google.drive({
        version: 'v3',
        auth: jwtClient
      });
    } catch (error) {
      console.log(error);
    }

    console.log('Google Drive connected')

  },

  uploadImages: async function (projectID, images, option) {//option 1 -> project, option 2-> colaboration
    await refreshToken();

    const destination = (option === 1) ? projectFolderID : colabFolderID;
    //in case of an error -> return undefined

    if (projectID == null) {
      return undefined;
    }
    //create a folder with the project's id as its name->
    var fileMetadata = {
      'name': projectID,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [destination]

    };
    var response;

    try {
      response = await drive.files.create({
        auth: jwtClient,
        resource: fileMetadata,
        fields: 'id'
      });
    } catch (error) {
      console.log("Failed to created folder " + error);
      return undefined;
    }


    //if folder is created -> upload images
    //get new parent folder id:
    const folderID = response.data.id;

    var links = await this.uploadImagesToFolder(folderID, images);

    return links;
  },

  uploadImagesToFolder: async function (parent, images) {
    await refreshToken();
    const folderID = parent;
    var links = [];

    //upload images:
    try {
      for (var i = 0; i < images.length; i++) {
        let bufferStream = new stream.PassThrough();
        bufferStream.end(images[i].buffer);
        var name = Math.floor(Math.random() * Math.floor(100000));
        var imageMetadata = {
          'name': `${name}.jpg`,
          parents: [folderID]
        };
        var media = {
          mimeType: 'image/jpeg',
          body: bufferStream
        };

        response = await drive.files.create({
          auth: jwtClient,
          resource: imageMetadata,
          media: media,
          fields: 'id, webContentLink'
        });
        var { id, webContentLink } = response.data;
        webContentLink = webContentLink.replace('&export=download', '');
        links.push(webContentLink);
        //set permissions:
        setPermissions(id);

      }
      return links;
    } catch (error) {//failed to upload
      console.log(error);
      //rollback -> delete folder;
      var check = module.exports.deleteFolder(folderID);
      if (!check)//try again
      {
        module.exports.deleteFolder(folderID);
      }
      return undefined;

    }
  },


  driveCleanUp: async function () {
    //var id='1dajgPmhX3diuvFRM1OJW0YB7TjzKKAkj'
    await refreshToken();
    var res, files;
    try {

      res = await drive.files.list({
        auth: jwtClient,
        fields: 'files(id, name)',
      });
      files = res.data.files;
      for (var i = 0; i < files.length; i++) {
        var name = files[i].name;
        if (name != 'colaboration' && name != 'project' && name != 'avatars') {
          console.log(files[i]);
          await this.deleteFileByID(files[i].id); //exceeds request quota without await 
        }
      }
      console.log(`Deleted ${files.length} files`);
      return true;

    } catch (error) {
      console.log('The API returned an error: ' + error);
      return false;
    }


  },

  deleteFolder: function (folderID) {
    refreshToken();
    drive.files.delete({
      auth: jwtClient,
      "fileId": folderID
    }).then(function (response) {
      console.log(' deleted');
      return true;
    },
      function (err) {
        console.error("Execute error", err);
        return false;
      }
    );



  },

  uploadAvatar: async function (image, id) {
    await refreshToken();
    const folderID = '1dajgPmhX3diuvFRM1OJW0YB7TjzKKAkj';


    var response;
    try {
      let bufferStream = new stream.PassThrough();
      bufferStream.end(image.buffer);

      var imageMetadata = {
        'name': `${id}.jpg`,
        parents: [folderID]
      };
      var media = {
        mimeType: 'image/jpeg',
        body: bufferStream
      };
      response = await drive.files.create({
        auth: jwtClient,
        resource: imageMetadata,
        media: media,
        fields: 'id, webContentLink'
      });
      console.log(response.status);
      var { id, webContentLink } = response.data;
      webContentLink = webContentLink.replace('&export=download', '');

      //set permissions:
      setPermissions(id);


    } catch (error) {
      //rollback -> delete file;
      console.log(error);
      var check = module.exports.deleteFolder(id);
      if (!check)//try again
      {
        module.exports.deleteFolder(folderID);
      }
      return undefined;

    }
    return webContentLink;

  },

  deleteFileByID: async function (id) {
    await refreshToken();
    var res;
    try {
      res = await drive.files.delete({
        auth: jwtClient,
        "fileId": id
      });
      console.log(res.status);

      return true;

    } catch (error) {
      console.log('The API returned an error: ' + error);
      return false;
    }





  },

  getParentFolder: async function (id) {
    await refreshToken();
    try {
      var response = await drive.files.get({
        "fileId": id,
        fields: 'parents'
      });
      return response.data.parents[0];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}

function setPermissions(id) {
  refreshToken();
  drive.permissions.create({
    "fileId": id,
    auth: jwtClient,
    "resource": {
      "type": "anyone",
      "role": "reader",
      "allowFileDiscovery": false,//cannot search for it
    }
  }).then(function (res, err) {
    if (err) {
      console.log('ERROR in Permissions');
      console.log(err.status);
      console.log(res.status);
      if (res.status != 200) {
        console.error(err);
        return false
      }

    }
    else return true;
  });
}

async function refreshToken() {//check if token expired

  const now = Date.now();
  const timeLeft = expiry_date - now; //in seconds
  if (timeLeft <= 5000) {
    module.exports.connectDrive();
  }

}


