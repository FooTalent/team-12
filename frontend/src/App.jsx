import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Agenda from './pages/Daily/Agenda'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register';


function App() {
return(
 <>
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/iniciarSesion" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/registrar" element={<Register />} />
    </Routes>
  </Router>
</>
)
}

export default App;

