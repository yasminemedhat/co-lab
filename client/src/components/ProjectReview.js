import React from "react";
import "../css/about.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import CommentsBlock from "simple-react-comments";
import { postProjectReview,    getProjectReviews} from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";



class ProjectReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      firstName:"",
      lastName:"",
      avatar:"",
      id:'',
      projectID:""
    };
  }
  componentDidMount(){
      //console.log("get user")
      //console.log(this.props.project._id)

    const {firstName,lastName, avatar, _id} = this.props.user;
    this.setState({firstName,lastName, avatar, id:_id,projectID:this.props.project._id});
   this.getReviews()
}
  addReview(text){
    if (text.length > 0) {
      const jwt = getJwt();
    
      const review = {authorUrl:"/users/" + this.state.id,avatarUrl:this.state.avatar,createdAt: new Date() ,fullName:this.state.firstName+" "+ this.state.lastName,body:text };
      postProjectReview(jwt, review, this.state.projectID).then(data => {

       // console.log("el dataaaaaa ahe")
      //console.log(review.createdAt)
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
         
        //console.log("submit:", text);
      }
    }

    getReviews(){

      getProjectReviews(this.props.project._id).then(data=>{
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

  
  render() {
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

export default ProjectReview;
