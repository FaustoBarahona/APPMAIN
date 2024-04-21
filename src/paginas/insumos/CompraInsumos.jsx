import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import TablaCompraInsumos from "../../components/tablas/TablaCompraInsumos";
import "react-datepicker/dist/react-datepicker.css";
import ModalCompraInsumosForm from "../../components/modals/insumos/modalCompraInsumos";
import Cargando from "../../components/Cargando";
import Tabla from "../../components/tablas/TablaCompraInsumos";
import { useContextCompraInsumos } from '../../contexto/insumos/CompraInsumoContext';
import { listarCompraInsumos } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
const CompraInsumos = () => {
  const {  setListaCompraInsumos, listaInsumos, listaProveedores, listaCaja, listaUsuario } = useContextCompraInsumos();
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    //fetchData();
  }, []);
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarCompraInsumos);
      setListaCompraInsumos(response.data.datos);
    } catch (error) {
      console.log(error);
      mostraAlertaError("El servidor no responde. Revise su conexión.");
      //mostraAlertaModificar();
    }
  }
  if (cargandoDatos) {
    return (
      <Cargando></Cargando>
    );
  }
  else {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Compra Insumos</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                  <li className="breadcrumb-item active">Compra Insumos</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Compra Insumos</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de Compra Insumos</h6>
                    <p className="card-text">Este modulo le permite gestionar la información de cada una de las Compras de Insumos.</p>
                    <ModalCompraInsumosForm buttonLabel="Crear Compra Insumo" accion={true} datosDelProyecto={null} ActualizarTabla={ActualizarTabla} listaInsumos={listaInsumos} datosProveedores={listaProveedores} datosCajas={listaCaja} datosUsuarios={listaUsuario} />
                    <span style={{ margin: "0 12px" }}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Lista de Compras de Insumos</h3>
                  </div>

                  <div className="card-body">
                    {
                      cargandoDatos ?
                        <p>Cargando</p>
                        :
                        <Tabla ></Tabla>
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default CompraInsumos;
