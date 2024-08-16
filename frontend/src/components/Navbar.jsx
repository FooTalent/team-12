import { Link } from "react-router-dom";
import Logo from "../assets/LogoDental.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState /*useMemo*/ } from "react";
import { FaCaretDown } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineContactSupport } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useDecode } from "../hooks/useDecode";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
// import { apiGetUserById } from "../api/users/apiUsers";

export default function Navbar() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false); //estado para saber si el usuario esta logueado
  const [isInicio, setIsInicio] = useState(true); // no mostrar pacientes y agenda en el inicio
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Nuevo estado para saber si el usuario esta cerrando sesión

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = useDecode(token);

  let nombreUsuario;

  if (decodedToken) {
    if (decodedToken.last_name === "User") {
      nombreUsuario = decodedToken.first_name.toUpperCase();
    } else {
      const fullName = `${decodedToken.first_name.toUpperCase()} ${decodedToken.last_name.toUpperCase()}`;
      nombreUsuario =
        fullName.length > 20 ? decodedToken.first_name.toUpperCase() : fullName;
    }
  }

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const menuRef = useRef(null);

  const closeMenu = () => {
    setIsOpenMenu(false);
  };

  useEffect(() => {
    if (decodedToken) {
      setIsLoading(false);
    }
    const authRoutes = ["/iniciar-sesion", "/", "/recuperar-contrasenia"];
    const inicioRoute = "/inicio";

    setIsLogin(!authRoutes.includes(location.pathname));
    setIsInicio(location.pathname === inicioRoute);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Solo agregar el listener si el menú está abierto
    if (isOpenMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location, decodedToken, isOpenMenu]);

  const handleLogout = () => {
    if (!isLoggingOut) {
      // Solo permitir logout si no está en proceso
      setIsLoggingOut(true); // Deshabilitar botón
      localStorage.removeItem("token");
      toast.success("Sesión cerrada correctamente");
      navigate("/iniciar-sesion");
    }
  };

  return (
    <>
      <nav
        className="sm:py-3 py-2"
        style={{
          backgroundImage: "linear-gradient(to bottom, #418FF5, #1C45D4)",
        }}
      >
        <div
          className="lg:px-[120px] px-4 pr-8 flex justify-between items-center"
          ref={menuRef}
        >
          <div className="flex w-full items-center justify-between">
            <Link
              to={isLogin ? "/inicio" : "/iniciar-sesion"}
              className="flex items-center"
            >
              <p className="text-white text-2xl font-bold font-nunito mr-2">
                DentPlanner
              </p>
              <img src={Logo} alt="Logo" />
            </Link>
            {isLogin && isLoading === false && (
              <div className="md:hidden block">
                <IoMenu
                  className="text-white text-3xl cursor-pointer"
                  onClick={toggleMenu}
                />
                <div
                  className={`fixed right-0 top-0 w-48 h-full bg-white shadow-lg z-10 transform transition-transform duration-300 ${
                    isOpenMenu ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <button
                    className="flex items-center px-4 py-6 text-black text-lg font-normal hover:bg-gray-100 rounded-t w-full"
                    onClick={closeMenu}
                  >
                    <FaArrowLeft className="text-black text-2xl mr-3" />
                    Volver
                  </button>
                  <Link
                    to="/perfil"
                    className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-t"
                    onClick={closeMenu}
                  >
                    <AiOutlineUser className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                    Perfil
                  </Link>
                  <Link
                    to="/perfil/soporte"
                    className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <MdOutlineContactSupport className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                    Soporte
                  </Link>
                  <button
                    className="flex items-center px-4 py-3 border-t-2 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-b"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <AiOutlineLogout className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
          {isInicio ||
          location.pathname === "/iniciar-sesion" ||
          location.pathname === "/recuperar-contrasenia" ? null : (
            <div className="md:flex hidden">
              <ul className="flex gap-6 text-white font-semibold text-xl items-center">
                <li>
                  <Link to={"/pacientes"}>Pacientes</Link>
                </li>
                <li>
                  <Link to={"/agenda"}>Agenda</Link>
                </li>

                <li className="relative">
                  <button
                    className="flex items-center text-white"
                    onClick={toggleMenu}
                  >
                    <span className="truncate max-w-[150px]">
                      {nombreUsuario}
                    </span>
                    <FaCaretDown className="ml-1 text-white" />
                  </button>
                  {isOpenMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-10">
                      <div className="absolute top-[-6px] right-2 w-5 h-5 bg-white rotate-45 -z-10"></div>
                      <Link
                        to="/perfil"
                        className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-t"
                        onClick={closeMenu}
                      >
                        <AiOutlineUser className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                        Perfil
                      </Link>
                      <Link
                        to="/perfil/soporte"
                        className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100"
                        onClick={closeMenu}
                      >
                        <MdOutlineContactSupport className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                        Soporte
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-3 border-t text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-b"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <AiOutlineLogout className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
          {isInicio && (
            <div className="md:flex hidden">
              <ul className="flex gap-6 text-white font-semibold text-xl items-center">
                <li className="relative">
                  <button
                    className="flex items-center text-white"
                    onClick={toggleMenu}
                  >
                    <span className="truncate max-w-[150px]">
                      {nombreUsuario}
                    </span>
                    <FaCaretDown className="ml-1 text-white" />
                  </button>
                  {isOpenMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-10">
                      <div className="absolute top-[-6px] right-2 w-5 h-5 bg-white rotate-45 -z-10"></div>
                      {isInicio ? null : (
                        <Link
                          to="/perfil"
                          className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-t"
                          onClick={closeMenu}
                        >
                          <AiOutlineUser className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                          Perfil
                        </Link>
                      )}
                      <Link
                        to="/perfil/soporte"
                        className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100"
                        onClick={closeMenu}
                      >
                        <MdOutlineContactSupport className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                        Soporte
                      </Link>
                      <button
                        className="flex items-center px-4 py-3 border-t text-gray-700 text-lg font-normal w-full hover:bg-gray-100 rounded-b"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <AiOutlineLogout className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <Toaster position="top-right" />
    </>
  );
}
