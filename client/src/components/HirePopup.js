import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import '../css/projectPopup.css';
import '../css/profile.css';
import '../bootstrap/css/bootstrap.min.css';
import '../fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import { getHireFields  } from '../utils/APICalls';
import DatePicker from 'react-date-picker';

class HirePopup extends Component {
  state = {
    title: '',
    description: '',
    field: '',
    money: '',
    date: new Date(),
    hireFields: []
  };
  // fileObj = [];
  // fileArray = [];
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
    // this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.handleCreateHire = this.handleCreateHire.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  changeDate = date => this.setState({ date });

  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });

  };

  closeModal() {
    this.setState({
      visible: false
    });
  }

  componentDidMount() {
    getHireFields()
      .then(data => {
        let hireFields = data.map(fields => {
          return { value: fields, display: fields, label: fields };
        });
        this.setState({
          hireFields: [
            { value: '', display: '(Select the Quick-Hire field)' }
          ].concat(hireFields)
        });
      })
      .catch(err => {
        if (err && err.data) {
          alert('Could not find hire fields fields: ', err.data.message);
        }
      });
  }
  handleCreateHire() {
   const hire ={title:this.state.title,description:this.state.description,money:this.state.money,field:this.state.field,date:this.state.date}

    console.log(hire)
    this.props.createHire(hire);
    this.closeModal();
  }

  render() {
   const date = new Date()

    return (
      <section>
        <Modal
          visible={this.state.visible}
          width='600'
          height='600'
          effect='fadeInUp'
          onClickAway={this.closeModal}
        >
          <button onClick={this.closeModal} className='btn float-right'>
            Close
          </button>
          <div className='popup'>
            <h1>Create Quick-Hire</h1>
            <div className='row'>
              <div className='col'>
                <p>Date:</p>
               
                <DatePicker required minDate={date}  clearIcon={null} onChange={this.changeDate} value={this.state.date} />
              </div>
              <div className='col'>
                <input
                  type='text'
                  placeholder='* Job Title'
                  value={this.state.title || ''}
                  required
                  onChange={this.handleChange('title')}
                />
                <br></br>
                <hr></hr>
                <textarea
                  className='description'
                  value={this.state.description || ''}
                  required
                  onChange={this.handleChange('description')}
                  placeholder='* Job Description'
                />
                <br></br>
                <hr></hr>
          
             < input
                  type='text'
                  placeholder='* money'
                  value={this.state.money || ''}
                  required
                  onChange={this.handleChange('money')}
                />
            
              </div>
            
              {/* <div className="row" style = {{    width: "100%" ,padding: "5%"}}>
              <ReactMultiSelectCheckboxes options={this.state.fieldsList}   onChange={this.handleChosenfields} placeholderButtonLabel='Choose Project Field(s)' />
              </div> */}
              {this.state.hireFields ? (
                <div className='row' style={{ width: '100%', padding: '5%' }}>
                  <select
                    defaultValue={this.state.field}
                    onChange={this.handleChange('field')}
                  >
                    {this.state.hireFields.map(field => (
                      <option key={field.value} value={field.value}>
                        {field.display}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              
            </div>
            <div></div>
            <button style={{background:"#3d2846" , color:"white"}}
              className='btn  float-right'
              onClick={this.handleCreateHire}
            >
              Create
            </button>
          </div>
        </Modal>
      </section>
    );
  }
}
export default HirePopup;
