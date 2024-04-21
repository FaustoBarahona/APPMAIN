import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { formToJSON } from "axios";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import Select from "react-select";
import ModalInformacionInventario from "./modalInformacionInventario";
import { AxiosPrivado } from "../../axios/Axios";



function ModalInventarioForm({ accion, datosInventario, ActualizarTabla, }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [errorcantidad, setErrorcantidad] = useState(false);
  


  const [formularioInsumos, setFormularioInsumos] = useState({
    id: datosInventario ? datosInventario.id : null,
    cantidad: datosInventario ? datosInventario.cantidad : "",
    InsumoId: datosInventario? datosInventario.InsumoId : null,
  });




}

export default ModalInventarioForm;
