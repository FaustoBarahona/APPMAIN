import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";

const ModalInformacionInventario = ({ datos, showModal, setShowModalInformacion }) => {
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
        <h4 className="modal-title text-primary">Información de Inventario</h4>
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

export default ModalInformacionInventario;
