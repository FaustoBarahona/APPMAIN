import React,{ useEffect, useState} from "react";
import { ProductoContext } from "./ProductoContext";
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarProductos } from "../../components/apiUrls";

export const ProductoState = (props) => {
    const [listaProductos, setListaProductos] = useState([]);

    useEffect(() => {
        Lista();
        console.log("se cargaron los datos");
    },[]);
    const Lista = async () => {
        try{
            const reponse= await AxiosPrivado.get(listarProductos)
            setListaProductos(reponse.data.datos);
        }catch (error) {
            console.log(error);
        }
    };
    
    return(
        <ProductoContext.Provider value={{
            listaProductos: listaProductos,
            setListaProductos,
            Lista
        }}>
            {props.children}
        </ProductoContext.Provider>
    )
}