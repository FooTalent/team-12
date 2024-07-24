import PropTypes from "prop-types";
import { forwardRef } from "react";

const Input = forwardRef(({ type,placeholder, className, ...rest }, ref) => {

  return (
    <input
      ref={ref}
      type={type}
      className={`border px-2 py-2 placeholder-[#2b3849] rounded-[4px] ${className}`}
      placeholder={placeholder}
      {...rest}
    />
  );
});

Input.propTypes = {
  type: PropTypes.oneOf(["text", "password"]).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  
};

export default Input