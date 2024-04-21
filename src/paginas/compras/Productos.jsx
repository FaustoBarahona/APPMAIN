import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { listarProductos } from "../../components/apiUrls";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { AxiosPrivado } from "../../components/axios/Axios";
import { useContextProducto } from "../../contexto/compra/ProductoContext";
import TablaProductos from "../../components/tablas/TablaProductos";
import ModalProductoForm from "../../components/modals/Compras/modalProductos";

function Producto() {
    const { setListaProductos } = useContextProducto();
    const ActualizarTabla = async () => {
        try {
            const response = await AxiosPrivado.get(listarProductos);
            setListaProductos(response.data.datos);
            console.log(response.data.datos)
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexion");
        }
    }
    return (
        <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Productos</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><Link to={"/app/home"}>Inicio</Link></li>
                  <li className="breadcrumb-item active">Productos</li>
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
                    <h3 className="card-title">Productos</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">Modulo de productos</h6>
                    <p className="card-text">Este modulo le permite gestionar la información de cada uno de los productos.</p>
                    <ModalProductoForm buttonLabel="Agregar Producto" accion={true} datosProducto={null} ActualizarTabla={ActualizarTabla} />
                    <span style={{ margin: "0 12px" }}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">Lista de productos</h3>
                  </div>
  
                  <div className="card-body">
                    <TablaProductos></TablaProductos>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );   

}

export default Producto;