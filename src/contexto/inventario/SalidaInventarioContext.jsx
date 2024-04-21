import { createContext, useContext } from "react";
export const SalidaInventarioContext = createContext();

export const useContextSalidaInventario=()=>{
    return useContext(SalidaInventarioContext);
}