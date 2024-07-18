import PropTypes from "prop-types";
import { forwardRef } from "react";

const Input = forwardRef(function Input({ placeholder, className, ...rest }, ref) {
  console.log(ref.value);
  return (
    <input
      ref={ref}
      className={`bg-[#e9ecf0] px-2 py-2 placeholder-[#2b3849] rounded-[4px] ${className}`}
      placeholder={placeholder}
      {...rest}
    />
  );
});

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Input;
