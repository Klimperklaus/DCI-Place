// KLeine Routine, um ein 480x320 Pixel großes Raster in der
// MongoDB - Datenbank zu erstellen. Jedes Pixel wird als Dokument
// in der Sammlung "canvas" gespeichert. Das Raster wird mit
// einem Standardfarbwert von "#FFFFFF" initialisiert.
// !!!!! Wichtig: die Referenz für den User in zeile 39 muss noch angepasst werden!!!!
// !!!!! Referenz zur User-Collection !!!!!
// Importiere das Mongoose-Modul für die Verbindung zur MongoDB
import mongoose from "mongoose";

// Funktion zum Erstellen des Pixelrasters in der MongoDB
async function createPixelGrid() {
  // MongoDB-Verbindungs-URI
  const mongoURI =
    "mongodb+srv://rpanek888:conradzuse007@pixels.nqr3x.mongodb.net/test?retryWrites=true&w=majority&appName=Pixels"; // Datenbankname "test" in der URI

  try {
    // Verbinde mit der MongoDB
    await mongoose.connect(mongoURI);

    console.log(
      "Verbindung zur MongoDB hergestellt... Erstelle Pixelraster-Datenbank"
    );

    // Zugriff auf die Datenbank und die "canvas"-Sammlung
    const database = mongoose.connection.db;
    const collection = database.collection("canvas");

    // Lösche alle vorhandenen Dokumente in der Sammlung
    await collection.deleteMany({});

    // Erstelle ein Array für die zu erstellenden Dokumente
    const documents = [];
    const defaultColor = "#FFFFFF";
    const currentTime = new Date().toISOString(); // Einheitlicher Zeitstempel

    // Schleifen zum Erstellen der Pixel-Dokumente
    for (let x = 1; x < 480; x++) {
      for (let y = 1; y < 320; y++) {
        const document = {
          _id: `${x}_${y}`,
          position_x: x,
          position_y: y,
          color: defaultColor,
        };
        documents.push(document);
      }
    }

    // Füge die erstellten Dokumente in die Sammlung ein
    const result = await collection.insertMany(documents);
    console.log(`${result.insertedCount} Dokumente erfolgreich eingefügt`);
  } catch (error) {
    console.error("Fehler beim Einfügen der Dokumente:", error);
  } finally {
    // Schließe die Verbindung zur MongoDB
    mongoose.connection.close();
  }
}

// Rufe die Funktion zum Erstellen des Pixelrasters auf
createPixelGrid();
// byUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Platzhalter, kann später aktualisiert werden
