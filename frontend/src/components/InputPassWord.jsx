import PropTypes from "prop-types";
import { forwardRef } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from "react";
import Button from "./Button";

const Input = forwardRef(({placeholder, className, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div className="relative">
    <input
      ref={ref}
      type={showPassword ? "text" : "password"}
      className={`border px-2 py-2 placeholder-[#2b3849] rounded-[4px] ${className}`}
      placeholder={placeholder}
      {...rest}
    />
    <Button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-1"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </div>
  );
});

Input.propTypes = {
  
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  
};
export default Input