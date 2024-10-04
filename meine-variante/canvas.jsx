import { useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";

const Canvas = ({ ws, selectedColor, rectangles, setRectangles, isConnected }) => {
  const [canSetPixel, setCanSetPixel] = useState(true);

useEffect(() => {
  if (ws) {
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message received in Canvas:", data); // Logge empfangene Nachrichten

        if (data) {
          console.log("Data exists");
          console.log("Data format:", typeof data);
          console.log("Data:", data);
        } else {
          console.log("Data is empty");
        }

        if (data.error) {
          console.error("Error received from server:", data.error);
          return;
        }

        setRectangles((prevRectangles) => {
          const index = prevRectangles.findIndex(rect => rect._id === data._id);
          if (index !== -1) {
            const updatedRectangles = [...prevRectangles];
            updatedRectangles[index] = { ...updatedRectangles[index], color: data.color, timestamp: data.timestamp };
            return updatedRectangles;
          } else {
            return [...prevRectangles, data];
          }
        });
      } catch (error) {
        console.error("Error parsing message from server: ", error);
      }
    };
  }
}, [ws, setRectangles]);

const handleCanvasClick = (e) => {
  if (!canSetPixel || !isConnected) return;

  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  const id = `${Math.round(pointerPosition.x)}_${Math.round(pointerPosition.y)}`;
  const pixelData = {
    _id: id,
    position_x: Math.round(pointerPosition.x),
    position_y: Math.round(pointerPosition.y),
    color: selectedColor || "white",
    timestamp: new Date().toISOString(),
  };

  console.log("New rectangle created:", pixelData);

  setRectangles((prevRectangles) => {
    const index = prevRectangles.findIndex(rect => rect._id === id);
    if (index !== -1) {
      const updatedRectangles = [...prevRectangles];
      updatedRectangles[index] = { ...updatedRectangles[index], color: pixelData.color };
      return updatedRectangles;
    } else {
      return [...prevRectangles, pixelData];
    }
  });
  setCanSetPixel(false);

  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("Sending new rectangle data to server:", pixelData);
    ws.send(JSON.stringify(pixelData));
  } else {
    console.error("WebSocket connection is not open.");
  }
};
  return (
    <div id="canvas">
      <Stage
        width={480}
        height={320}
        onClick={handleCanvasClick}
        style={{ border: "5px solid black", cursor: isConnected ? "crosshair" : "not-allowed" }}
      >
        <Layer>
          {rectangles.map((rect, index) => (
            rect.position && typeof rect.position_x === 'number' && typeof rect.position_y === 'number' ? (
              <Rect
                key={index}
                x={rect.position_x}
                y={rect.position_y}
                width={1}
                height={1}
                fill={rect.color}
              />
            ) : null
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;



/*
state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0
  };
  handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    this.setState({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });
  };



GitHub Copilot
Gerne helfe ich Ihnen dabei, eine Architektur für Ihren r/place Klon zu entwerfen. Hier ist ein ausführlicher Überblick über die Logik und die Zusammenarbeit der verschiedenen Komponenten:

1. Frontend-Komponenten
a. Canvas-Komponente
Zeichenfläche: Die Hauptkomponente, die das Raster und die gezeichneten Rechtecke darstellt.
Interaktionen: Handhabt Benutzerinteraktionen wie Klicken, Zoomen und Bewegen der Maus.
WebSocket-Verbindung: Verbindet sich mit dem WebSocket-Server, um Live-Updates zu empfangen und zu senden.
State-Management: Verwendet React State oder eine State-Management-Bibliothek (z.B. Redux) zur Verwaltung des lokalen Zustands des Canvas.
b. Farbpalette
Farbwahl: Ermöglicht dem Benutzer, eine Farbe auszuwählen, die zum Zeichnen verwendet wird.
State-Management: Aktualisiert den Zustand der ausgewählten Farbe in der Canvas-Komponente.
2. Backend-Komponenten
a. WebSocket-Server
Verbindungshandling: Handhabt eingehende WebSocket-Verbindungen von Clients.
Broadcasting: Sendet Updates an alle verbundenen Clients, wenn eine Änderung am Canvas vorgenommen wird.
Validierung: Überprüft eingehende Nachrichten auf Gültigkeit (z.B. erlaubte Farben, Positionen innerhalb des Canvas).
b. REST API
Initialer Zustand: Bietet Endpunkte zum Abrufen des initialen Zustands des Canvas.
Persistenz: Bietet Endpunkte zum Speichern und Abrufen von Canvas-Zuständen in der MongoDB.
c. MongoDB-Datenbank
Speicherung: Speichert den Zustand des Canvas, einschließlich der Position und Farbe jedes gezeichneten Rechtecks.
Abfragen: Ermöglicht das Abrufen des aktuellen Zustands des Canvas für neue Verbindungen.
3. Zusammenarbeit der Komponenten
a. Initialisierung
Beim Laden der Canvas-Komponente im Frontend wird eine Anfrage an die REST API gesendet, um den initialen Zustand des Canvas aus der MongoDB abzurufen.
Der initiale Zustand wird im lokalen Zustand der Canvas-Komponente gespeichert und gerendert.
b. Benutzerinteraktionen
Wenn ein Benutzer auf das Canvas klickt, wird die Position und die ausgewählte Farbe an den WebSocket-Server gesendet.
Der WebSocket-Server validiert die Nachricht und speichert die Änderung in der MongoDB.
Der WebSocket-Server sendet die Änderung an alle verbundenen Clients, einschließlich des ursprünglichen Absenders.
c. Live-Updates
Wenn der WebSocket-Server eine Änderung empfängt, sendet er diese an alle verbundenen Clients.
Die Canvas-Komponente empfängt die Änderung und aktualisiert ihren lokalen Zustand, um die Änderung zu reflektieren.
d. Persistenz
Der WebSocket-Server speichert jede Änderung in der MongoDB, um sicherzustellen, dass der Zustand des Canvas bei einem Serverneustart oder einer neuen Verbindung erhalten bleibt.
4. Fehlerbehandlung und Sicherheit
a. Validierung
Der WebSocket-Server validiert alle eingehenden Nachrichten, um sicherzustellen, dass sie gültig sind und keine unerlaubten Änderungen vornehmen.
b. Rate Limiting
Implementieren Sie eine Rate-Limiting-Logik, um zu verhindern, dass Benutzer das System durch zu viele Anfragen überlasten.
c. Authentifizierung
Optional können Sie eine Authentifizierungsschicht hinzufügen, um sicherzustellen, dass nur autorisierte Benutzer Änderungen am Canvas vornehmen können.
5. Skalierbarkeit
a. Horizontale Skalierung
Verwenden Sie Load Balancer und mehrere Instanzen des WebSocket-Servers, um eine hohe Anzahl gleichzeitiger Verbindungen zu handhaben.
Stellen Sie sicher, dass alle WebSocket-Server auf die gleiche MongoDB-Datenbank zugreifen, um den Zustand des Canvas zu synchronisieren.
b. Caching
Verwenden Sie Caching-Mechanismen (z.B. Redis), um häufige Abfragen zu beschleunigen und die Last auf die MongoDB zu reduzieren.
Zusammenfassung
Frontend: Canvas-Komponente, Farbpalette, WebSocket-Verbindung, State-Management.
Backend: WebSocket-Server, REST API, MongoDB.
Zusammenarbeit: Initialisierung, Benutzerinteraktionen, Live-Updates, Persistenz.
Fehlerbehandlung und Sicherheit: Validierung, Rate Limiting, Authentifizierung.
Skalierbarkeit: Horizontale Skalierung, Caching.
Mit dieser Architektur haben Sie eine solide Grundlage für die Entwicklung Ihres r/place Klons. Wenn Sie bereit sind, können wir uns die Implementierung der einzelnen Komponenten im Detail ansehen.






GitHub Copilot
Zusätzliche Informationen wie Timestamp
Das Hinzufügen zusätzlicher Informationen wie Timestamps kann nützlich sein, um Änderungen nachzuverfolgen und Konflikte zu lösen. Allerdings kann dies die Datenmenge erhöhen und die Performance beeinträchtigen, wenn nicht richtig gehandhabt. Hier sind einige Überlegungen:

Vorteile:
Nachverfolgbarkeit: Sie können sehen, wann jede Änderung vorgenommen wurde.
Konfliktlösung: Bei gleichzeitigen Änderungen können Timestamps helfen, Konflikte zu lösen.
Nachteile:
Erhöhte Datenmenge: Jeder zusätzliche Datenpunkt erhöht die Größe der Dokumente.
Komplexität: Die Logik zur Handhabung von Timestamps und Konflikten kann die Implementierung komplexer machen.
Empfehlung:
Optional: Fügen Sie Timestamps hinzu, wenn Sie die Nachverfolgbarkeit und Konfliktlösung benötigen. Andernfalls können Sie darauf verzichten, um die Performance zu maximieren.
Alternative Ansätze für das r/place Klon-Projekt mit React
Es gibt mehrere Ansätze, wie Sie dieses Projekt mit React umsetzen können. Hier sind einige alternative und ergänzende Ansätze:

1. State-Management mit Redux
Verwenden Sie Redux zur Verwaltung des globalen Zustands des Canvas. Dies kann die Handhabung von Zustandsänderungen und die Synchronisation zwischen verschiedenen Komponenten erleichtern.

Vorteile: Zentralisierte Zustandsverwaltung, einfachere Handhabung komplexer Zustände.
Nachteile: Zusätzliche Bibliothek und Lernkurve.
2. Optimierung der WebSocket-Verbindung
Stellen Sie sicher, dass die WebSocket-Verbindung effizient genutzt wird, um die Anzahl der Nachrichten zu minimieren und die Bandbreite zu optimieren.

Batching: Senden Sie mehrere Änderungen in einer einzigen Nachricht, anstatt jede Änderung einzeln zu senden.
Debouncing: Verzögern Sie das Senden von Nachrichten, um mehrere schnelle Änderungen zu einer einzigen Nachricht zusammenzufassen.
3. Virtualisierung
Verwenden Sie Virtualisierungstechniken, um nur die sichtbaren Teile des Canvas zu rendern. Dies kann die Performance erheblich verbessern, insbesondere bei großen Canvas-Größen.

Bibliotheken: Verwenden Sie Bibliotheken wie react-virtualized oder react-window.
4. Optimierte Datenstruktur
Verwenden Sie optimierte Datenstrukturen, um den Zustand des Canvas effizient zu speichern und zu aktualisieren.

Sparse Arrays: Verwenden Sie Sparse Arrays oder Maps, um nur die tatsächlich gezeichneten Pixel zu speichern.
Immutable.js: Verwenden Sie Immutable.js, um unveränderliche Datenstrukturen zu nutzen und unnötige Neuberechnungen zu vermeiden.
5. Server-Side Rendering (SSR)
Verwenden Sie Server-Side Rendering, um den initialen Zustand des Canvas schneller zu laden und die Benutzererfahrung zu verbessern.

Frameworks: Verwenden Sie Next.js oder ähnliche Frameworks, die SSR unterstützen.
6. Progressive Web App (PWA)
Machen Sie Ihre Anwendung zu einer Progressive Web App, um Offline-Funktionalität und bessere Performance auf mobilen Geräten zu bieten.

Service Worker: Verwenden Sie Service Worker, um Ressourcen zu cachen und Offline-Zugriff zu ermöglichen.
Zusammenfassung
Zusätzliche Informationen wie Timestamps: Optional, je nach Bedarf für Nachverfolgbarkeit und Konfliktlösung.
Alternative Ansätze:
State-Management mit Redux: Zentralisierte Zustandsverwaltung.
Optimierung der WebSocket-Verbindung: Batching und Debouncing.
Virtualisierung: Rendern Sie nur sichtbare Teile des Canvas.
Optimierte Datenstruktur: Sparse Arrays oder Immutable.js.
Server-Side Rendering (SSR): Schnelleres Laden des initialen Zustands.
Progressive Web App (PWA): Offline-Funktionalität und bessere Performance.
Diese Ansätze können Ihnen helfen, Ihr r/place Klon-Projekt effizienter und skalierbarer zu gestalten.


*/



