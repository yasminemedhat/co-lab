import Modal from "react-awesome-modal";
import "../css/projectPopup.css";
import "../css/profile.css";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import React, { useState} from "react";


const AddMemberPopUp =({email, handleChange, handleSubmit, closePopUp}) => {
 
  const [visible, setvisible] = useState({visible: true})

  var content = (
            <Modal 
                visible={visible}
                width="600"
                height="160"
                effect="fadeInUp"
                onClickAway={closePopUp}
                onSubmit={handleSubmit}>
                <span className="login100-form-title p-b-55">Invite a new member</span>
                    <label>
                        New Member's email
                    <input
                        className="input100"
                        placeholder="Email"
                        name="email"
                        type="text"
                        onChange={(event) => handleChange(event)}
                        defaultValue={email}/>
                    </label>
                <br />
                <button className="btn btn-primary float-right" onClick={handleSubmit}>Invite</button>
            </Modal> );
    return content;
}
 
export default AddMemberPopUp;