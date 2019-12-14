import React, { useState, useEffect } from "react";
import * as yup from "yup";
import Modal from "react-bootstrap/Modal";
import PhotoForm from "./PhotoForm";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { observer } from "mobx-react";
import { getPhotos, deletePhoto } from "../utils/APICalls";



function ProjectPhotos({ photosStore }) {
  const [show, setShow] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const handleEditShow = photo => {
    setSelectedPhoto(photo);
    setShowEdit(true);
  };
  const getAllPhotos = async () => {
    const response = await getPhotos();
    photosStore.setPhotos(response.data);
  };
  const deletePhotoById = async id => {
    await deletePhoto(id);
    await getAllPhotos();
  };
  const onSave = () => {
    setShow(true);
    setShowEdit(false);
  };
  useEffect(() => {
    if (!initialized) {
      getAllPhotos();
      setInitialized(true);
    }
  });
  return (
    <div >
      <h6>Photos</h6>
   
      <Table striped bordered hover style={{ marginTop: 10 }}>
        <thead>
          <tr>
       
            <th>Photo</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {photosStore.photos.map((p, i) => {
            const splitPath = p.photoPath.split("\\");
            const path = splitPath[splitPath.length - 1];
            return (
              <tr key={i}>
              
                <td>
                  <img src={`${process.env.REACT_APP_baseAPIURL}/${path}`} style={{ width: 200 }} />
                </td>
                <td>
                  <Button onClick={handleEditShow.bind(this, p)}>Edit</Button>
                </td>
                <td>
                  <Button onClick={deletePhotoById.bind(this, p.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
  
     <PhotoForm
            edit={false}
            photosStore={photosStore}
            onSave={onSave.bind(this)}
          />

         
      <Modal show={showEdit} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PhotoForm
            edit={true}
            photosStore={photosStore}
            selectedPhoto={selectedPhoto}
            onSave={onSave.bind(this)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default observer(ProjectPhotos);
