const Colaber = require('../models/Colaber');

module.exports = async function(socket,user_id){
    try{
        let user=await Colaber.findOne({_id: user_id}).select('-password');

        if(!user){
            return
        }
        console.log(user);
        console.log('joined chatrooms');
        let colabs = user.collaborations;
        // socket.join("5e7a4a74dae40653a40f45db"); 
        colabs.map(colab_id => {
            socket.join(colab_id); 
        })
    } catch (error) {
        console.log(error);
    }
    
     
}