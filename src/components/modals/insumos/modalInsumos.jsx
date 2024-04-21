import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { formToJSON } from "axios";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import Select from "react-select";
import DatePicker from "react-datepicker"; // Importa el componente DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto para DatePicker
import {
  guardarInsumos,
  editarInsumos,
} from "../../apiUrls";
import ModalInformacionInsumos from "./modalInformacionInsumos";
import { AxiosPrivado } from "../../axios/Axios";



function ModalInsumosForm({ accion, datosInsumos, ActualizarTabla, }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [errornombre, setErrornombre] = useState(false);
  const [errordescripcion, setErrordescripcion] = useState(false);
  


  const [formularioInsumos, setFormularioInsumos] = useState({
    id: datosInsumos ? datosInsumos.id : null,
    nombre: datosInsumos ? datosInsumos.nombre : "",
    descripcion: datosInsumos ? datosInsumos.descripcion : "",
  });





  const saveInsumos = async () => {
    const regex = /^[a-zA-Z\s]+$/;
    // Validar campos vacíos
    if (
      (formularioInsumos.nombre === "" ||
      formularioInsumos.descripcion === "" )
    ) {
      mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
      setErrornombre(true);
      setErrordescripcion(true);
      return;
    }

    if (formularioInsumos.nombre == "") {
      console.log("Por favor, complete todos los campos");
      mostraAlerta("Escriba el nombre", "warning");
      return;
    }

    const lotePattern = /^[a-zA-Z\s]{10,50}$/;
    if (!lotePattern.test(formularioInsumos.descripcion)) {
      console.log("La descripcion debe tener al menos 10 dígitos");
      setErrordescripcion(true);
      mostraAlerta("La descripcion debe tener al menos 10 dígitos", "warning");
      return;
    }
    if (!regex.test(formularioInsumos.nombre)) {
      console.log("El campo nombre solo debe contener letras");
      setErrornombre(true);
      mostraAlerta(
        "El campo  nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    setErrornombre(false);
    setErrordescripcion(false);
    try {



      console.log(formularioInsumos)
      await AxiosPrivado
        .post(guardarInsumos, formularioInsumos)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            ActualizarTabla();
            mostraAlerta(response.data.msj, "success");
            limpiarCampos()
          } else if (response.data.tipo === 0) {
            for (let i = 0; i < response.data.msj.length; i++) {
              response.data.msj.forEach((element) => {
                console.log(element);
                mostraAlerta("ha ocurrido un error", "warning");
              });
            }
          } else if (response.data.tipo === 2) {
            response.data.msj.forEach((element) => {
              console.log(element.campo + " " + element.msj);
              mostraAlerta("El campo : " + element.campo + ", " + element.msj);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta("Revise los datos", "warning");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorInsumos = (event) => {
    setFormularioInsumos({
      ...formularioInsumos,
      [event.target.name]: event.target.value,
    });
  };


  const modificarInsumo = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioInsumos.nombre === "") {
      console.log("Por favor, complete todos los campos");
      setErrornombre(true);
      mostraAlerta("Por favor, complete todos los campos", "warning");
      return;
    }
    setErrornombre(false);

    AxiosPrivado
      .put(editarInsumos + formularioInsumos.id, formularioInsumos)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          ActualizarTabla();
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo === 2) {
          mostraAlerta(response.data.msj);
        }
        //fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });


  };

  const limpiarCampos = () => {
    setErrornombre(false);
    setErrordescripcion(false);
    setFormularioInsumos({
      id: null,
      nombre: "",
      descripcion: "",
    });
  };

  const handleOpenModal = () => {
    setShowModalInformacion(true);
  };


  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear Insumo
          </Button>
        </div>

      ) : (
        <div>
          <Button variant="info" onClick={handleOpenModal}>
            <i className="fas fa-folder">
            </i>
          </Button>

          <Button variant="warning" onClick={handleShow}>
            <i className="fas fa-pencil-alt">
            </i>
          </Button>
        </div>

      )}
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Insumos</h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="card-body">
              <div className="row">


                <div className="form-group">
                  {accion ? (
                    <>


                    </>
                  ) : (
                    <>


                    </>
                  )}
                </div>
              

                <div className="row">
                  <div className="col-lg-6 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Nombre</label>
                      <input
                        type="text"
                        className={`form-control ${errornombre ? "is-invalid" : ""}`}
                        id="text"
                        placeholder="Nombre"
                        name="nombre"
                        value={formularioInsumos.nombre}
                        onChange={manejadorInsumos}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Descripcion</label>
                      <input
                        type="text"
                        className={`form-control ${errordescripcion ? "is-invalid" : ""}`}
                        id="text"
                        placeholder="Descripcion"
                        name="descripcion"
                        value={formularioInsumos.descripcion}
                        onChange={manejadorInsumos}
                      />
                    </div>
                  </div>
                </div>
              </div>


            </div>
            {/* /.card-body */}
          </form>
        </div>
        <div className="modal-footer ">
          <div className="card-footer">
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            <Button variant="warning" onClick={limpiarCampos}>
              Limpiar Campos
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            {accion ? (
              <Button variant="primary" onClick={saveInsumos}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarInsumo}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionInsumos datos={datosInsumos} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionInsumos>
    </>
  );
}

export default ModalInsumosForm;
