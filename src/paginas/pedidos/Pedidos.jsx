import React from 'react';

function Pedidos({ label, name, value, onChange }) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      <input
        type="text"
        className="form-control"
        id={name}
        placeholder={label ? `Ingrese ${label.toLowerCase()}` : ''}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Pedidos;