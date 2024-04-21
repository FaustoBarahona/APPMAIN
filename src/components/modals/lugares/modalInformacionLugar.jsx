import React from "react";
import { Modal } from "react-bootstrap";
import { imagenProyecto } from "../../apiUrls";

const ModalInformacionLugar = ({ datos, showModal, setShowModalInformacion }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información del lugar</h4>
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
            <div className="card-header">
              <div className="widget-user-header bg-info">
                <h3 className="widget-user-username">{datos?.nombre}</h3>
              </div>
            </div>
            <div className="card-body">
              <strong><i className="fas fa-map-marker-alt mr-1"></i> Municipio</strong>
              <p className="text-muted">
                {datos?datos.municipio.nombre:""}
              </p>
              <hr></hr>
              <strong><i className="fas fa-map-marker-alt mr-1"></i> Departamento</strong>
              <p className="text-muted">
                {datos?datos.municipio.departamento.nombre:""}
              </p>
              <hr></hr>
              <strong><i className="fas fa-map-marker-alt mr-1"></i> Pais</strong>
              <p className="text-muted">
                {datos?datos.municipio.departamento.pai.nombre:""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>

  );
};

export default ModalInformacionLugar;
