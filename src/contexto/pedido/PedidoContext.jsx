import { createContext, useContext } from "react";
export const PedidoContext = createContext();

export const useContextPedido=()=>{
    return useContext(PedidoContext);
}