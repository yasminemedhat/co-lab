
const { google } = require('googleapis');
const credentials = require('../config/credentials.json');
const projectFolderID = '1surIZv3i1tH1m_rMzmvUGiZi1ctVLlih';
const stream = require('stream');
const fs = require('fs-extra');

var drive, jwtClient;

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
        //console.log(jwtClient);
      
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

  uploadImages: async function (projectID, images) {
    refreshToken();
    var links = []; //return array of urls
    //in case of an error -> return undefined

    if (projectID == null) {
      return undefined;
    }
    //create a folder with the project's id as its name->
    var fileMetadata = {
      'name': projectID,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [projectFolderID]

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


    //upload images:
    try {
      for (var i = 0; i < images.length; i++) {
        let bufferStream = new stream.PassThrough();
        bufferStream.end(images[i].buffer);

        var imageMetadata = {
          'name': `${i + 1}.jpg`,
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

        links.push(webContentLink);
        //set permissions:
        setPermissions(id);

      }

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
    return links;




  },


  driveCleanUp: async function () {
    refreshToken();
    var res,files;
    try {

      res = await drive.files.list({
        auth: jwtClient,
        fields: 'files(id, name)',
        q: `parents='${projectFolderID}'`

      });
       files = res.data.files;
      for (var i = 0; i < files.length; i++) {
        await drive.files.delete({
          auth: jwtClient,

          "fileId": files[i].id
        });
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
      console.log('Folder deleted');
      return true;
    },
      function (err) {
        console.error("Execute error", err);
        return false;
      }
    );



  }


  

}

function setPermissions(id) {
  refreshToken();
  drive.permissions.create({
    "fileId": id,
    "resource": {
      auth: jwtClient,
      "type": "anyone",
      "role": "reader",
      "allowFileDiscovery": false,//cannot search for it
    }
  }).then(function (res,err) {
    if (err) {
      console.log(err.status);
      console.log(res.status);
      if(res.status !=200){
        console.error(err);
        return false
      }
      
    }
    else return true;
  });
}

async function refreshToken(){//check if token expired
  const info=await jwtClient.getTokenInfo(jwtClient.credentials.access_token);
  const exp=info.exp;
  const now = Date.now() / 1000;
  const timeLeft = exp - now; //in seconds
  if(timeLeft<=20)
  {
    module.exports.connectDrive();
  }

}


