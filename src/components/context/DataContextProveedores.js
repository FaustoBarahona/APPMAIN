import React, { createContext, useState } from 'react'

export const DataContextProveedor = createContext();

export const DataProveedoresProvider = (props) => {

    const [proveedoresArray, setProveedoresArray] = useState([]);
    const [proveedoresLista, setProveedoresLista] = useState([]);
    const cargarLista = (lista) =>{
        setProveedoresLista(lista);
    };

    return (
        <DataContextProveedor.Provider value={{
            proveedoresArray, setProveedoresArray, proveedoresLista, cargarLista
        }}>
            {props.children}
        </DataContextProveedor.Provider>
    )
}
