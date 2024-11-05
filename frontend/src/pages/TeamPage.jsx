import { useEffect, useRef } from 'react';
import '../styles/LoginPage.scss';
import profilorange from '../img/profilorange.png';
import corgimix from '../img/corgimix.png';
import puzzlemix from '../img/puzzlemix.png';
import sanduhrrahmen from '../img/sanduhrrahmen.png';
import templatebreit from '../img/templatebreit.png';
import herzmix from '../img/herzmix.png';
import pfützenrahmen from '../img/pfützenrahmen.png';
import hashtag from '../img/hashtag.png';
function TeamPage() {
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
    <main>
      {/* <!--Profilbild + Name--> */}
      <div className="profilbox1">
        <img src={profilorange} alt="Profilbild" />
        <h1><span className="vorname">Lea</span> <span className="nachname">Gillung</span></h1>
      </div>
      {/* <!--Profilbeschreibung / Meine Rolle--> */}
      <div className="profilbox2">
        <div className="meine-rolle-box">
          <h2>MEINE ROLLE</h2>
          <img
            src= {corgimix}
            alt="Breites Browserfenster"
          />
          <p>
          Bei unserem Projekt „Pixel Wars“ war ich für das UI-Design der
            Webseite verantwortlich. Meine Aufgabe bestand darin, die Ideen und
            Wünsche des Teams aufzunehmen, zusammenzuführen und in einem
            harmonischen Design zu übersetzen. So haben wir uns zum Beispiel
            gemeinsam für die Farbpalette der Netflix-Serie „Hilda“ entschieden,
            und ich habe die besprochenen Farben und Schriften in ein
            konsistentes Design integriert. Zusätzlich habe ich im
            Frontend-Bereich die Login- und Profilseite umgesetzt.
          </p>
        </div>
      </div>
      {/* <!--Profilbeschreibung / Über mich und Laufbahn--> */}
      <div className="profilbox3">
        <img className="sanduhrrahmen-img" src= {sanduhrrahmen} alt="Bild" />
        <div className="ueber-mich-box">
          <h2>ÜBER MICH</h2>
          <img
            src= {puzzlemix}
            alt="Langes Browserfenster"
          />
          <p>
          Ich bin Lea Gillung, Frontend-Entwicklerin und Web-Designerin. Ich
            habe eine große Leidenschaft für Kreativität und Technologie.
            Besonders fasziniert mich die Kultur asiatischer Länder wie Japan
            und Korea, die technologisch sehr fortgeschritten sind. Oft reise
            ich dorthin, um neue Ideen und Inspirationen zu sammeln. In meiner
            Freizeit beschäftige ich mich gerne mit 3D-Druck, wo ich meine
            eigenen Designs umsetze. Es macht mir Spaß, mich in neue technische
            Herausforderungen einzuarbeiten und meine kreativen Ader auszuleben.
          </p>
        </div>
      </div>
      {/* <!--Profilbeschreibung / Laufbahn und Kontakt--> */}
      <div className="profilbox4">
        <div className="laufbahn-box">
          <h2>LAUFBAHN</h2>
          <img
            src= {templatebreit}
            alt="Webbrowser Fenster"
          />
          <p>
          Ich habe meine Ausbildung in Kommunikationsdesign an der
            Werkunstschule Lübeck abgeschlossen, wo ich fundierte Kenntnisse in
            UI-Design, Text und Konzeption erworben habe. Anschließend arbeitete
            ich zwei Jahre als Kauffrau im E-Commerce bei Yayi Chen und Henning
            Kroll GbR. Dort war ich für das Shop-Management und die
            Bestellabwicklung mit Shopify zuständig und gestaltete Inhalte für
            soziale Medien. Aktuell absolviere ich eine Weiterbildung in Web
            Development am DCI - Digital Career Institute, um meine Fähigkeiten
            in HTML, CSS und JavaScript weiter auszubauen. Diese Erfahrungen
            haben meine Kreativität gefördert und mir wertvolle Einblicke in die
            digitale Welt gegeben.
          </p>
        </div>
        <div className="kontakt-box">
          <h2>Kontakt</h2>
          <img
            src= {herzmix}
            alt="Webbrowser-Fenster"
          />
          <p>
            <br />
          Name: Lea Gillung <br /> Adresse: 23617 Stockelsdorf, <br /> Deutschland <br /> E-Mail: lea.gillung@gmail.com <br /> Telefon: 0172 6602653
          </p>
        </div>
      </div>
        <div className="box5">
        <img className="pfuetze-rahmen-img" src= {pfützenrahmen} alt="Bild"/>
        <img className="hashtag-img" src= {hashtag}  alt="Pixelbild eines Hashtags"/>
      </div>
    </main>
  </body>
)
}
export default TeamPage