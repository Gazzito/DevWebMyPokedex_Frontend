import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import "./App.css";
import PrivateRoute from "./Utils/PrivateRoutes";
import PackDetails from "./Components/PackDetails";
import Pokedex from "./Components/Pokedex";
import Rank from "./Components/Rank";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/pack-details/:id"
          element={
            <PrivateRoute>
              <PackDetails />
            </PrivateRoute>
          }
        />

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

export default App;
