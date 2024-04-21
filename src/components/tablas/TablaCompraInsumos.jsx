import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalCompraInsumosForm from "../modals/insumos/modalCompraInsumos";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextCompraInsumos } from "../../contexto/insumos/CompraInsumoContext";
import { listarCompraInsumos } from "../apiUrls";
import Cargando from "../Cargando"

const Tabla = (props) => {
    //console.log(comprainsumos)
    const { listaCompraInsumos, setListaCompraInsumos, listaInsumos, listaProveedores, listaCaja, listaUsuario } = useContextCompraInsumos();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaCompraInsumos])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarCompraInsumos);
            setListaCompraInsumos(response.data.datos);
            console.log(response.data.datos)
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde. Revise su conexión.");
            //mostraAlertaModificar();
        }
        setCargandoDatos(false);
    }
    const CrearTabla = () => {
        console.log("Se actualizo")
        let table = new DataTable('#tablaCompraInsumos10', {
            data: listaCompraInsumos,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "InsumoId",
                    "title": "Nombre del Insumo",
                    render: (data, type, row) => {
                        const insumo = listaInsumos.find(insumo => insumo.id === row.InsumoId);
                        return insumo ? insumo.nombre : 'Insumo no encontrado';
                    }
                },
                {
                    "targets": 2,
                    "data": "cantidad",
                    "title": "Cantidad",
                },
                {
                    "targets": 3,
                    "data": "fechacompra",
                    "title": "Fecha de la Compra",
                },
                {
                    "targets": 4,
                    "data": "totalcompra",
                    "title": "Total de la Compra",
                },
                {
                    "targets": 5,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalCompraInsumosForm key={rowData.id} accion={false} datosCompraInsumos={rowData} ActualizarTabla={ActualizarTabla} listaInsumos={listaInsumos} datosProveedores={listaProveedores} datosCajas={listaCaja} datosUsuarios={listaUsuario} ></ModalCompraInsumosForm>
                        );
                    }
                },
            ],
            "paging": true,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
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
                $('.dataTables_filter').find("[aria-controls='tablaClientes10']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaCompraInsumos10" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default Tabla;