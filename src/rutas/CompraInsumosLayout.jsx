import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { CompraInsumoState } from "../contexto/insumos/CompraInsumoState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const CompraInsumosLayout = () => {
  const outlet = useOutlet();
  
  return (
          <CompraInsumoState >{outlet}</CompraInsumoState>
  );
}