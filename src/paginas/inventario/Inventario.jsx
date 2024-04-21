import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import TablaInventario from "../../components/tablas/TablaInventario";
import "react-datepicker/dist/react-datepicker.css";
import ModalInventarioForm from "../../components/modals/inventario/modalInventario";
import Cargando from "../../components/Cargando";
import Tabla from "../../components/tablas/TablaInventario";
import { useContextInventario } from '../../contexto/inventario/InventarioContext';
import { listarInventario } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
const Inventario = () => {
  const {  setListaInventario } = useContextInventario();
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    //fetchData();
  }, []);
  const ActualizarTabla = async () => {
    try {
      const response = await AxiosPrivado.get(listarInventario);
      setListaInventario(response.data.datos);
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
                <h1>Inventario</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Inicio</a></li>
                  <li className="breadcrumb-item active">Inventario</li>
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
                    <h3 className="card-title">Inventario</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de Inventario</h6>
                    <p className="card-text">Este modulo le permite gestionar la información del Inventario.</p>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Lista de Inventario</h3>
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

export default Inventario;
