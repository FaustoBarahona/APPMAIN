import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { ProveedorState } from "../contexto/compra/ProveedorState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const ProveedorLayout = () => {
  const outlet = useOutlet();
  
  return (
          <ProveedorState >{outlet}</ProveedorState>
  );
}