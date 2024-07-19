import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Agenda from "./pages/Daily/Agenda";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Registro from "./pages/Register/Registro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/registrar" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;
