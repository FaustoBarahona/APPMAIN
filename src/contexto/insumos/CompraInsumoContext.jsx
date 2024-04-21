import { createContext, useContext } from "react";
export const CompraInsumosContext = createContext();

export const useContextCompraInsumos=()=>{
    return useContext(CompraInsumosContext);
}