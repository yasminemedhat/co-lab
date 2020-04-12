const Colaber = require('../../models/Colaber');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');
const Review = require('../../models/Review');
const natural = require('natural'); //NLP package
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();
const SW = require('stopword');

async function sentimentAnalysis(review){
    //convert contractions I'm --> I am
    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    //Remove special and numerical characters
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    const { WordTokenizer } = natural
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    // correct review spelling
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    //Remove stop words like but, a, or,etc
    const filteredReview = SW.removeStopwords(tokenizedReview);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    // stemmer to: happiness --> happy
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);
    console.log(analysis);
}

module.exports=async(req,res)=>{
    const userToReview_id = req.params.user_id;
    const reviewer_id = req.user.id;
    try {
                
        //get user being reviewed and reviewer
        let userToReview = await Colaber.findOne({_id: userToReview_id}).select('-password'); 
        let reviewer = await Colaber.findOne({_id: reviewer_id}).select('id'); 
        if(!userToReview | !reviewer){
            return res.status(404).json({message:'User not found'});
        }

        //pull from request
        const { 
            avatarUrl, 
            authorUrl, 
            fullName, 
            body, 
            createdAt} = req.body;

        //check body
        if(body==null)
            return res.status(400).json('Review field empty');

        //create review 
        let review = new Review ({
            avatarUrl, 
            authorUrl,
            fullName, 
            body, 
            createdAt
        });

        // sentimentAnalysis(body);
        console.log(createdAt);
        console.log(review);
        
        //add review to userToReview reviews array
        userToReview.reviews.unshift(review.id);

        // create notification object
        notification = createNotificationObject(
            (Object)(reviewer.id), fullName, userToReview, undefined, undefined,
            ObjectsToBeOpened.SENDER, Actions.REVIEW_USER
            );
        
        //add to receiver notifications and save
        userToReview.notifications.unshift(notification.id);
        await notification.save();
        await userToReview.save();

        server.io.to(userToReview.id).emit('notification');

        //save review and receiver to db
        await review.save();
        await userToReview.save();
        res.json(userToReview);       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);
    }

}