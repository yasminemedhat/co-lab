import React from "react";
import "../css/search.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import { search } from "../utils/APICalls";
import HorizontalScroll from 'react-scroll-horizontal'
import { Row, Col } from "react-bootstrap";
import ProjectLink from "./ProjectLink.js";
import ProfileLink from "./ProfileLink.js";
import "../css/profile.css";



class SearchResults extends React.Component {

  state={
    searchTerm:"",
    search_results:[{}],
    colabers:[],
    projects:[],
    collaborarions:[]

  }

  constructor(props){
    super(props);
    this.state={
      searchTerm:"",
      search_results:[{}],
      colabers:[], 
      projects:[],
      collaborations:[]
    }}

    componentDidMount() {
      this.setState({
        searchTerm:this.props.match.params.searchTerm
      })
      console.log("sos")
      console.log(this.state.searchTerm)
      search(this.props.match.params.searchTerm).then(data => {
      console.log("my data")
      console.log(data)
       this.setState({
        search_results:data
       })
    
        console.log(this.state.search_results)
        this.setState({
          colabers:this.state.search_results.colabers,
          projects:this.state.search_results.projects,
          collaborarions:this.state.search_results.colaborations

        })
        

      });
        
      
      
    }


   
   
        
    
  render() {
  
   
    if(this.state.projects ===undefined || this.state.colabers ===undefined ||this.state.collaborarions ===undefined){
      return(
        <div>
          <h1>loading...</h1>
        </div>
      )
    }
 
   let colabers;
    if(this.state.colabers !== undefined){
     
      colabers = 
      <Row style={{ width: "100%",height: "470px" }}>
      <h4>Colabers</h4>
          <HorizontalScroll className="horizontal_scroll" style={{overflow: "hidden", overflowX: "auto", }}>
  
      {this.state.loadingProjects ? (
          <div>
            <h5>Loading Projects...</h5>
          </div>
        ) : this.state.colabers ? (
          // <div className="container">
      
          this.state.colabers.map((colaber, i) => {
            // Return the element. Also pass key
            return (
              <Col key={i}  style={{width: "100%", height: "460px"  }}>
                <ProfileLink key={i} colaber={colaber} />
              </Col>
            );
          })
          
        ) : null}
  
    </HorizontalScroll>
      </Row>
    }

    let projects;
    if(this.state.projects.length >0){
     
      projects = 
      <Row style={{ width: "100%",height: "430px" }}>
        <h4>Projects</h4>
            <HorizontalScroll className="horizontal_scroll" style={{overflow: "hidden", overflowX: "auto", }}>
    
        {this.state.loadingProjects ? (
            <div>
              <h5>Loading Projects...</h5>
            </div>
          ) : this.state.projects ? (
            // <div className="container">
        
            this.state.projects.map((project, i) => {
              // Return the element. Also pass key
              return (
                <Col key={i}  style={{width: "100%", height: "420px"  }}>
                  <ProjectLink key={i} project={project} />
                </Col>
              );
            })
            
          ) : null}
    
      </HorizontalScroll>
        </Row>
        
 
    }

    let collaborarions;
    if(this.state.collaborarions.length >0){
     
      collaborarions = 
      <Row style={{ width: "100%",height: "470px" }}>
      <h4>Co-Laborations</h4>
          <HorizontalScroll className="horizontal_scroll" style={{overflow: "hidden", overflowX: "auto", }}>
  
      {this.state.loadingProjects ? (
          <div>
            <h5>Loading Projects...</h5>
          </div>
        ) : this.state.collaborarions ? (
          // <div className="container">
      
          this.state.collaborarions.map((project, i) => {
            // Return the element. Also pass key
            return (
              <Col key={i}  style={{width: "100%", height: "460px"  }}>
                <ProjectLink key={i} project={project} />
              </Col>
            );
          })
          
        ) : null}
  
    </HorizontalScroll>
      </Row>
    }
    
    return (
      <div>
 
        <div className="Limiter">
          <div className="search_container">
            <div className="row">
            {colabers}
            </div>
            <div className="row">
            {projects}
            </div>
            <div className="row">
            {collaborarions}
            </div>
          
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
