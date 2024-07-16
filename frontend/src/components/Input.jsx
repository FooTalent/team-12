import PropTypes from "prop-types";

export default function Input({ placeholder, className }) {
  return (
    <input
      className={`bg-[#e9ecf0] px-2 py-2 mx-2 placeholder-[#2b3849] rounded-[4px] ${className}`}
      placeholder={`${placeholder}`}
    ></input>
  );
}

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
};
