import React from 'react';
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";

import Insumos from './Insumos';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaWarning } from "../../components/Alerts/sweetAlert";
import { Navigate } from 'react-router-dom';
function PageInsumos() {
  const { usuario } = useContextUsuario();
  if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/insumos")){
    mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
      <Navigate to={"/app/home"}></Navigate>
    )
  }
  return (
    <>
      <Header/>
      <SideNav/>
      <Insumos/>
      <Footer/>
      </>
  );
}

export default PageInsumos;