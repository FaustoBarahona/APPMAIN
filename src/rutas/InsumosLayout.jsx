import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { InsumosState } from "../contexto/insumos/InsumosState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const InsumosLayout = () => {
  const outlet = useOutlet();
  
  return (
          <InsumosState >{outlet}</InsumosState>
  );
}