import { useOutlet } from "react-router-dom";
import { ProductoState } from "../contexto/compra/ProductoState";

export const ProductoLayout = () => {
    const outlet = useOutlet();

    return(<ProductoState>{outlet}</ProductoState>)
}