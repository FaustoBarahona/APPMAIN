import React, { useEffect, useReducer, useState } from "react"
import { CompraInsumosContext } from "./CompraInsumoContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarCompraInsumos, listarInsumos, listarProveedores, listarCaja, listarUsuarios } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";


export const CompraInsumoState = (props) => {
    const [comprainsumos, setCompraInsumo] = useState(null);
    const [listaCompraInsumos, setListaCompraInsumos] = useState([]);
    const [listaInsumos, setListaInsumos] = useState([]);
    const [listaProveedores, setListaProveedores] = useState([]);
    const [listaCaja, setListaCaja] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarCompraInsumos);
            setListaCompraInsumos(response.data.datos);
            const responseInsumos = await AxiosPrivado.get(listarInsumos);
            setListaInsumos(responseInsumos.data.datos);
            const responseProveedores = await AxiosPrivado.get(listarProveedores);
            setListaProveedores(responseProveedores.data.datos);
            const responseCaja = await AxiosPrivado.get(listarCaja);
            setListaCaja(responseCaja.data.datos);
            const responseUsuarios = await AxiosPrivado.get(listarUsuarios);
            setListaUsuarios(responseUsuarios.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <CompraInsumosContext.Provider value={{
            comprainsumos: comprainsumos,
            listaCompraInsumos: listaCompraInsumos,
            listaInsumos: listaInsumos,
            listaProveedores: listaProveedores,
            listaCaja: listaCaja,
            listaUsuarios: listaUsuarios,
            actualizar,
            setActualizar,
            setCompraInsumo,
            setListaCompraInsumos,
            setListaInsumos,
            setListaProveedores,
            setListaCaja,
            setListaUsuarios,
            Lista
        }}>
            {props.children}
        </CompraInsumosContext.Provider>
    )
}

// export const ListarClientes = ()=>async ()=>{
//     var lista=[];
//     try {
//        const json = await AxiosPublico.get(listarClientes);
//        return json;

//     } catch (error) {
//         console.log(error);
//         lista= [];
//     }
//     return null;
// }
