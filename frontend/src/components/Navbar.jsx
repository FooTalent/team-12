import { Link } from "react-router-dom";
import Logo from "../assets/LogoDental.svg";

export default function Navbar() {
  return (
    <nav
      className="py-3"
      style={{
        backgroundImage: "linear-gradient(to bottom, #418FF5, #1C45D4)",
      }}
    >
      <div className="pl-[120px]">
        <div className=" flex items-center">
          <Link to={"/"} className="flex items-center">
            <p className="text-white text-4xl font-bold font-nunito mr-2">
              DentPlanner
            </p>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="number">
          <p className="text-white font-normal text-2xl">0800 5936-4925</p>
        </div>
      </div>
    </nav>
  );
}
