import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Canvas from "./pages/Canvas.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Statistik from "./pages/Statistik.jsx";
import Profile from "./pages/Profile.jsx";
import DevDesk from "./pages/DevDesk.jsx";
import Pagenotfound from "./components/Pagenotfound.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/statistik" element={<Statistik />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/devdesk" element={<DevDesk />} />
        <Route path="*" element={<Pagenotfound />} />
      </Route>
    </Routes>
  );
}

export default App;
