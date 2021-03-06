const Colaber = require('../../models/Colaber');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');
const Review = require('../../models/Review');
const needle = require('needle');

/*
const natural = require('natural'); //NLP package
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();
const SW = require('stopword');
const util = require('util');
const post = util.promisify(needle.post);

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
}*/

module.exports=async(req,res)=>{
    const userToReview_id = req.params.user_id;
    const reviewer_id = req.user.id;
    try {
                
        //get user being reviewed and reviewer
        let userToReview = await Colaber.findOne({_id: userToReview_id}).select('id reviews notifications'); 
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

        //Get rating and save
        GetRating(body, review, userToReview);

        res.json(userToReview);       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);
    }

}
/**
 * calculates review rating
 * calculates user rating 
 * @param {*string} body 
 * @param {*Review} review 
 * @param {*Colaber} user user being reviewed
 */
async function GetRating(body, review, user)
{
    var resp = await needle('post','https://ratings--api.herokuapp.com/', { review: body });
    var rating = resp.body.rating;
    
    review.rating = rating;
    await review.save();
    CalculateUserRating(user);
}

/**
 * calculates 
 * @param {*Colaber} user user being reviewed
 */
async function CalculateUserRating(user)
{
    await Review.populate(user, { path:'reviews' });
    reviews = user.reviews;
    length = reviews.length;

    var sum = 0;

    reviews.forEach(review => {
        sum += review.rating;
    });
    avg = Math.round(sum / length); 

    user.rating = avg;
    if( !(avg >= 1 && avg <= 5))
        user.rating = 0;

    console.log(user.rating);
    user.save();
}