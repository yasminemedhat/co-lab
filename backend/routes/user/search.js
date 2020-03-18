const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');


module.exports=async(req,res)=>{
    try {
        const body = req.params.text;
        if(body==null)return res.status(400).json('Search field empty');
        console.log(body);
        const limit = 10;
         //simultaneous queries to save time:
        Promise.all([
            //get users 

             Colaber.find({ $text: { $search: body } }, { score: { $meta: "textScore" } })     //find colabers containing input string
                .select('id firstName lastName avatar')                                             //select required fields only
                .sort({ score: { $meta: "textScore" } })                                            //sort based on relevance to input string
                .limit(limit).lean(),                                                                      //get top results
           

            //get projects 

             Project.find({ $text: { $search: body } }, { score: { $meta: "textScore" } })     //find projects containing input string
                .where("projectType").equals(null)                                                  //select solo projects
                .select('id name description images')                                              //select required fields only
                .sort({ score: { $meta: "textScore" } })                                          //sort based on relevance to input string
                .limit(limit).lean(),

            //get colaborations

             Project.find({ $text: { $search: body } }, { score: { $meta: "textScore" } })     //find colaborations containing input string
                .where("projectType").equals("Colaboration")                                        //select colaborations
                .select('id name description images')                                               //select required fields only
                .sort({ score: { $meta: "textScore" } })                                            //sort based on relevance to input string
                .limit(limit).lean()                                                                       //get top results

        ]).then(([colabers, projects, colaborations]) => {
            res.json({ colabers, projects, colaborations });
        }).catch (function(error) {
                console.error(error);
                res.status(500).json({ message: 'Server Error' });
              });
        


   
}