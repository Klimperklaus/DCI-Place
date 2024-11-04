import { useState, useEffect, useRef } from 'react';
import '../styles/LoginPage.scss';
import bus from '../img/Bus.png';
import bushaltestelle from '../img/bushaltestelle.png';
import loginbild from '../img/loginbild.png';
import einhorn from '../img/einhorn.png';
import hund from '../img/Hund.png';
import kopfhörer from '../img/kopfhörer.png';
import { NavLink } from 'react-router-dom';
import { login, register, loginWithGoogle } from '../services/api.js';
import teams from '../data/teams.js';

function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("");
  const [message, setMessage] = useState(null);

  const titleRef = useRef(null);
  const catchphraseRef = useRef(null);
  const starsRef = useRef([]);
  const stars2Ref = useRef([]);
  const stars3Ref = useRef([]);
  
  const handleCheckboxChange = () => {
    setIsSignup(!isSignup);
  };
  
  useEffect(() => {
    const title = titleRef.current;
    const catchphrase = catchphraseRef.current;
    if (title && catchphrase) {
      title.style.position = 'relative';
      title.style.zIndex = '10';
      catchphrase.style.position = 'relative';
      catchphrase.style.zIndex = '10';
    }
    const layers = [
      { elements: starsRef.current, movementFactor: 0.05 },
      { elements: stars2Ref.current, movementFactor: 0.1 },
      { elements: stars3Ref.current, movementFactor: 0.15 }
    ];
    const handleMouseMove = (e) => {
      let clientX, clientY;
      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      layers.forEach(layer => {
        layer.elements.forEach(star => {
          const rect = star.getBoundingClientRect();
          const starX = rect.left + rect.width / 2;
          const starY = rect.top + rect.height / 2;
          const deltaX = clientX - starX;
          const deltaY = clientY - starY;
          const newX = deltaX * layer.movementFactor;
          const newY = deltaY * layer.movementFactor;
          star.style.transform = `translate(${newX}px, ${newY}px)`;
        });
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, team);
      setMessage({ type: "success", text: "Registrierung erfolgreich!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token); 
      setMessage({ type: 'success', text: "Erfolgreicher Login!" });
      window.location.href = "/profile";
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };
  return (
    <body>
      <header>
        <nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li><NavLink to="/canvas">Canvas</NavLink></li>
            <li><NavLink to="/team">Team</NavLink></li>
            <li><NavLink to="/statistik">Statistik</NavLink></li>
            <li><NavLink to="/devdesk">DevDesk</NavLink></li>
          </ul>
        </nav>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </header>

      <main>
      <div className="formwrap">
        <input
          type="checkbox"
          id="chk"
          aria-hidden="true"
          checked={isSignup}
          onChange={handleCheckboxChange}
        />

        <div className={`signup ${isSignup ? "active" : ""}`}>
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              name="txt"
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              name="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select your Class
              </option>
              {Object.keys(teams).map((key) => (
                <option key={key} value={key}>
                  {teams[key]}
                </option>
              ))}
            </select>
            <button type="submit">Sign up</button>
          </form>
        </div>

        <div className={`login ${!isSignup ? "active" : ""}`}>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button onClick={loginWithGoogle}>Login with Google</button>
       
          </form>
          </div>
          <img src={loginbild} alt="Zwei Pixelbilder" className="login-bild" />
        </div>

        <img
          src={loginbild}
          alt="Zwei Pixelbilder"
          className="login-bild"
        />
        {/* <!--Pixel Wars Info--> */}
      <div className="box1">
        <h2 className="h2-pixel-headline">PIXEL WARS</h2>
        <p className="box-info">
          Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
          auch keine relevanz, und deswegen ist das egal. er dient lediglich als
          platzhalter. um mal zu zeigen, wie diese stelle der seite aussieht
        </p>
<div className="img-boxen">
        <div className="img-box">
          <img className="box1-img"
            src= {hund}
            alt="Pixelbild eines Hundes"
          />
          <h3>PLAYFUL</h3>
          <p>
            Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
            auch keine relevanz, und deswegen ist das egal.
          </p>
        </div>

        <div className="img-box">
          <img className="box1-img"
            src= {kopfhörer}
            alt="Pixelbild von Kopfhörern"
          />
          <h3>RELAXED</h3>
          <p>
            Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
            auch keine relevanz, und deswegen ist das egal.
          </p>
        </div>

        <div className="img-box">
          <img className="box1-img"
            src={einhorn}
            alt="Pixelbild eines Einhorns"
          />
          <h3>CREATIVE</h3>
          <p>
            Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
            auch keine relevanz, und deswegen ist das egal.
          </p>
        </div>
        </div>
      </div>
        {/* <!--2 Info--> */}
      <div className="box2">
        <h2>HEADLINE</h2>
        <p className="box-info">
          Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
          auch keine relevanz, und deswegen ist das egal. er dient lediglich als
          platzhalter. um mal zu zeigen, wie diese stelle der seite aussieht
        </p>
        <img src={bushaltestelle} alt="Pixelbild einer Bushaltestelle"/>
      </div>
        {/* <!--3 Info--> */}
      <div className="box3">
        <h2>HEADLINE</h2>
        <p className="box-info">Dieser text hat eigentlich gar keinen wirklichen inhalt. aber er hat
            auch keine relevanz, und deswegen ist das egal. er dient lediglich als
            platzhalter. um mal zu zeigen, wie diese stelle der seite aussieht</p>
            <img src={bus} alt="Pixelbild eines Bus"/>
      </div>
    </main>
  </body>
  )
}
export default LoginPage