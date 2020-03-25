import React from "react";
import "../css/about.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import CommentsBlock from "simple-react-comments";
import { postColaberReview,    getColaberReviews} from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";


class Review extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      firstName:"",
      lastName:"",
      avatar:"",
      id:'',
      profileOwnerId:""
    };
  }
  componentDidMount(){
      console.log("get user")
      console.log(this.props.user._id)
      console.log(this.props.profileOwnerId)

    const {firstName,lastName, avatar, _id} = this.props.user;
    this.setState({firstName,lastName, avatar, id:_id,profileOwnerId:this.props.profileOwnerId});
    this.getReviews()
  

}
  getReviews(){
    getColaberReviews(this.props.profileOwnerId).then(data=>{
      data.map(review =>{
        this.setState({
          comments: [
            ...this.state.comments,
            {
              authorUrl:review.authorUrl,
              avatarUrl: review.avatarUrl,
              createdAt: new Date(review.createdAt),
              fullName:review.fullName,
              text:review.body
            }
          ]
        })
      })
      console.log("dataaa")
      console.log(data)
      })
  }
  addReview(text){
    if (text.length > 0) {
      const jwt = getJwt();
     
      console.log("print profileOwnerID")
      console.log(this.state.profileOwnerId)
      const review = {authorUrl:"/users/" + this.state.id,avatarUrl:this.state.avatar,createdAt: new Date() ,fullName:this.state.firstName+" "+ this.state.lastName,body:text };
      postColaberReview(jwt, review, this.state.profileOwnerId).then(data => {

        console.log("el dataaaaaa ahe")
      console.log(review.createdAt)
      });

       this.setState({
          comments: [
            ...this.state.comments,
            {
              authorUrl:"/users/" + this.state.id,
              avatarUrl: this.state.avatar,
              createdAt: new Date(),
              fullName: this.state.firstName+" "+ this.state.lastName,
              text
            }
          ]
        });
         
        console.log("submit:", text);
      }
    }

  
  render() {
   /* if (this.state.profileOwnerId === undefined){
      return(
        <div>
          <h2>loading..</h2>
        </div>
      )
     }
      */ 
    return (
      <div>
        <CommentsBlock
          comments={this.state.comments}
          signinUrl={"/signin"}
          isLoggedIn
          onSubmit={text => this.addReview(text)}
         />   
        
      </div>
    );
  }
}

export default Review;
