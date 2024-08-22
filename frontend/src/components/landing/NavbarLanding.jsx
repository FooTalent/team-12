import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineContactSupport } from "react-icons/md";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function NavbarLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tokenExist} = useAuth();

  return (
    <nav
      className="flex items-center justify-between lg:px-[120px] px-6"
      style={{
        backgroundImage: "linear-gradient(to bottom, #418FF5, #1C45D4)",
      }}
    >
      <ul className="sm:flex hidden py-4 text-2xl font-semibold gap-6 text-white">
        <ScrollLink
          to="nosotros"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:opacity-80"
        >
          Nosotros
        </ScrollLink>
        <ScrollLink
          to="funcionalidades"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:opacity-80"
        >
          Funcionalidades
        </ScrollLink>
        <ScrollLink
          to="contacto"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:opacity-80"
        >
          Contacto
        </ScrollLink>
      </ul>
      <div
        className="sm:hidden flex w-full justify-end py-2.5 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <IoMenu className="text-3xl text-[#143D72]" />
        <div
          className={`fixed right-0 top-0 w-48 h-full bg-white shadow-lg z-10 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="flex items-center px-4 py-6 text-black text-lg font-normal hover:bg-gray-100 rounded-t w-full"
            onClick={() => setMenuOpen(false)}
          >
            <FaArrowLeft className="text-black text-2xl mr-3" />
            Volver
          </button>
          <div className="flex flex-col gap-[9px]">
            <Link
              to="/iniciar-sesion"
              className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-t"
              onClick={() => setMenuOpen(false)}
            >
              <AiOutlineUser className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
              Iniciar sesión
            </Link>
            <ScrollLink
              to="contacto"
              smooth={true}
              duration={500}
              className="flex items-center px-4 py-3 text-gray-700 text-lg font-normal hover:bg-gray-100 rounded-t cursor-pointer"
            >
              <MdOutlineContactSupport className="text-[#1B2B41] text-opacity-70 text-2xl mr-3" />
              Contactanos
            </ScrollLink>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden">
        <Link
          to={tokenExist ? '/inicio' : '/iniciar-sesion'}
          className="bg-transparent py-2 px-4 rounded border border-white font-medium text-lg text-white hover:opacity-80 transition-all"
        >
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}
