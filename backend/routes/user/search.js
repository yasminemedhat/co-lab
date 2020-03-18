const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');


module.exports=async(req,res)=>{
    try {
        const body = req.body.text;

        const limit = 10;
        
        //get users 
        let colabers = 
                await Colaber.find({$text: {$search: body}}, {score: {$meta: "textScore"}})     //find colabers containing input string
                                .select('id firstName lastName avatar')                         //select required fields only
                                .sort({score:{$meta:"textScore"}})                              //sort based on relevance to input string
                                .limit(limit);                                                  //get top results

        //get projects 
        let projects = 
                await Project.find({$text: {$search: body}}, {score: {$meta: "textScore"}})     //find projects containing input string
                                .where("projectType").equals(null)                              //select solo projects
                                .select('id name description images')                           //select required fields only
                                .sort({score:{$meta:"textScore"}})                              //sort based on relevance to input string
                                .limit(limit);

        //get colaborations
        let colaborations = 
                await Project.find({$text: {$search: body}}, {score: {$meta: "textScore"}})     //find colaborations containing input string
                                .where("projectType").equals("Colaboration")                    //select colaborations
                                .select('id name description images')                           //select required fields only
                                .sort({score:{$meta:"textScore"}})                              //sort based on relevance to input string
                                .limit(limit);                                                  //get top results
      
        res.json({colabers, projects, colaborations});
            
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}