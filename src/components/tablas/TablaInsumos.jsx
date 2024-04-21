import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalInsumoForm from "../modals/insumos/modalInsumos";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextInsumos } from "../../contexto/insumos/InsumosContext";
import { listarInsumos } from "../apiUrls";
import Cargando from "../Cargando"

const Tabla = (props) => {
    //console.log(insumos)
    const { listaInsumos, setListaInsumos, } = useContextInsumos();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaInsumos])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarInsumos);
            setListaInsumos(response.data.datos);
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
        let table = new DataTable('#tablaInsumos', {
            data: listaInsumos,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "nombre",
                    "title": "Nombre",
                },
                {
                    "targets": 2,
                    "data": "descripcion",
                    "title": "Descripcion",
                    
                },
                {
                    "targets": 3,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalInsumoForm key={rowData.id} accion={false} datosInsumos={rowData} ActualizarTabla={ActualizarTabla} ></ModalInsumoForm>
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
            <table id="tablaInsumos" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default Tabla;