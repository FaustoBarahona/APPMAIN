import React, { useEffect, useState } from "react";
import $ from 'jquery';
import { AxiosPrivado } from "../axios/Axios";
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextProducto } from "../../contexto/compra/ProductoContext";
import { listarProductos } from "../apiUrls";
import ModalProductoForm from "../modals/Compras/modalProductos";
import { createRoot } from 'react-dom/client';
import ComponentePadre from "../../reportes/Salidas/PageReporteMovimientos"; 
import {useNavigate} from 'react-router-dom'

const Tabla = (props) => {
    const { listaProductos, setListaProductos } = useContextProducto();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [productoIdSeleccionado, setProductoIdSeleccionado] = useState(null); 
    const [nombre, setNombreSeleccionado] =useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        ActualizarTabla();
    }, []);

    useEffect(() => {
        crearTabla();
    }, [listaProductos]);

    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarProductos);
            setListaProductos(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde, Revise su conexion");
        }
        setCargandoDatos(false);
    }


        
    const abrirReporteEnMismaPestana = (productoId) => {
        setProductoIdSeleccionado(productoId);

        // Navegar a la ruta del reporte con el productoId
        navigate(`/app/reportemovimientos/${productoId}`);
    }

    const abrirReporteVariacionCostos = (productoId, nombre) => {
        setProductoIdSeleccionado(productoId);
        setNombreSeleccionado(nombre);
        // Navegar a la ruta del reporte con el productoId
        navigate(`/app/reportevariacioncostos/${productoId}/${nombre}`);
    }

    const crearTabla = () => {
        let table = new DataTable('#tablaProductos', {
            data: listaProductos,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "codigobarra",
                    "title": "Codigo de Barra",
                },
                {
                    "targets": 2,
                    "data": "nombre",
                    "title": "Nombre",
                },
                {
                    "targets": 3,
                    "data": "existencia",
                    "title": "Existencias"
                },
                {
                    "targets": 4,
                    "data": "costo",
                    "title": "Costo",
                },
                {
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <>
                                
                                <ModalProductoForm
                                    key={rowData.id}
                                    accion={false}
                                    datosProducto={rowData}
                                    ActualizarTabla={ActualizarTabla}
                                ></ModalProductoForm>
                                
                            </>
                        );
                    }
                },
                {
                    "targets": 6,
                    "data": null,
                    "title": "Reportes",
                    createdCell: (td, rowData,) => {
                        const root = createRoot(td);
                        root.render(
                            <>
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={() => abrirReporteEnMismaPestana(rowData.id)}
                                >
                                    Movimientos
                                </button>
                                <button
                                    className="btn btn-primary my-1"
                                    onClick={() => abrirReporteVariacionCostos(rowData.id, rowData.nombre)}
                                >Variacion Costos</button>
                            </>
                        );
                    }
                },
            ],
            "paging": true,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
            "responsive": true,
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            destroy: true,
            drawCallback: function () {
                $('.dataTables_filter').find("[aria-controls='tablaProductos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaProductos" className="table table-bordered table-hover">
            </table>

            
        </div>
    )
}

export default Tabla;
