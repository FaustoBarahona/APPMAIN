import React, { useEffect, useReducer, useState } from "react"
import { InsumosContext } from "./InsumosContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarInsumos } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";


export const InsumosState = (props) => {
    const [insumos, setInsumo] = useState(null);
    const [listaInsumos, setListaInsumos] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarInsumos);
            setListaInsumos(response.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <InsumosContext.Provider value={{
            insumos: insumos,
            listaInsumos: listaInsumos,
            actualizar,
            setActualizar,
            setInsumo,
            setListaInsumos,
            Lista
        }}>
            {props.children}
        </InsumosContext.Provider>
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
