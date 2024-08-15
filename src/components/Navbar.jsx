import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav id="navbar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          <NavLink to="/canvas">Canvas</NavLink>
        </li>
        <li>
          <NavLink to="/statistik">Statistik</NavLink>
        </li>
        <li>
          <NavLink to="/devdesk">DevDesk</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
