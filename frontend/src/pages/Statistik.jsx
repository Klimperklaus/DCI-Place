// Trakking von Punktverteilung je nach Team und Benutzer
// wird noch gekoppelt mit der Datenbank

function Statistik() {

  return (
    <div className="statistikwrap">
      <h1>Statistik</h1>
      <p>Team Alpha : 55 Dots</p>
      <p>Team Beta : 45 Dots</p>
      <p>Team Gamma : 35 Dots</p>
      <p>Team Delta : 25 Dots</p>

      <p>Deine gesetzten Dots: 5</p>
    </div>
  );
}

export default Statistik;