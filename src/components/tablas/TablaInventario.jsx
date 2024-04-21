import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalInventarioForm from "../modals/inventario/modalInventario";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextInventario } from "../../contexto/inventario/InventarioContext";
import { listarInventario } from "../apiUrls";
import Cargando from "../Cargando"



const Tabla = (props) => {
    //console.log(inventario)
    const { listaInventario, setListaInventario, listaInsumos } = useContextInventario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaInventario])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarInventario);
            setListaInventario(response.data.datos);
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
        let table = new DataTable('#tablaInventario', {
            data: listaInventario,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "cantidad",
                    "title": "Cantidad",
                },
                {
                    "targets": 2,
                    "data": "InsumoId",
                    "title": "Nombre del Insumo",
                    "render": function(data, type, row, meta) {
                        // Encuentra el insumo correspondiente al ID
                        const insumo = listaInventario.find(item => item.id === data);
                        return insumo ? insumo.Insumo.nombre : ''; // Devuelve el nombre del insumo o vacío si no se encuentra
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
                $('.dataTables_filter').find("[aria-controls='tablaInventario10']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaInventario" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default Tabla;