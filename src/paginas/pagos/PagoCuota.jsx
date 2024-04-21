import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Cargando from "../../components/Cargando";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import { mostraAlertaError, mostraAlertaOk } from "../../components/Alerts/sweetAlert";
import { Link } from "react-router-dom";
import { AxiosPrivado } from "../../components/axios/Axios";
import { buscarIdClienteContratoPagoPendiente } from "../../components/apiUrls";
import BuscarCliente from "../../components/modals/contratos/BuscarClientePagos";
import ModalPago from "../../components/modals/pagos/pago";
import { useContextPago } from "../../contexto/pagos/PagoContext";
import BuscarContrato from "../../components/modals/contratos/BuscarContrato";
import TablaPagoCuota from "../../components/tablas/TablaPagoCuotas";
import TablaPagoCuotasSeleccionadas from "../../components/tablas/TablaPagoCuotasSeleccionadas";
import moment from "moment";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
const PagoCuota = () => {
    const { listaClientes, caja, setAmortizaciones, amortizaciones, listaCuotas, setListaCuotas } = useContextPago();
    const { usuario } = useContextUsuario();
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [nombreCliente, setNombreCliente] = useState("Seleccione un cliente");
    const [listaContratos, setListaContratos] = useState([]);
    const [nombreContrato, setNombreContrato] = useState("Seleccione un contrato");
    const [contrato, setContrato] = useState({});
    const [pago, setPago] = useState({
        fecha: moment().format("YYYY-MM-DD"),
        pago: 0,
        clienteId: 0,
        usuarioId: usuario.id,
        tipo: 'CU',
        cajaId: caja?.id,
        contratoId: 0,
        pagocuotas: [],
    });
    const [total, setTotal] = useState(0);
    const [cantidadCuotas, setCantidadCuotas] = useState(0);
    const [totalCuotas, setTotalCuotas] = useState(0);
    const [amortizacion, setAmortizacion] = useState(0);
    const [saldoAnterior, setSaldoAnterior] = useState(0);
    const [nuevoSaldo, setNuevoSaldo] = useState(0);
    const [intereses, setIntereses] = useState(parseFloat(0));
    const [mora, setMora] = useState(parseFloat(0));
    const limpiarCampos = () => {
        setAmortizacion(0);
        setIntereses(0);
        setTotal(0);
        setMora(0);
        setTotalCuotas(0)
        setListaCuotas(0);
        setNuevoSaldo(0);
        setPago({
            fecha: moment().format("YYYY-MM-DD"),
            pago: 0,
            clienteId: 0,
            usuarioId: usuario.id,
            tipo: 'CU',
            cajaId: caja?.id,
            contratoId: 0,
            pagocuotas: [],
        })
    }

    useEffect(() => {
        limpiarCampos();
    }, []);
    useEffect(() => {

    }, [contrato]);
    useEffect(() => {
        if (contrato.contratocuota) {
            llenarListaCuotas();
        }
    }, [cantidadCuotas]);

    useEffect(() => {
        /*if(mora==0){
            llenarListaCuotasMoraCero();
        } */  
    }, [mora]);

    useEffect(() => {
        const contratosaldos = {
            saldoanterior: saldoAnterior,
            abono: amortizacion,
            saldoactual: nuevoSaldo,
        }
        setPago({
            ...pago,
            contratosaldos: contratosaldos
        })
    }, [saldoAnterior, amortizacion, nuevoSaldo]);

    const manejadorPagoCuota = (event) => {
        setPago({
            ...pago,
            [event.target.name]: event.target.value,
        })
    };
    const llenarListaCuotas = () => {
        if (cantidadCuotas > 0) {
            var cantidad = 0;
            var lista = [];
            var lista2 = [];
            var totalMora = 0;
            var totalPago = 0
            var totalamortizacion = 0;
            var totalInteres = 0;
            contrato.contratocuota?.forEach((f) => {
                
                if (cantidad < cantidadCuotas && f.estado!='PA') {
                    console.log(f);
                    lista.push(f);
                    cantidad++;
                }
            });
            lista.forEach((f) => {
                var moraCuota = 0;
                totalPago += parseFloat(f.cuota);
                totalamortizacion += parseFloat(f.amortizacioncapital);
                totalInteres += parseFloat(f.intereses);
                let fecha = f.fechapago;
                let meses = moment(pago.fecha).diff(moment(fecha), 'months');
                console.log(meses);
                if (meses > 0) {
                    totalMora += meses * 0.05 * parseFloat(f.cuota).toFixed(2)
                    moraCuota = meses * 0.05 * parseFloat(f.cuota)
                }
                lista2.push({
                    amortizacioncapital: parseFloat(f.amortizacioncapital),
                    intereses: parseFloat(f.intereses),
                    cuota: parseFloat(f.cuota),
                    mora: moraCuota,
                    contratocuotumId: f.id,
                })
            })  
            setAmortizacion(totalamortizacion);
            setIntereses(totalInteres);
            setTotal(totalPago + totalMora);
            setMora(totalMora);
            setTotalCuotas(totalPago)
            setListaCuotas(lista);
            setNuevoSaldo(saldoAnterior - totalamortizacion);
            setPago({
                ...pago,
                pago: totalPago + totalMora,
                pagocuotas: lista2
            })
        }
        else {
            setAmortizacion(0);
            setIntereses(0);
            setTotal(0);
            setMora(0);
            setTotalCuotas(0)
            setListaCuotas([]);
            setPago({
                ...pago,
                pago: 0
            })
        }
    }
    const llenarListaCuotasMoraCero = () => {
        if (cantidadCuotas > 0) {
            var cantidad = 0;
            var lista = [];
            var lista2 = [];
            var totalMora = 0;
            var totalPago = 0
            var totalamortizacion = 0;
            var totalInteres = 0;
            contrato.contratocuota?.forEach((f) => {
                if (cantidad < cantidadCuotas) {
                    lista.push(f);
                    cantidad++;
                }
            });
            lista.forEach((f) => {
                var moraCuota = 0;
                totalPago += parseFloat(f.cuota);
                totalamortizacion += parseFloat(f.amortizacioncapital);
                totalInteres += parseFloat(f.intereses);
                let fecha = f.fechapago;
                let meses = moment(pago.fecha).diff(moment(fecha), 'months');
                console.log(meses);
                if (meses > 0) {
                    totalMora += meses * 0.05 * parseFloat(f.cuota).toFixed(2)
                    moraCuota = 0
                }
                lista2.push({
                    amortizacioncapital: parseFloat(f.amortizacioncapital),
                    intereses: parseFloat(f.intereses),
                    cuota: parseFloat(f.cuota),
                    mora: moraCuota,
                    contratocuotumId: f.id,
                })
            })  
            setAmortizacion(totalamortizacion);
            setIntereses(totalInteres);
            setTotal(totalPago + totalMora);
            setMora(totalMora);
            setTotalCuotas(totalPago)
            setListaCuotas(lista);
            setNuevoSaldo(saldoAnterior - totalamortizacion);
            setPago({
                ...pago,
                pago: totalPago + totalMora,
                pagocuotas: lista2
            })
        }
        else {
            setAmortizacion(0);
            setIntereses(0);
            setTotal(0);
            setMora(0);
            setTotalCuotas(0)
            setListaCuotas([]);
            setPago({
                ...pago,
                pago: 0
            })
        }
    }
    const buscarIdcliente = async (id) => {
        const clienteSeleccionado = listaClientes.find(
            (f) =>
                f.id == id
        );
        console.log(clienteSeleccionado);
        if (clienteSeleccionado) {
            setNombreCliente(clienteSeleccionado.identidad + " | " + clienteSeleccionado.nombreprimer + " " + clienteSeleccionado.nombresegundo + clienteSeleccionado.apellidoprimer + " " + clienteSeleccionado.apellidosegundo)
            setPago({
                ...pago,
                clienteId: clienteSeleccionado.id
            })
            try {
                const response = await AxiosPrivado.get(buscarIdClienteContratoPagoPendiente + clienteSeleccionado.id);
                setListaContratos(response.data.datos);
            } catch (error) {
                console.log(error);
                mostraAlertaError("Error al cargar los contratos");
            }
        }
        else {
            setNombreCliente("Seleccione un cliente");
            setListaContratos([]);
            setPago({
                ...pago,
                clienteId: null
            })
        }
        setNombreContrato("Seleccione un contrato");
    }
    const buscarIdContrato = (id) => {
        const contratoSeleccionado = listaContratos.find(
            (f) =>
                f.id == id
        );
        if (contratoSeleccionado) {
            setNombreContrato("No. " + contratoSeleccionado.id + " | Fecha: " + moment(contratoSeleccionado.fechaInicio).format("DD-MM-YYYY") + " | Plazo: " + contratoSeleccionado.plazo + " | Cuota: " + contratoSeleccionado.cuota);
            setContrato(contratoSeleccionado);
            const cuotasPendientes = contratoSeleccionado.contratocuota.filter((f)=>f.estado='Pago Pendiente');
            setAmortizaciones(contratoSeleccionado.contratocuota);
            var totalSaldo = 0;
            contratoSeleccionado.contratosaldos.forEach((f) => {
                totalSaldo = parseFloat(f.saldoactual);
            })
            console.log(contratoSeleccionado);
            setSaldoAnterior(totalSaldo);
            setPago({
                ...pago,
                contratoId: contratoSeleccionado.id
            })
        }
        else {
            mostraAlertaOk("No se selecciono ningun contrato");
            setContrato({});
            setAmortizaciones([]);
            setSaldoAnterior(0);
        }
        setCantidadCuotas(0);
        setListaCuotas([]);
    }
    const formatoMoneda = (valor) => {
        return "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
        }).format(valor);
    }
    if (cargandoDatos) {
        return (
            <Cargando></Cargando>
        );
    }
    else {
        return (
            <React.StrictMode>

                <Header></Header>
                <SideNav />

                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Pago de cuota</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link href="/app/pagos">Pagos</Link></li>
                                        <li className="breadcrumb-item active"><Link href="/app/contratos">Pago de cuota</Link></li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Nuevo Pago de cuota</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form action="">
                                        <div className="row">
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Fecha de pago</label>
                                                <div className="input-group">
                                                    <input type="date" className="form-control" placeholder="dd-mm-yyyy"
                                                        value={pago.fecha}
                                                        onChange={manejadorPagoCuota}
                                                        name="fecha"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-8 form-group">
                                                <label>Cliente</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Ej: 0123"
                                                        value={nombreCliente}
                                                        disabled
                                                    />
                                                    <BuscarCliente lista={listaClientes} buscarIdcliente={buscarIdcliente}></BuscarCliente>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 form-group">
                                                <label>Contratos</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Ej: 0123"
                                                        value={nombreContrato}
                                                        disabled
                                                    />
                                                    <BuscarContrato lista={listaContratos} buscarIdContrato={buscarIdContrato}></BuscarContrato>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4 form-group">
                                                <label>Cantidad de cuotas</label>
                                                <div className="input-group">
                                                    <input type="number" className="form-control" placeholder="Ej: 120"
                                                        value={cantidadCuotas}
                                                        onChange={(e) => { setCantidadCuotas(e.target.value) }}
                                                        name="cuotas"
                                                    />
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>U</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 form-group">
                                                <label>Mora</label>
                                                <div className="input-group">
                                                    <input type="number" className="form-control" placeholder="Ej: 12%"
                                                        value={mora}
                                                        onChange={(e) => { setMora(e.target.value) }}
                                                        name="mora"
                                                    />
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Total Cuotas</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="text" className="form-control" placeholder="Ej: 1000"
                                                        value={formatoMoneda(totalCuotas)}
                                                        name="total"
                                                        disabled
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Saldo Anterior</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="text" className="form-control" placeholder="Ej: 1000"
                                                        value={formatoMoneda(saldoAnterior)}
                                                        name="saldoanterior"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Abono Capital</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="text" className="form-control" placeholder="Ej: 1000"
                                                        value={formatoMoneda(amortizacion)}
                                                        name="amortizacion"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Nuevo Saldo</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="text" className="form-control" placeholder="Ej: 1000"
                                                        value={formatoMoneda(nuevoSaldo)}
                                                        name="nuevosaldo"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="row">

                                        <div className="col-6">
                                            <p className="lead">Metodos de pago:</p>
                                            <img src="../../dist/img/credit/visa.png" alt="Visa" />
                                            <img src="../../dist/img/credit/mastercard.png" alt="Mastercard" />
                                            <img src="../../dist/img/credit/american-express.png" alt="American Express" />
                                            <img src="../../dist/img/credit/paypal2.png" alt="Paypal" />
                                            <p className="text-muted well well-sm shadow-none">
                                                Selecione el metodo de pago
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <p className="lead">Datos del pago</p>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody><tr>
                                                        <th>+ Total Cuotas:</th>
                                                        <td>{formatoMoneda(totalCuotas)}</td>
                                                    </tr>
                                                        <tr>
                                                            <th>+ Total Mora:</th>
                                                            <td>{formatoMoneda(mora)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Total a Pagar:</th>
                                                            <td>
                                                                <ModalPago Total={parseFloat(totalCuotas) + parseFloat(mora)} contrato={contrato} caja={caja} pagoCuota={pago} tipoPago={"CU"}></ModalPago>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Lista de Lotes</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <TablaPagoCuotasSeleccionadas listaCuotas={listaCuotas}></TablaPagoCuotasSeleccionadas>
                                </div>
                            </div>
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Amortización</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <TablaPagoCuota datos={amortizaciones} ></TablaPagoCuota>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </React.StrictMode>
        );
    }
}

export default PagoCuota;