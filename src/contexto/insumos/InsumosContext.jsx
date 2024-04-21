import { createContext, useContext } from "react";
export const InsumosContext = createContext();

export const useContextInsumos=()=>{
    return useContext(InsumosContext);
}