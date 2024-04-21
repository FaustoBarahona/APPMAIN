import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";
import { imagenFactura } from "../../apiUrls";

const ModalInformacionCompraInsumos = ({ datos, showModal, setShowModalInformacion }) => {
  console.log("Datos recibidos:", datos);
  console.log("Estado del modal:", showModal);
  //const [showModal, setShowModalInformacion] = useState(false);


  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
      size="lg"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información de Compra Insumo</h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setShowModalInformacion(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="col-md-12">
          <div className="card card-widget widget-user shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <img className="product-image" src={imagenFactura + datos?.documentofactura} alt="Factura" />
                </div>
                <div className="col-sm-6">
                  <strong><i className="fas fa-box mr-1"></i> Insumo</strong>
                  <p className="text-muted">
                  {datos?.Insumo?.nombre}
                  </p>
                  <hr></hr>
                  <strong><i className="fas fa-check mr-1"></i> Cantidad</strong>
                  <p className="text-muted">
                  {datos?.cantidad}
                  </p>
                  <hr></hr>
                  <strong><i className="fas fa-balance-scale mr-1"></i> Unidad Medida</strong>
                  <p className="text-muted">
                  {datos?.unidadmedida}
                  </p>
                  <hr></hr>
                  <strong><i className="fas fa-dollar-sign mr-1"></i> Precio Unitario</strong>
                  <ul className="list-inline">
                    {datos?.preciounitario}
                  </ul>
                  <hr></hr>
                  <strong><i className="fas fa-dollar-sign mr-1"></i> Subtotal</strong>
                  <p className="text-muted">
                    {datos?.subtotal}
                  </p>
                  <hr></hr>
                  <strong><i className="far fa-calendar-alt mr-1"></i> Fecha de la Compra</strong>
                  <p className="text-muted">
                    {datos?.fechacompra}
                  </p>
                  <hr></hr>
                  <strong><i className="fas fa-credit-card mr-1"></i> Tipo de Pago</strong>
                  <p className="text-muted">
                    {datos?.tipopago}
                    </p>
                    <hr></hr>
                    <strong><i className="fas fa-dollar-sign mr-1"></i> Total de la compra</strong>
                  <p className="text-muted">
                    {datos?.totalcompra}
                    </p>
                    <hr></hr>
                    <strong><i className="fas fa-user mr-1"></i> Proveedor</strong>
                  <p className="text-muted">
                    {datos?.proveedor?.nombre}
                    </p>
                    <hr></hr>
                    <strong><i className="fas fa-cash-register mr-1"></i> Caja</strong>
                  <p className="text-muted">
                    {datos?.caja?.nombre}
                    </p>
                    <hr></hr>
                    <strong><i className="fas fa-user mr-1"></i> Usuario</strong>
                  <p className="text-muted">
                    {datos?.usuario?.login}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>

  );
};

export default ModalInformacionCompraInsumos;
