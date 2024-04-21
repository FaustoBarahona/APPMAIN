import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { PedidoState } from "../contexto/pedido/PedidoState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const PedidoLayout = () => {
  const outlet = useOutlet();
  
  return (
          <PedidoState >{outlet}</PedidoState>
  );
}