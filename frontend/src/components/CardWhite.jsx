import PropTypes from "prop-types";

export default function CardWhite({ children, className }) {
  return (
    <div
      className={`flex flex-col gap-6 shadow-custom-lg sm:p-6 p-2 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}

CardWhite.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
