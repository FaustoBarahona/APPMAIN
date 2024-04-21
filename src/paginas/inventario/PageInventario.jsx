import React from 'react';
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";

import Inventario from './Inventario';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from "../../components/Alerts/sweetAlert";
import { Navigate } from 'react-router-dom';
function PageInventario() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/inventario")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <Inventario/>
      <Footer/>
      </>
  );
}

export default PageInventario;