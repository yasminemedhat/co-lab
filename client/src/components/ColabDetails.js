import React, { useState, useEffect} from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";

const ColabDetails = ({location}) => {
    const [colab, setColab] = useState({name: '', description: '', members: [], images: []});

    useEffect(() => {
        let images = location.state.collaboration.images ? location.state.collaboration.images : [];
        setColab({...location.state.collaboration, images});
    },[]);

    var content='';
    if(colab.name === ''){
        content = (<div><h1>loading...</h1></div>);
    }
    else {
        let row= [];
        let rowIndex = -1
        for (let i=0;i<colab.images.length;i= i+3){
            rowIndex++
            row[rowIndex] = 
                <div className="row imageRow" key={i}>
                    <div className = "col imagecol">
                    <Img className="project_pictures" style={{ float: 'right'}} src={colab.images[i]}></Img>
                    </div>
                    <div className = "col imagecol">
                    <Img className="project_pictures" src={colab.images[i+1]}></Img>
                    </div>
                    <div className = "col imagecol">
                    <Img className="project_pictures" style={{ float: 'left'}} src={colab.images[i+2]}></Img>
                    </div>  
                </div>
        }    
        content =(<div className="ProjectContainer">
                    <div className="row">
                        <div className="col"></div>
                        <div className="col">
                            <h1>{colab.name}</h1>
                            <p>{colab.description}</p>
                            <p>{colab.link}</p>
                        </div>
                        <div className="col"></div>
                    </div>{row}</div>)
    
    }
    
    return content;
      
}
export default ColabDetails;