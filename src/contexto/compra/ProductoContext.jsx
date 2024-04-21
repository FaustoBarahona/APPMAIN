import { createContext, useContext } from "react";

export const ProductoContext = createContext();

export const useContextProducto= () => {
    return useContext(ProductoContext);
}