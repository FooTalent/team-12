import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Agenda from "./pages/Daily/Agenda";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Patients from "./pages/Pacientes/Patients";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/pacientes" element={<Patients />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="*" element={<p>404 page not found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
