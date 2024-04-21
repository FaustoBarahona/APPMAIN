import React, { useEffect, useState, useContext, Suspense } from "react";
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import ModalSalidaInventarioForm from "../modals/inventario/modalSalidaInventario";
import { AxiosPrivado, AxiosPublico } from '../axios/Axios';
import { mostraAlerta, mostraAlertaError, mostraAlertaModificar, mostraAlertaOk, mostraAlertaPregunta } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useContextSalidaInventario } from "../../contexto/inventario/SalidaInventarioContext";
import { listarSalidaInventario } from "../apiUrls";
import Cargando from "../Cargando"

const Tabla = (props) => {
    //console.log(salidainventario)
    const { listaSalidaInventario, setListaSalidaInventario, listaInventario, listaUsuario, listaInsumos } = useContextSalidaInventario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    useEffect(() => {
        ActualizarTabla();
    }, [])
    useEffect(() => {
        CrearTabla();
    }, [listaSalidaInventario])
    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarSalidaInventario);
            setListaSalidaInventario(response.data.datos);
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
        let table = new DataTable('#tablaSalidaInventario10', {
            data: listaSalidaInventario,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "cantidadsalida",
                    "title": "Cantidad Salida",
                },
                {
                    "targets": 2,
                    "data": "fechasalida",
                    "title": "Fecha de Salida",
                },
                {
                    "targets": 3,
                    "data": "InventarioId",
                    "title": "Nombre del Insumo",
                    "render": function(data, type, row, meta) {
                        // Encuentra el insumo correspondiente al ID
                        const insumo = listaInventario.find(item => item.id === data);
                        return insumo ? insumo.Insumo.nombre : ''; // Devuelve el nombre del insumo o vacío si no se encuentra
                    }
                },
                {
                    "targets": 4,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                                <ModalSalidaInventarioForm key={rowData.id} accion={false} datosSalidaInventario={rowData} ActualizarTabla={ActualizarTabla} listaInventario={listaInventario} datosUsuarios={listaUsuario} listaInsumos={listaInsumos} ></ModalSalidaInventarioForm>
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
                $('.dataTables_filter').find("[aria-controls='tablaSalidaInventario10']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table id="tablaSalidaInventario10" className="table table-bordered table-hover">
            </table>
        </div>
    );
}

export default Tabla;