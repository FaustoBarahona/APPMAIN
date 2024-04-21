import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { formToJSON } from "axios";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import Select from "react-select";
import {
    guardarProveedor,
    editarProveedor,
  } from "../../apiUrls";
  import ModalInformacionProveedores from "./modalInformacionProveedores";
  import { AxiosPrivado } from "../../axios/Axios";
  import BuscarLugar from "../lugares/BuscarLugar";

  function ModalProveedorForm({ accion, datosProveedores, ActualizarTabla, listaLugares }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [errornombre, setErrornombre] = useState(false);
    const [nombreLugar, setNombreLugar] = useState("Selecione un lugar");
    const [errorcorreo, setErrorcorreo] = useState(false);
    const [errorrtn, setErrorrtn] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);


    const [formularioProveedores, setFormularioProveedores] = useState({
      id: datosProveedores ? datosProveedores.id : null,
      rtn: datosProveedores ? datosProveedores.rtn : "",
      nombre: datosProveedores ? datosProveedores.nombre : "",
      lugarId: datosProveedores ? datosProveedores.lugarId : null,
      direccion: datosProveedores ? datosProveedores.direccion : "",
      activo: datosProveedores ? datosProveedores.activo : true,
      numeros: datosProveedores ? datosProveedores.proveedortelefonos : [{ numero: "" }],
    });
  
    useEffect(() => {

      if (datosProveedores != null) {
  
        
        buscarIdlugar(datosProveedores.lugarId);
        setFormularioProveedores({
          ...formularioProveedores,
          ...datosProveedores
        });
       
      }
      else {
        limpiarCampos();
      }
    }, [])
    useEffect(() => {
      if (datosProveedores != null && !datosCargados) {
    
        buscarIdlugar(datosProveedores.lugarId);
        setFormularioProveedores({
          ...formularioProveedores,
          ...datosProveedores
        });
        setDatosCargados(true); // Marcar los datos como cargados
      }
    }, [showModal, datosProveedores, datosCargados]);
  

  
    const buscarIdlugar = (id) => {
      const lugarSeleccionado = listaLugares?.find(
        (f) =>
          f.id == id
      );
      if (lugarSeleccionado) {
        setFormularioProveedores({
          ...formularioProveedores,
          lugarId: parseInt(id)
        });
        setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
      }
      else {
        setFormularioProveedores({
          ...formularioProveedores,
          lugarId: null
        });
        setNombreLugar("Seleccione un lugar");
      }
    };
  
    const saveProveedores = async () => {
      const regex = /^[a-zA-Z]+$/;
      // Validar campos vacíos
      if (
        (formularioProveedores.rtn,
          formularioProveedores.nombre,
          formularioProveedores.correo === "")
      ) {
        mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
        setErrornombre(true);
        setErrorcorreo(true);
        setErrorrtn(true);
        return;
      }
      if (formularioProveedores.rtn == "") {
        console.log("Por favor, complete todos los campos");
        setErrorrtn(true);
        mostraAlerta("Escriba la identidad", "warning");
        return;
      }
  
      const rtnPattern = /^\d{13}$/;
      if (!rtnPattern.test(formularioProveedores.rtn)) {
        console.log("El número de rtn debe tener 13 dígitos");
        setErrorrtn(true);
        mostraAlerta("El número de rtn debe tener 13 dígitos", "warning");
        return;
      }
      if (!regex.test(formularioProveedores.nombre)) {
        console.log("El campo primernombre solo debe contener letras");
        setErrornombre(true);
        mostraAlerta(
          "El campo primer nombre solo debe contener letras",
          "warning"
        );
        return;
      }
      if (formularioProveedores.direccion.length <= 3) {
        mostraAlerta("Escriba la direccion", "warning");
        return;
      }
      if (formularioProveedores.lugarId == null) {
        mostraAlerta("Seleccione el lugar", "warning");
        return;
      }
      setErrornombre(false);
      setErrorcorreo(false);
      setErrorrtn(false);

      try {
        console.log(formularioProveedores)
      await AxiosPrivado
        .post(guardarProveedor, formularioProveedores)
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
    const manejadorProveedores = (event) => {
      setFormularioProveedores({
        ...formularioProveedores,
        [event.target.name]: event.target.value,
      });
    };
  
    const manejarCambioNumeros = (index, value) => {
      const nuevosNumeros = [...formularioProveedores.numeros];
      nuevosNumeros[index] = { numero: value };
  
      setFormularioProveedores({
        ...formularioProveedores,
        numeros: nuevosNumeros,
      });
    };
  
    const agregarNumero = () => {
      setFormularioProveedores((prevState) => ({
        ...prevState,
        numeros: [...prevState.numeros, { numero: "" }],
      }));
    };
    const eliminarNumero = (index) => {
      setFormularioProveedores((prevState) => {
        const nuevosNumeros = [...prevState.numeros];
        nuevosNumeros.splice(index, 1);
        return { ...prevState, numeros: nuevosNumeros };
      });
    };
    const modificarProveedores = () => {
      const regex = /^[a-zA-Z]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correo electrónico
      // Validar campos vacíos
      if (formularioProveedores.rtn === "") {
        console.log("Por favor, complete todos los campos");
        setErrorrtn(true);
        mostraAlerta("Por favor, complete todos los campos", "warning");
        return;
      }
      if (!regex.test(formularioProveedores.nombre)) {
        console.log("El campo primernombre solo debe contener letras");
        setErrornombre(true);
        mostraAlerta(
          "El campo primer nombre solo debe contener letras",
          "warning"
        );
        return;
      }
      
      
  
      setErrornombre(false);
      setErrorrtn(false);
  
      AxiosPrivado
        .put(editarProveedor + formularioProveedores.id, formularioProveedores)
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
      setNombreLugar("Seleccione un lugar");
      setErrorcorreo(false);
      setErrorrtn(false);
      setFormularioProveedores({
        id: null,
        rtn: "",
        nombre: "",
        lugarId: null,
        direccion: "",
        correo: "",
        activo: true,
        numeros: [{ numero: "" }],
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
              Crear Proveedor
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
            <h4 className="modal-title text-primary">Formulario de Proveedores</h4>
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
                
                  <div className="col-sm-2">
  
                    <div className="form-group">
                    
                      {accion ? (
                        <>
  
  
                        </>
                      ) : (
                        <>
                          

                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-10">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">RTN</label>
                      <input
                        type="text"
                        className={`form-control ${errorrtn ? "is-invalid" : ""
                          }`}
                        id="text"
                        placeholder="Ingrese la RTN"
                        name="rtn"
                        value={formularioProveedores.rtn}
                        onChange={manejadorProveedores}
                      />
                    </div>
                  </div>
                <div className="row">
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Nombre</label>
                      <input
                        type="text"
                        className={`form-control ${errornombre ? "is-invalid" : ""
                          }`}
                        id="text"
                        placeholder="Nombre"
                        name="nombre"
                        value={formularioProveedores.nombre}
                        onChange={manejadorProveedores}
                      />
                    </div>
                  </div>
  
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Correo</label>
                      <input
                        type="text"
                        className={`form-control ${errorcorreo ? "is-invalid" : ""
                          }`}
                        id="text"
                        placeholder="Correo"
                        name="correo"
                        value={formularioProveedores.correo}
                        onChange={manejadorProveedores}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    <label>Lugar</label>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Ej: 0123"
                        value={nombreLugar}
                        disabled
                      />
                      <BuscarLugar lista={listaLugares} buscarIdlugar={buscarIdlugar}></BuscarLugar>
                    </div>
                    <div className="form-group">
                      <label>Dirección del Proveedor</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Ingrese Direccion del Proveedor"
                        value={formularioProveedores.direccion}
                        name="direccion"
                        onChange={manejadorProveedores}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label>Teléfonos</label>
                    <div className="row">
                      <div className="col-sm-9">
                        <div className="form-group">
                          {formularioProveedores.numeros.map((numero, index) => (
                            <div key={index} className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: 98908767"
                                name="numeros"
                                value={numero.numero}
                                onChange={(event) =>
                                  manejarCambioNumeros(index, event.target.value)
                                }
                              />
                              {formularioProveedores.numeros.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => eliminarNumero(index)}
                                  width="20px"
                                >
                                  <i className="fa fa-minus" aria-hidden="true"></i>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <Button
                          variant="info"
                          onClick={agregarNumero}
                          width="20px"
                        >
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Estado
                      </label>
                      <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch3"
                          name="activo"
                          checked={formularioProveedores.activo}
                          onChange={(event) => {
                            setFormularioProveedores({
                              ...formularioProveedores,
                              activo: event.target.checked,
                            });
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch3"
                        >
                          {formularioProveedores.activo ? 'Activo' : 'Inactivo'}
                        </label>
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
                <Button variant="primary" onClick={saveProveedores}>
                  Guardar
                </Button>
              ) : (
                <Button variant="info" onClick={modificarProveedores}>Modificar</Button>
              )}
            </div>
          </div>
  
  
        </Modal>
        <ModalInformacionProveedores datos={datosProveedores} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionProveedores>
      </>
    );
  }
  
  export default ModalProveedorForm;
  