import PropTypes from "prop-types";
import { forwardRef } from "react";

const Input = forwardRef(({ type,placeholder, className, options, ...rest }, ref) => {
  if (type === "select") {
    return (
      <select
        ref={ref}
        className={`bg-[#e9ecf0] px-2 py-2 rounded-[4px] ${className}`}
        {...rest}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      className={`px-2 py-2 placeholder-[#2b3849] rounded-[4px] ${className}`}
      placeholder={placeholder}
      {...rest}
    />
  );
});

Input.propTypes = {
  type: PropTypes.oneOf(["text", "password", "select"]).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default Input