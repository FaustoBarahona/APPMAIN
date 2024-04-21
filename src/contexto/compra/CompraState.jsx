import React, { useEffect, useState } from 'react';
import { CompraContext } from './CompraContext';
import { AxiosPrivado } from '../../components/axios/Axios';
import { listarCompras, listarProductos, listarProveedores, buscarIpCaja } from '../../components/apiUrls';

export const CompraState = (props) => {
    const [listaCompras, setListaCompras] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [listaProveedores, setListaProveedores] = useState([]);
    const [caja, setCaja] = useState({});

    useEffect(() => {
        Lista();
        console.log("se cargaron los datos");
    },[]);
    const Lista = async () => {
        try{
            const response= await AxiosPrivado.get(listarCompras)
            setListaCompras(response.data.datos);
            const responseProductos= await AxiosPrivado.get(listarProductos);
            setListaProductos(responseProductos.data.datos);
            const responseProveedores= await AxiosPrivado.get(listarProveedores);
            setListaProveedores(responseProveedores.data.datos);
            const responseCaja = await AxiosPrivado.get(buscarIpCaja);
            setCaja(responseCaja.data.datos);
        }catch(error){
            console.log(error);
        }
    };

    return(
        <CompraContext.Provider value={{
            listaCompras: listaCompras, 
            listaProductos: listaProductos,
            listaProveedores: listaProveedores,
            caja:caja,
            setListaProductos,
            setListaProveedores,
            setListaCompras,
            Lista
        }}>
            {props.children}
        </CompraContext.Provider>
    )
}