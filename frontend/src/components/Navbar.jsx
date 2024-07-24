import { Link } from "react-router-dom";
import Logo from "../assets/LogoDental.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const nombreUsuario = "CARLOS GARCIA";

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (
      location.pathname === "/agenda" ||
      location.pathname === "/pacientes" ||
      location.pathname === "/pacientes/historia-clinica"
    ) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location]);

  return (
    <nav
      className="py-3"
      style={{
        backgroundImage: "linear-gradient(to bottom, #418FF5, #1C45D4)",
      }}
    >
      <div className="lg:px-[120px] px-4 flex justify-between items-center">
        <div className=" flex items-center">
          <Link to={"/"} className="flex items-center">
            <p className="text-white text-2xl font-bold font-nunito mr-2">
              DentPlanner
            </p>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        {isLogin && (
          <div className="md:flex hidden">
            <ul className="flex gap-6 text-white font-semibold text-xl">
              <Link to={"/pacientes"}>Pacientes</Link>
              <Link to={"/agenda"}>Agenda</Link>
              <Link className="flex items-center">
                {nombreUsuario}
                <FaCaretDown className="text-[#254c94]" />
              </Link>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
