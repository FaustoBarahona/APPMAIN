import React from 'react';
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";

import Proveedores from './Proveedores';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from "../../components/Alerts/sweetAlert";
import { Navigate } from 'react-router-dom';
function PageProveedores() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/proveedores")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <Proveedores/>
      <Footer/>
      </>
  );
}

export default PageProveedores;