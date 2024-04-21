import React, { useEffect, useReducer, useState } from "react"
import { SalidaInventarioContext } from "./SalidaInventarioContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarSalidaInventario, listarInventario, listarInsumos, listarUsuarios } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";


export const SalidaInventarioState = (props) => {
    const [salidainventario, setSalidaInventario] = useState(null);
    const [listaSalidaInventario, setListaSalidaInventario] = useState([]);
    const [listaInventario, setListaInventario] = useState([]);
    const [listaInsumos, setListaInsumos] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    useEffect(()=>{
        Lista();
    },[]);
    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarSalidaInventario);
            setListaSalidaInventario(response.data.datos);
            const responseInventario = await AxiosPrivado.get(listarInventario);
            setListaInventario(responseInventario.data.datos);
            const responseInsumos = await AxiosPrivado.get(listarInsumos);
            setListaInsumos(responseInsumos.data.datos);
            const responseUsuarios = await AxiosPrivado.get(listarUsuarios);
            setListaUsuarios(responseUsuarios.data.datos);
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <SalidaInventarioContext.Provider value={{
            salidainventario: salidainventario,
            listaSalidaInventario: listaSalidaInventario,
            listaInventario: listaInventario,
            listaInsumos: listaInsumos,
            listaUsuarios: listaUsuarios,
            actualizar,
            setActualizar,
            setSalidaInventario,
            setListaSalidaInventario,
            setListaInventario,
            setListaInsumos,
            setListaUsuarios,
            Lista
        }}>
            {props.children}
        </SalidaInventarioContext.Provider>
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
