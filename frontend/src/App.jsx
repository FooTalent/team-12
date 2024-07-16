import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Agenda from './pages/Daily/Agenda'
import IniciarSesion from './pages/Login/IniciarSesion'
import Home from './pages/Home/Home'
import Registro from './pages/Register/Registro';

function App() {
return(
 <>
  <Router>
    <Routes>
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/iniciarSesion" element={<IniciarSesion />} />
      <Route path="/" element={<Home />} />
      <Route path="/registrar" element={<Registro />} />
    </Routes>
  </Router>
</>
)
}

export default App;

