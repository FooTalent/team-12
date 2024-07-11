
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Agenda from './componentes/Agenda/Agenda'
import IniciarSesion from './componentes/IniciarSesion/IniciarSesion'
import Home from './componentes/Home/Home'
import Registro from './componentes/Registro/Registro';
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

