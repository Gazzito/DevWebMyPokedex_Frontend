import logo from "./logo.svg";  // Importa o logo (não está a ser utilizado neste código, mas é importado)
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";  // Importa componentes de roteamento do react-router-dom
import Register from "./Components/Register";  // Importa o componente Register
import Login from "./Components/Login";  // Importa o componente Login
import Home from "./Components/Home";  // Importa o componente Home
import "./App.css";  // Importa o ficheiro CSS para estilização
import PrivateRoute from "./Utils/PrivateRoutes";  // Importa o componente PrivateRoute
import PackDetails from "./Components/PackDetails";  // Importa o componente PackDetails
import Pokedex from "./Components/Pokedex";  // Importa o componente Pokedex
import Rank from "./Components/Rank";  // Importa o componente Rank

function App() {
  return (
    <div>
      <Routes>
        {/* Rota para a página inicial, que utiliza o componente Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota para a página de registo, que utiliza o componente Register */}
        <Route path="/register" element={<Register />} />
        
        {/* Rota para a página de login, que utiliza o componente Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota para a Pokedex, que utiliza o componente Pokedex */}
        <Route path="/pokedex" element={<Pokedex />} />
        
        {/* Rota para a página inicial (home) que está protegida e utiliza o componente PrivateRoute */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        
        {/* Rota para os detalhes do pacote, que está protegida e utiliza o componente PrivateRoute */}
        <Route
          path="/pack-details/:id"
          element={
            <PrivateRoute>
              <PackDetails />
            </PrivateRoute>
          }
        />
        
        {/* Rota para a página de ranking, que está protegida e utiliza o componente PrivateRoute */}
        <Route
          path="/rank"
          element={
            <PrivateRoute>
              <Rank />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;  // Exporta o componente App como padrão
