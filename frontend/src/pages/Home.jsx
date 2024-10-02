import { useEffect, useRef } from 'react';
import "../styles/Home.scss"; // Dein CSS

function Home() {
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
    layers.forEach(layer => {
      layer.elements.forEach(star => {
        const rect = star.getBoundingClientRect();
        const starX = rect.left + rect.width / 2;
        const starY = rect.top + rect.height / 2;

        const deltaX = e.clientX - starX;
        const deltaY = e.clientY - starY;

        const newX = deltaX * layer.movementFactor;
        const newY = deltaY * layer.movementFactor;

        star.style.transform = `translate(${newX}px, ${newY}px)`;
      });
    });
  };

  document.addEventListener('mousemove', handleMouseMove);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
}, []);

return (
  <div className='body'>
    <header>
      <div className="headerDiv">
        <div className="first">
          <h1 id="title" ref={titleRef}>DCI</h1>
          <p id="catchphrase" ref={catchphraseRef}>DIGITAL CAREER INSTITUTE</p>
          <button className="play">
            <h1 className="playFont">PLAY</h1>
          </button>
        </div>
        <div className="second">
          <h1 id="titlePixel">PIXEL</h1>
          <h1 id="titleWars">WARS</h1>
        </div>
      </div>

      <div id="stars" ref={el => starsRef.current.push(el)}></div>
      <div id="stars2" ref={el => stars2Ref.current.push(el)}></div>
      <div id="stars3" ref={el => stars3Ref.current.push(el)}></div>
    </header>

    <main>
      <h1 className="overview">OVERVIEW</h1>
      <div className="container">
        <div className="side">
          <div className="topLeft">
            <h1 className="ranking">RANKING</h1>
          </div>
          <div className="bottomLeft">
            <h1 className="coding">CODING</h1>
          </div>
        </div>
        <div className="middle">
          <h1 className="game">GAME</h1>
        </div>
        <div className="side">
          <div className="topRight">
            <h1 className="team">TEAM</h1>
          </div>
          <div className="bottomRight">
            <h1 className="AGB">AGB</h1>
          </div>
        </div>
      </div>
      <h1 className="finalproject">FINAL PROJECT</h1>
      <p className="lorem">
        Lorem Ipsum ist in der Webentwicklung so beliebt, weil es einfach
        keine Meinung hat. Es streitet nicht über Designentscheidungen und
        beschwert sich nie über die Farbwahl oder die Typografie. Dazu klingt
        es noch richtig schick – wer hätte gedacht, dass ein paar lateinisch
        klingende Wörter einen simplen Platzhalter so intellektuell wirken
        lassen? Der eigentliche Clou ist aber: Niemand liest es! Perfekt für
        Entwickler, denn so müssen sie keine Sorge haben, dass der Text vom
        Layout ablenkt oder plötzlich jemand fragt: Was bedeutet das
        eigentlich? Außerdem steht Lorem Ipsum immer und überall bereit.
      </p>

      <div className="divwrapperweilichzublödbineinbildohnedivzuzentrieren">
        <img
          className="bild"
          src="../img/CarPixel.png"
          alt="a Pixled Car for a shop with a tree in background"
        />
      </div>

      <h1 className="teamTitle">TEAM</h1>
      <div className="divwrapperweilichzublödbineinbildohnedivzuzentrierenzwei">
        <div className="frontend">
          <h1 className="dev">FRONTEND</h1>
        </div>
        <img
          className="controller"
          src="../img/pixelbackground.png"
          alt="ein pixelier controller"
        />
        <div className="backend">
          <h1 className="dev">BACKEND</h1>
        </div>
      </div>
    </main>
  </div>
);
}


export default Home;
