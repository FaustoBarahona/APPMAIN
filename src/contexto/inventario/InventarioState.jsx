import React, { useEffect, useReducer, useState } from "react"
import { InventarioContext } from "./InventarioContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarInventario, listarInsumos } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";


export const InventarioState = (props) => {
    const [inventario, setInventario] = useState(null);
    const [listaInventario, setListaInventario] = useState([]);
    const [listaInsumos, setListaInsumos] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarInventario);
            setListaInventario(response.data.datos);
            const responseInsumos = await AxiosPrivado.get(listarInsumos);
            setListaInsumos(responseInsumos.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <InventarioContext.Provider value={{
            inventario: inventario,
            listaInventario: listaInventario,
            listaInsumos: listaInsumos,
            actualizar,
            setActualizar,
            setInventario,
            setListaInventario,
            setListaInsumos,
            Lista
        }}>
            {props.children}
        </InventarioContext.Provider>
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
