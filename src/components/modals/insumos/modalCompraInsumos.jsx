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
    guardarCompraInsumos,
    editarCompraInsumos,
    imagenFactura,
    comprainsumosEditarImagen,
} from "../../apiUrls";
import ModalInformacionCompraInsumos from "./modalInformacionCompraInsumos";
import { AxiosImagen, AxiosPrivado } from "../../axios/Axios";
import BuscarInsumo from "./BuscarInsumo";



function ModalCompraInsumosForm({ accion, datosCompraInsumos, ActualizarTabla, listaInsumos, listaProveeedor, listaCajas, listaUsuarios, datosProveedores, datosCajas, datosUsuarios }) {
    const usuario = useContextUsuario()?.usuario;
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [subtotal, setSubtotal] = useState(0);
    const [totalCompra, setTotalCompra] = useState(0);
    const [proveedorId, setProveedorId] = useState(null);
    const [cajaId, setCajaId] = useState(null);
    const [errorcantidad, setErrorcantidad] = useState(false);
    const [errorpreciounitario, setErrorpreciounitario] = useState(false);
    const [errortipopago, setErrortipopago] = useState(false);
    const [errorunidadmedida, setErrorunidadmedida] = useState(false);
    const [errorfechacompra, setErrorfechacompra] = useState(false);
    const [nombreInsumo, setNombreInsumo] = useState("Selecione un Insumo");
    const [imagenSeleccionada, setImagenSeleccionada] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);
    const [fechacompra, setFechaCompra] = useState(new Date()); // Inicializa la fecha de compra


    <DatePicker
        selected={fechacompra}
        onChange={date => setFechaCompra(date)}
        dateFormat="dd/MM/yyyy HH:mm" // Formato de fecha
    />


    const proveedores = datosProveedores?.map((f) => ({
        value: f.id,
        label: f.nombre,
    }));

    const cajas = datosCajas?.map((f) => ({
        value: f.id,
        label: f.nombre,
    }));



    const [formularioCompraInsumos, setFormularioCompraInsumos] = useState({
        id: datosCompraInsumos ? datosCompraInsumos.id : null,
        cantidad: datosCompraInsumos ? datosCompraInsumos.cantidad : "",
        unidadmedida: datosCompraInsumos ? datosCompraInsumos.unidadmedida : "",
        preciounitario: datosCompraInsumos ? datosCompraInsumos.preciounitario : "",
        subtotal: datosCompraInsumos ? datosCompraInsumos.subtotal : "",
        fechacompra: datosCompraInsumos ? new Date(datosCompraInsumos.fechacompra) : new Date(), // Asigna la fecha actual si no hay datos de compra
        tipopago: datosCompraInsumos ? datosCompraInsumos.tipopago : "",
        totalcompra: datosCompraInsumos ? datosCompraInsumos.totalcompra : "",
        documentofactura: datosCompraInsumos ? datosCompraInsumos.documentofactura : "compra-sin-factura.png",
        InsumoId: datosCompraInsumos ? datosCompraInsumos.InsumoId : null,
        proveedorId: datosCompraInsumos ? datosCompraInsumos.proveedorId : null,
        cajaId: datosCompraInsumos ? datosCompraInsumos.cajaId : null,
        usuarioId: datosCompraInsumos ? datosCompraInsumos.usuarioId : null,

    });
    const [urlImagen, setUrlImagen] = useState(imagenFactura + "compra-sin-factura.png");



    useEffect(() => {

        if (datosCompraInsumos != null) {

            setProveedorId(datosCompraInsumos.proveedorId);
            setCajaId(datosCompraInsumos.cajaId);
            buscarIdInsumo(datosCompraInsumos.InsumoId);
            setFormularioCompraInsumos({
                ...formularioCompraInsumos,
                ...datosCompraInsumos
            });
            setUrlImagen(imagenFactura + datosCompraInsumos.documentofactura);


        }
        else {
            limpiarCampos();
        }
    }, [])



    useEffect(() => {
        if (datosCompraInsumos != null && !datosCargados) {
            setProveedorId(datosCompraInsumos.proveedorId);
            setCajaId(datosCompraInsumos.cajaId);
            setUrlImagen(imagenFactura + datosCompraInsumos.documentofactura);
            buscarIdInsumo(datosCompraInsumos.InsumoId);
            setFormularioCompraInsumos({
                ...formularioCompraInsumos,
                ...datosCompraInsumos
            });
            setDatosCargados(true); // Marcar los datos como cargados
        }
    }, [showModal, datosCompraInsumos, datosCargados]);


    useEffect(() => {
        setFormularioCompraInsumos({
            ...formularioCompraInsumos,
            proveedorId: proveedorId,
            cajaId: cajaId
        })
    }, [fechacompra, proveedorId, cajaId])

    const buscarIdInsumo = (id) => {
        const InsumoSeleccionado = listaInsumos?.find(
            (f) =>
                f.id == id
        );
        if (InsumoSeleccionado) {
            setFormularioCompraInsumos({
                ...formularioCompraInsumos,
                InsumoId: parseInt(id)
            });
            setNombreInsumo(InsumoSeleccionado.nombre);
        }
        else {
            setFormularioCompraInsumos({
                ...formularioCompraInsumos,
                InsumoId: null
            });
            setNombreInsumo("Seleccione un Insumo");
        }
    };

    // Función para calcular el subtotal y el total
    const calcularTotales = () => {
        const cantidad = parseFloat(formularioCompraInsumos.cantidad);
        const precioUnitario = parseFloat(formularioCompraInsumos.preciounitario);
        const subtotalCalculado = isNaN(cantidad) || isNaN(precioUnitario) ? 0 : cantidad * precioUnitario;
        setSubtotal(subtotalCalculado);
        setTotalCompra(subtotalCalculado); // Aquí podrías agregar lógica adicional si es necesario para calcular el total de otra manera
    };

    // Llama a la función de cálculo cuando cambian la cantidad o el precio unitario
    useEffect(() => {
        calcularTotales();
    }, [formularioCompraInsumos.cantidad, formularioCompraInsumos.preciounitario]);

    const saveCompraInsumos = async () => {
        const regex = /^[1-9]\d*(\.\d+)?$/;
        if (formularioCompraInsumos.cantidad === "" || formularioCompraInsumos.preciounitario === "" || formularioCompraInsumos.unidadmedida === "" || formularioCompraInsumos.tipopago === "") {
            mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
            setErrorcantidad(formularioCompraInsumos.cantidad === "");
            setErrorpreciounitario(formularioCompraInsumos.preciounitario === "");
            setErrorunidadmedida(formularioCompraInsumos.unidadmedida === "");
            setErrortipopago(formularioCompraInsumos.tipopago === "");
            return;
        }

        if (!regex.test(formularioCompraInsumos.cantidad)) {
            console.log("El campo cantidad solo debe contener numeros");
            setErrorcantidad(true);
            mostraAlerta(
                "El campo cantidad solo debe contener numeros",
                "warning"
            );
            return;
        }
        if (!regex.test(formularioCompraInsumos.preciounitario)) {
            console.log("El campo precio unitario solo debe contener numeros");
            setErrorpreciounitario(true);
            mostraAlerta(
                "El campo precio unitario solo debe contener numeros",
                "warning"
            );
            return;
        }
        if (formularioCompraInsumos.InsumoId == null) {
            mostraAlerta("Seleccione el Insumo", "warning");
            return;
        }
        setErrorcantidad(false);
        setErrorpreciounitario(false);

        try {
            // Agregar el ID del usuario al objeto formularioCompraInsumos
            const datosCompra = {
                ...formularioCompraInsumos,
                usuarioId: usuario.id, // Aquí se asigna el ID del usuario
            };

            // Realizar la solicitud POST con los datos actualizados
            await AxiosPrivado
                .post(guardarCompraInsumos, datosCompra)
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
                    mostraAlerta("Ha ocurrido un error al guardar la compra de insumos. Por favor, inténtalo de nuevo más tarde.", "error");
                });
        } catch (error) {
            console.error("Error:", error);
            mostraAlerta(error, "error");
        }
    };

    const manejadorCompraInsumos = (event) => {
        const { name, value } = event.target;

        // Verificar si el valor ingresado no es una cadena vacía
        if (value !== "") {
            if (name === 'InsumoId' || name === 'preciounitario') {
                setFormularioCompraInsumos({
                    ...formularioCompraInsumos,
                    [name]: parseFloat(value) // Convertir a flotante solo si no es una cadena vacía
                });
            } else {
                setFormularioCompraInsumos({
                    ...formularioCompraInsumos,
                    [name]: name === 'cantidad' ? parseFloat(value) : value,
                });
            }
        } else {
            // Si el valor es una cadena vacía, establecer el valor en el estado como una cadena vacía
            setFormularioCompraInsumos({
                ...formularioCompraInsumos,
                [name]: value,
            });
        }
    }


    const handleDateChange = (date) => {
        setFechaCompra(date); // Actualizar el estado de la fecha de compra cuando cambia
    };


    const modificarCompraInsumos = () => {
        const regex = /^[1-9]\d*(\.\d+)?$/;
        // Validar campos vacíos
        if (!regex.test(formularioCompraInsumos.cantidad)) {
            console.log("El campo cantidad solo debe contener numeros");
            setErrorcantidad(true);
            mostraAlerta(
                "El campo cantidad solo debe contener numeros",
                "warning"
            );
            return;
        }
        if (!regex.test(formularioCompraInsumos.preciounitario)) {
            console.log("El campo cantidad solo debe contener numeros");
            setErrorpreciounitario(true);
            mostraAlerta(
                "El campo cantidad solo debe contener numeros",
                "warning"
            );
            return;
        }

        setErrorcantidad(false);
        setErrorpreciounitario(false);

        AxiosPrivado
            .put(editarCompraInsumos + formularioCompraInsumos.id, formularioCompraInsumos)
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
                console.error("Error:", error.message);
                if (error.response) {
                    // La solicitud fue hecha y el servidor respondió con un estado de error
                    console.error("Error de respuesta:", error.response.data);
                    console.error("Código de estado:", error.response.status);
                    console.error("Headers:", error.response.headers);
                } else if (error.request) {
                    // La solicitud fue hecha pero no se recibió ninguna respuesta
                    console.error("Error de solicitud:", error.request);
                } else {
                    // Algo sucedió en la configuración de la solicitud que desencadenó un Error
                    console.error("Error:", error.message);
                }
                mostraAlerta("Ha ocurrido un error al modificar la compra de insumos. Por favor, inténtalo de nuevo más tarde.", "error");
            });


    };

    const limpiarCampos = () => {
        setErrorcantidad(false);
        setErrorpreciounitario(false);
        setNombreInsumo("Seleccione un Insumo");
        setUrlImagen(imagenFactura + "compra-sin-factura.png");
        setFormularioCompraInsumos({
            id: null,
            cantidad: "",
            preciounitario: "",
            fechacompra: new Date(),
            InsumoId: null,
            proveedorId: null,
            cajaId: null,
            imagenFactura:
                "compra-sin-factura.png",
        });
        setCajaId(null);
        setProveedorId(null);
    };


    const handleOpenModal = () => {
        setShowModalInformacion(true);
    };

    const inputRef = useRef(null);

    const SeleccionarImagen = () => {
        // 👇️ open file input box on click of another element
        console.log("Haciendo clic en SeleccionarImagen");
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = async event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        else {
            try {
                let formData = new FormData();
                formData.append("imagen", event.target.files[0]);
                const respuesta = await AxiosImagen.put(comprainsumosEditarImagen + formularioCompraInsumos.id,
                    formData,
                );
                if (respuesta.data.tipo === 1) {
                    //formularioCompraInsumos.Imagen = respuesta.data.datos.Imagen;
                    setFormularioCompraInsumos({
                        ...formularioCompraInsumos,
                        documentofactura: respuesta.data.datos.documentofactura,
                    });
                    setUrlImagen(imagenFactura + respuesta.data.datos.documentofactura);
                    ActualizarTabla();
                    mostraAlertaOk(respuesta.data.msj);
                }
            } catch (error) {
                console.log(error);
                mostraAlertaError("Error al actualizar la imagen");
            }
        }
    };

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Compra Insumo
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
                    <h4 className="modal-title text-primary">Formulario de Compra Insumo</h4>
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

                                    <div className="form-group">
                                        <div className="text-center">
                                            <img className="product-image" src={urlImagen} alt="Foto" />
                                        </div>
                                        {accion ? (
                                            <>


                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    ref={inputRef}
                                                    onChange={handleFileChange}
                                                />
                                                <Button
                                                    variant="light"
                                                    className="btn btn-block btn-outline-info btn-xs"
                                                    onClick={SeleccionarImagen}
                                                >
                                                    Actualizar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <label>Insumos</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Ej: 0123"
                                            value={nombreInsumo}
                                            disabled
                                        />
                                        <BuscarInsumo listaInsu={listaInsumos} buscarIdInsumo={buscarIdInsumo}></BuscarInsumo>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Cantidad</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorcantidad ? "is-invalid" : ""
                                                }`}
                                            id="text"
                                            placeholder="Cantidad"
                                            name="cantidad"
                                            value={formularioCompraInsumos.cantidad}
                                            onChange={manejadorCompraInsumos}
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Unidad Medida</label>
                                        <select
                                            id="unidadMedida"
                                            name="unidadmedida"
                                            className={`form-control ${errorunidadmedida ? "is-invalid" : ""
                                                }`}
                                            value={formularioCompraInsumos.unidadmedida}
                                            onChange={manejadorCompraInsumos}
                                        >
                                            <option value="" > </option>
                                            <option value="Libra">Libra</option>
                                            <option value="Kilogramo">Kilogramo</option>
                                            <option value="Onzas">Onzas</option>
                                            <option value="Gramo">Gramo</option>
                                            <option value="Litro">Litro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Tipo Pago</label>
                                        <select
                                            id="tipoPago"
                                            name="tipopago"
                                            className={`form-control ${errortipopago ? "is-invalid" : ""
                                                }`}
                                            value={formularioCompraInsumos.tipopago}
                                            onChange={manejadorCompraInsumos}
                                        >
                                            <option value="" > </option>
                                            <option value="Contado">Contado</option>
                                            <option value="Credito">Credito</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            Precio Unitario
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorpreciounitario ? "is-invalid" : ""
                                                }`}
                                            id="text"
                                            placeholder="Precio Unitario "
                                            name="preciounitario"
                                            value={formularioCompraInsumos.preciounitario}
                                            onChange={manejadorCompraInsumos}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            SubTotal
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={subtotal.toFixed(2)} // Ajusta el formato según lo necesites
                                            readOnly // Esto hace que el campo sea de solo lectura
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            Total
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={totalCompra.toFixed(2)} // Ajusta el formato según lo necesites
                                            readOnly // Esto hace que el campo sea de solo lectura
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            Cajas
                                        </label>
                                        <Select
                                            value={
                                                cajaId &&
                                                cajas?.find(
                                                    (opcion) =>
                                                        opcion.value === cajaId
                                                )
                                            }
                                            onChange={(event) => {
                                                setCajaId(event.value);
                                            }}
                                            options={cajas}
                                            isSearchable={true}
                                        ></Select>

                                    </div>
                                </div>

                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            Proveedores
                                        </label>
                                        <Select
                                            value={
                                                proveedorId &&
                                                proveedores?.find(
                                                    (opcion) =>
                                                        opcion.value === proveedorId
                                                )
                                            }
                                            onChange={(event) => {
                                                setProveedorId(event.value);
                                            }}
                                            options={proveedores}
                                            isSearchable={true}
                                        ></Select>

                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-3 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="fechacompra">
                                        Fecha de Compra
                                    </label>
                                    <DatePicker
                                        className={`form-control ${errorfechacompra ? "is-invalid" : ""}`}
                                        selected={fechacompra}
                                        onChange={date => setFechaCompra(date)}
                                        dateFormat="dd/MM/yyyy HH:mm a" // Formato de fecha
                                        id="fechacompra"
                                        name="fechacompra"
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
                        {accion ? (
                            <Button variant="primary" onClick={saveCompraInsumos}>
                                Guardar
                            </Button>
                        ) : (
                            <Button variant="info" onClick={modificarCompraInsumos}>Modificar</Button>
                        )}
                    </div>
                </div>


            </Modal>
            <ModalInformacionCompraInsumos datos={datosCompraInsumos} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionCompraInsumos>
        </>
    );
}

export default ModalCompraInsumosForm;