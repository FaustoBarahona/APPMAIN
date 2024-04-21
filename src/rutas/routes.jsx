import React, { useContext } from 'react';
import { Navigate, Route, Routes, createBrowserRouter, createRoutesFromElements, defer } from 'react-router-dom';

import PageCargo from '../components/Pages/pageCargo';
import PageHome from '../components/Pages/pageHome';
import Login from '../paginas/empleados/Login';
import PageEmpleado from '../components/Pages/PageEmpleado';
import PageClientes from '../components/Pages/PageClientes';
import PageUsuario from '../components/Pages/PageUsuario';
import PageProfesion from '../components/Pages/pageProfesion';
//import EjemploPdf from '../components/reports/pruebas';

import PageSalidaInventario from '../paginas/inventario/PageSalidaInventario';
import { SalidaInventarioLayout } from './SalidaInventarioLayout'
import PageInventario from '../paginas/inventario/PageInventario';
import { InventarioLayout } from './InventarioLayout'
import PageCompraInsumos from '../paginas/insumos/PageCompraInsumos';
import { CompraInsumosLayout } from './CompraInsumosLayout'
import PageProveedores from '../paginas/compras/PageProveedor';
import { ProveedorLayout } from './ProveedorLayout'
import PageInsumos from '../paginas/insumos/PageInsumos';
import { InsumosLayout } from './InsumosLayout'
import PagePedidos from '../paginas/pedidos/PagePedidos';
import { PedidoLayout } from './PedidoLayout'
import { AutenticacionRoute } from './AutenticacionRoute';
import { ClienteLayout } from './ClienteLayout'
import { LugaresLayout } from './LugaresLayout';
import PageLugar from '../paginas/lugares/pageLugar';
import { EmpleadoLayout } from './EmpleadoLayout';
import { CajasLayout } from './CajasLayout';
import Aperturas from '../paginas/cajas/Aperturas';
import PageReportePagoPrima from '../paginas/contratos/PageReportePagoPrima';
import { PagosLayout } from './PagosLayout';
import Pagos from '../paginas/pagos/Pagos';
import PagoCuota from '../paginas/pagos/PagoCuota';
import Cierres from '../paginas/cajas/Cierres';
import PageDepartamento from '../paginas/lugares/pageDepartamento';
import PageMunicipio from '../paginas/lugares/pageMunicipio';


export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/login' element={<Login />} />
      <Route path="app/" element={<AutenticacionRoute />}>
        <Route path="home" element={<PageHome />} />
        <Route path='clientes' element={<ClienteLayout />}>
          <Route path='' element={<PageClientes />} />
          <Route path='profesion' element={<PageProfesion />} />
        </Route>
        <Route path='empleados' element={<EmpleadoLayout />}>
          <Route path='usuario' element={<PageUsuario />} />
          <Route path="cargo" element={<PageCargo />} />
          <Route path="empleado" element={<PageEmpleado />} />
        </Route>

        <Route path='lugares' element={<LugaresLayout />}>
          <Route path='lugar' element={<PageLugar />} />
          <Route path='departamentos' element={<PageDepartamento />} />
          <Route path='municipios' element={<PageMunicipio />} />
        </Route>

        <Route path='inventario' element={<InventarioLayout />}>
          <Route path='' element={<PageInventario />} />
        </Route>

        <Route path='salidainventario' element={<SalidaInventarioLayout />}>
          <Route path='' element={<PageSalidaInventario />} />
        </Route>

        <Route path='pedidos' element={<PedidoLayout />}>
          <Route path='' element={<PagePedidos />} />
        </Route>

        <Route path='comprainsumos' element={<CompraInsumosLayout />}>
          <Route path='' element={<PageCompraInsumos />} />
        </Route>

        <Route path='insumos' element={<InsumosLayout />}>
          <Route path='' element={<PageInsumos />} />
        </Route>

        <Route path='proveedores' element={<ProveedorLayout />}>
          <Route path='' element={<PageProveedores />} />
        </Route>

        <Route path='cajas' element={<CajasLayout />}>
          <Route path='aperturas' element={<Aperturas />} />
          <Route path='cierres' element={<Cierres />} />
        </Route>
        <Route path='pagos' element={<PagosLayout />}>
          <Route path='' element={<Pagos />} />
        </Route>
      </Route>
      <Route path='*' element={<Navigate to="app/home" />} />
    </Route>
  )
);
