import React from "react";
import classnames from "classnames";

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  icon,
  type,
  onChange,
}) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={icon} />
        </span>
      </div>
      <input
        className={classnames("form-control form-control-lg", {
          "is-invalid": error,
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        type={type || "text"}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputGroup;
