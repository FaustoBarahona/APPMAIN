import React, { useEffect, useReducer, useState } from "react"
import { ProveedorContext } from "./ProveedorContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarProveedores, listarLugares } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";

export const ProveedorState = (props) => {
    const [proveedores, setProveedor] = useState(null);
    const [listaProveedores, setListaProveedores] = useState([]);
    const [listaLugares, setListaLugares] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarProveedores);
            setListaProveedores(response.data.datos);
            const responseLugares = await AxiosPrivado.get(listarLugares);
            setListaLugares(responseLugares.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <ProveedorContext.Provider value={{
            proveedores: proveedores,
            listaProveedores: listaProveedores,
            listaLugares: listaLugares,
            actualizar,
            setActualizar,
            setProveedor,
            setListaProveedores,
            setListaLugares,
            Lista
        }}>
            {props.children}
        </ProveedorContext.Provider>
    )
}