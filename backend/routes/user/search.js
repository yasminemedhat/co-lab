const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');


module.exports=async(req,res)=>{
    try {
        const body = req.body.text;
        
        //get users 
        let colabers = await Colaber.find({$text: {$search: body}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});

        //get projects collection 
        let allProjects = await Project.find({$text: {$search: body}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});
        
        projects = [];
        colaborations = [];
        //separate colaborations and projects
        for (let index = 0; index < allProjects.length; index++) {
            const element = allProjects[index];
            //push element in array based on projectType
            if(element.projectType == "Colaboration")
                colaborations.push(element);
            else                 
                projects.push(element);
        }
        res.json({colabers, projects, colaborations});
            
    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}