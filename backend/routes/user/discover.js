const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project'); //for both projects and collaborations



module.exports = async (req, res) => {

    const id = req.user.id;
    const type = req.params.type;

    try {
        //get users interests
        const interests = await Colaber.findById(id).select('interests -_id').lean();
        if (!interests) return res.status(400).json('Please specify your interests to get suggestions');

        switch (type) {
            case 'accounts':
                //get accounts matching with same interests as workingField
                var colabers = await Colaber.aggregate([
                    { $match: { workingField: { $in: interests.interests } } }, //find Colabers with workingField matching interests
                    { $sample: { size: 10 } },                                  //sample randomizes results
                    {
                        $project: {
                            firstName: 1, lastName: 1, email: 1,        //select fields and count
                            avatar: 1, workingField: 1,                 //number of followers
                            followers: { $cond: { if: { $isArray: "$followers" }, then: { $size: "$followers" }, else: 0 } }
                        }
                    }
                ]);
                res.json(colabers);
                break;
            case 'projects': //gets both projects and collaborations
                var projects= await Project.aggregate([
                    { $match: { field: { $in: interests.interests } } }, //find Colabers with workingField matching interests
                    { $sample: { size: 10 } },                                  //sample randomizes results
                    {
                        $project: {
                            name: 1, desciption: 1, creator: 1,        //select fields and count
                            images: 1, projectType: 1,
                            likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 } },
                        }
                    }
                ]);
                res.json(projects);
                break;
            default: return res.status(404);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
}


// var projs=await Project.find({fields: { $in: ['Crafts'] }});
//     for(var i=0;i<projs.length;i++){
//         projs[i].field=projs[i].fields[0];
//         projs[i].fields=undefined;
//        await projs[i].save()
//     }
//     console.log(projs.length);