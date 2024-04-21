import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { formToJSON } from "axios";
import DatePicker from "react-datepicker";
import { useContextUsuario } from '../../../contexto/usuario/UsuarioContext';
import "react-datepicker/dist/react-datepicker.css";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import moment from 'moment';
import 'moment/locale/es'; // Importa el localizador de idioma si lo necesitas
import Select from "react-select";
import {
    guardarSalidaInventario
} from "../../apiUrls";
import ModalInformacionSalidaInventario from "./modalInformacionSalidaInventario";
import { AxiosPrivado } from "../../axios/Axios";
import BuscarInventario from "./BuscarInventario";



function ModalSalidaInventarioForm({ accion, datosSalidaInventario, ActualizarTabla, listaInventario, listaInsumos }) {
    const usuario = useContextUsuario()?.usuario;
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [errorcantidadsalida, setErrorcantidadsalida] = useState(false);
    const [nombreInventario, setNombreInventario] = useState("Selecione uno de los Insumos");
    const [datosCargados, setDatosCargados] = useState(false);
    const [errorfechasalida, setErrorfechasalida] = useState(false);
    const [fechasalida, setFechaSalida] = useState(new Date()); // Inicializa la fecha de compra


    <DatePicker
        selected={fechasalida}
        onChange={date => setFechaSalida(date)}
        dateFormat="dd/MM/yyyy HH:mm" // Formato de fecha
    />


    const [formularioSalidaInventario, setFormularioSalidaInventario] = useState({
        id: datosSalidaInventario ? datosSalidaInventario.id : null,
        cantidadsalida: datosSalidaInventario ? datosSalidaInventario.cantidadsalida : "",
        fechasalida: datosSalidaInventario ? new Date(datosSalidaInventario.fechasalida) : new Date(), // Asigna la fecha actual si no hay datos de compra
        InventarioId: datosSalidaInventario ? datosSalidaInventario.InventarioId : null,
        usuarioId: datosSalidaInventario ? datosSalidaInventario.usuarioId : null,

    });


    useEffect(() => {

        if (datosSalidaInventario != null) {

            buscarIdInventario(datosSalidaInventario.InventarioId);
            setFormularioSalidaInventario({
                ...formularioSalidaInventario,
                ...datosSalidaInventario
            });


        }
        else {
            limpiarCampos();
        }
    }, [])



    useEffect(() => {
        if (datosSalidaInventario != null && !datosCargados) {
            buscarIdInventario(datosSalidaInventario.InventarioId);
            setFormularioSalidaInventario({
                ...formularioSalidaInventario,
                ...datosSalidaInventario
            });
            setDatosCargados(true); // Marcar los datos como cargados
        }
    }, [showModal, datosSalidaInventario, datosCargados]);



    const buscarIdInventario = (id) => {
        const InventarioSeleccionado = listaInventario?.find(
            (f) =>
                f.id == id
        );
        if (InventarioSeleccionado) {
            setFormularioSalidaInventario({
                ...formularioSalidaInventario,
                InventarioId: parseInt(id)
            });
            setNombreInventario(InventarioSeleccionado.id);
        }
        else {
            setFormularioSalidaInventario({
                ...formularioSalidaInventario,
                InventarioId: null
            });
            setNombreInventario("Seleccione un Insumo a Sacar");
        }
    };


    const saveSalidaInventario = async () => {
        const regex = /^[1-9]\d*(\.\d+)?$/;
        if (formularioSalidaInventario.cantidadsalida === "") {
            mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
            setErrorcantidadsalida(formularioSalidaInventario.cantidadsalida === "");
            return;
        }

        if (!regex.test(formularioSalidaInventario.cantidadsalida)) {
            console.log("El campo cantidad salida solo debe contener numeros");
            setErrorcantidad(true);
            mostraAlerta(
                "El campo cantidad salida solo debe contener numeros",
                "warning"
            );
            return;
        }
        if (formularioSalidaInventario.InventarioId == null) {
            mostraAlerta("Seleccione el Insumo a sacar", "warning");
            return;
        }
        setErrorcantidadsalida(false);

        try {
            // Agregar el ID del usuario al objeto formularioCompraInsumos
            const datosCompra = {
                ...formularioSalidaInventario,
                usuarioId: usuario.id, // Aquí se asigna el ID del usuario
            };

            // Realizar la solicitud POST con los datos actualizados
            await AxiosPrivado
                .post(guardarSalidaInventario, datosCompra)
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
                    console.error("Error:", error.message);
                    if (error.response) {
                        console.error("Error de respuesta:", error.response.data);
                        console.error("Código de estado:", error.response.status);
                        console.error("Headers:", error.response.headers);
                    } else if (error.request) {
                        console.error("Error de solicitud:", error.request);
                    } else {
                        console.error("Error:", error.message);
                    }
                    mostraAlerta("Ha ocurrido un error al guardar la salida de insumos. Por favor, inténtalo de nuevo más tarde.", "error");
                });
        } catch (error) {
            console.error("Error:", error);
            mostraAlerta(error, "error");
        }
    };

    const manejadorSalidaInventario = (event) => {
        const { name, value } = event.target;

        // Verificar si el valor ingresado no es una cadena vacía
        if (value !== "") {
            if (name === 'InventarioId') {
                setFormularioSalidaInventario({
                    ...formularioSalidaInventario,
                    [name]: parseFloat(value) // Convertir a flotante solo si no es una cadena vacía
                });
            } else {
                setFormularioSalidaInventario({
                    ...formularioSalidaInventario,
                    [name]: name === 'cantidadsalida' ? parseFloat(value) : value,
                });
            }
        } else {
            // Si el valor es una cadena vacía, establecer el valor en el estado como una cadena vacía
            setFormularioSalidaInventario({
                ...formularioSalidaInventario,
                [name]: value,
            });
        }
    }

    const limpiarCampos = () => {
        setErrorcantidadsalida(false);
        setNombreInventario("Seleccione un Insumo del inventario");
        setFormularioSalidaInventario({
            id: null,
            cantidadsalida: "",
            fechasalida: new Date(),
            InventarioId: null,
        });
    };


    const handleDateChange = (date) => {
        setFechaSalida(date); // Actualizar el estado de la fecha de compra cuando cambia
    };



    const handleOpenModal = () => {
        setShowModalInformacion(true);
    };


    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Salida Inventario
                    </Button>
                </div>

            ) : (
                <div>
                    <Button variant="info" onClick={handleOpenModal}>
                        <i className="fas fa-folder">
                        </i>
                    </Button>
                </div>

            )}
            <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Salida de Inventario</h4>
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
                                <div className="col-sm-2">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <label>Inventario</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Ej: 0123"
                                            value={nombreInventario}
                                            disabled
                                        />
                                        <BuscarInventario listaIn={listaInventario} buscarIdInventario={buscarIdInventario}></BuscarInventario>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Cantidad de Salida</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorcantidadsalida ? "is-invalid" : ""
                                                }`}
                                            id="text"
                                            placeholder="Cantidad Salida"
                                            name="cantidadsalida"
                                            value={formularioSalidaInventario.cantidadsalida}
                                            onChange={manejadorSalidaInventario}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-3 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="fechasalida">
                                        Fecha de Salida
                                    </label>
                                    <DatePicker
                                        className={`form-control ${errorfechasalida ? "is-invalid" : ""}`}
                                        selected={fechasalida}
                                        onChange={date => setFechaSalida(date)}
                                        dateFormat="dd/MM/yyyy HH:mm a" // Formato de fecha
                                        id="fechasalida"
                                        name="fechasalida"
                                    />
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
                        <Button variant="primary" onClick={saveSalidaInventario}>
                            Guardar
                        </Button>

                    </div>
                </div>


            </Modal>
            <ModalInformacionSalidaInventario datos={datosSalidaInventario} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionSalidaInventario>
        </>
    );
}

export default ModalSalidaInventarioForm;