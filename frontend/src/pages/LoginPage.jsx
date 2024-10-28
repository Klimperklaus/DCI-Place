import { useEffect, useRef } from 'react';
import '../styles/LoginPage.scss';
import bus from '../img/bus.png';
import bushaltestelle from '../img/bushaltestelle.png';
import loginbild from '../img/loginbild.png';
import einhorn from '../img/einhorn.png';
import hund from '../img/Hund.png';
import kopfhörer from '../img/kopfhörer.png';
function LoginPage() {
  // Verweise für die Elemente
  const titleRef = useRef(null);
  const catchphraseRef = useRef(null);
  const starsRef = useRef([]);
  const stars2Ref = useRef([]);
  const stars3Ref = useRef([]);
// Parallax-Effekt mit useEffect hinzufügen
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
    document.addEventListener('touchmove', handleMouseMove);
  };
}, []);
return (
    <body>
    <header>
      <nav>
        <ul>
          <li><a href="#">HOME</a></li>
          <li><a href="#">CANVA</a></li>
          <li><a href="#">TEAM</a></li>
          <li><a href="#">RANKING</a></li>
          <li><a href="#">AGB</a></li>
        </ul>
      </nav>

      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </header>
    {/* <!--Login Page--> */}
    <main>
        {/* <!--Login Bereich--> */}
      <div className="login-box">
        <div className="login-formula">
        <h1>User Login</h1>
        <form action="#" method="post">
          <label htmlFor="username"></label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            required
          /><br /><br />

          <label htmlFor="password"></label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          /><br /><br />

          <button type="submit">Sign In</button>
          <p>Don't have an account? <a className="sign-up" href="#">Sign Up</a></p>

          <a className="forget-password" href="">Forget Password?</a>
        </form>
        </div>

        <img
          src={loginbild}
          alt="Zwei Pixelbilder"
          className="login-bild"
        />
      </div>
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