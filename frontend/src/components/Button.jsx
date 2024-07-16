import PropTypes from "prop-types";

export default function Button({ children, className, type }) {
  return (
    <button
      className={`rounded-[4px] font-semibold px-4 py-2 transition-all ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

// esto sirve para que el boton sea requerido y no se pueda usar sin el children
Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};
