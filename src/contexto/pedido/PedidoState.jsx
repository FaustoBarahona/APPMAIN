import React, { useEffect, useReducer, useState } from "react"
import { PedidoContext } from "./PedidoContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarAlquileres, listarLugares } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";

export const PedidoState = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);
    const [actualizarPedidos, setActualizarPedidos] = useState(false);

    useEffect(() => {
        ListaPedidos();
    }, []);
    const ListaPedidos= async () => {
        try {
            const response =  await AxiosPrivado.get(listaPedidos);
            setListaPedidos(response.data.datos);
        }catch (error) {
            console.log(error);
        }
    };

    return (
        <PedidoContext.Provider value={{ 
            listaPedidos,
            setListaPedidos,
            actualizarPedidos,
            setActualizarPedidos,
            ListaPedidos
            }}>
                { props.children}
        </PedidoContext.Provider>
    )
}