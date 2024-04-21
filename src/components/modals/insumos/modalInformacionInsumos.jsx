import React from "react";
import { Modal } from "react-bootstrap";

const ModalInformacionInsumos = ({ datos, showModal, setShowModalInformacion }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
      size="lg"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información del Insumo</h4>
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
        <div className="card card-widget widget-user shadow">
          <div className="card-header">
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
              <InfoItem label="Nombre" value={datos?.nombre} icon="fas fa-tag" />
                <InfoItem label="Descripcion" value={datos?.descripcion} icon="fas fa-box" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal.Footer>
        {/* Puedes añadir botones u otros elementos aquí si es necesario */}
      </Modal.Footer>
    </Modal>
  );
};

const InfoItem = ({ label, value, icon }) => {
  return (
    <>
      <strong>
        <i className={icon}></i> {label}
      </strong>
      <p className="text-muted">{value}</p>
      <hr />
    </>
  );
};

export default ModalInformacionInsumos;
