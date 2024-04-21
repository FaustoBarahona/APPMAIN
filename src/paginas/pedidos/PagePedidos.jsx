import React from 'react';
import Header from "../../components/plantilla/Header";
import Footer from "../../components/plantilla/Footer";
import SideNav from "../../components/plantilla/SideNav";

import Pedidos from './Pedidos';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import { Navigate } from 'react-router-dom';

function PagePedidos() {
  const { usuario } = useContextUsuario();
  return (
    <>
      <Header/>
      <SideNav/>
      <Pedidos/> 
      <Footer/>
    </>
  );
}

export default PagePedidos;
