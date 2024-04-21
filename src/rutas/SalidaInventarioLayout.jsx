import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { SalidaInventarioState } from "../contexto/inventario/SalidaInventarioState";
import { mostraAlerta } from "../components/Alerts/sweetAlert";

export const SalidaInventarioLayout = () => {
  const outlet = useOutlet();
  
  return (
          <SalidaInventarioState >{outlet}</SalidaInventarioState>
  );
}