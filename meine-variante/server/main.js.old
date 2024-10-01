import express from "express";
import ViteExpress from "vite-express";
import { Router } from "express";

const app = express();

// Hier wird der Router definiert. Der Router ist ein Objekt, das die Routen der Anwendung definiert.
const router = Router();
app.use(router);

// Mit dem folgenden Befehl wird der Ordner "public" als statischer Ordner definiert, d.h. alle Dateien in diesem Ordner können über den Browser aufgerufen werden.
// Das betrifft z.B. Bilder, CSS-Dateien, JavaScript-Dateien, etc. Wenn ich diese im Backend-Code verwenden möchte, muss ich sie hier definieren!
app.use(express.static("public"));

// Hier wird eine Route definiert, die aufgerufen wird, wenn der Benutzer die URL "http://localhost:3000/home" aufruft.
app.get("/home", (req, res) => {
  res.send("Hello World! Du bist zuhause.");
});

// Hier kommen weitere Routen zur Nutzerverwaltung in Form eines Adminboards hinzu.
app.get("/admin", (req, res) => {
  res.send("Hallo Admin! Hier kommt das Adminboard hin.");
  // res.render("admin"); (mit EJS oder Pug)
  // ZUm Thema Validierung geht es im nächsten Branch weiter.   ;)                                                                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});

// Ich möchte im adminboard weitere Routen nesten, die mit /admin/... beginnen, nur für Admins zugänglich sind und die Nutzerverwaltung betreffen.
// Quelle web-dev-simplified: https://www.youtube.com/watch?v=6BozpmSjk-Y
const adminRouter = Router();
router.use("/admin", adminRouter);

adminRouter.get("/users", (req, res) => {
  res.send("Hier kommt die Liste aller Nutzer hin.");
  // res.sendFile(__dirname + "/users.html");
  // oder so:
  // res.render("users"); (wenn ich EJS oder Pug mit entsprechender view-Struktur verwende um meine HTML-Dateien zu rendern)
  // HTML kann vom Backend-Code gerendert werden und ich kann die Daten dynamisch einfügen.
  // Hier eine Liste von Nutzern aus einer Datenbank abrufen und dynamisch einfügen. Beispiele für dynamisches rendern mit EJS:
  // res.render("users", { users: users });
  // res.render("users", { users: users, title: "mein-Nutzerlisten-Name" });
  // res.render("users", { users: users, title: "mein-Nutzerlisten-Name", active: "users" });
  // res.render("users", { users: users, title: "mein-Nutzerlisten-Name", active: "users", userCount: users.length });
  // res.render("users", { users: users, title: "mein-Nutzerlisten-Name", active: "users", userCount: users.length, user: users[0] });
  // Das gilt für alle weiteren Routen, die ich hier definiere. Also z.B. auch für /users/:id, /users/new, /users/edit/:id, /users/delete/:id, etc.
  // Also nicht nach weiteren Kommentaren suchen, sondern einfach die Zeilen kopieren und anpassen :))
  // Wichtig zu erwähnen:
  // -Die Datei users.html muss im views - Ordner liegen, wenn ich EJS oder Pug verwende.
  // -ejs oder pug muss installiert sein!
  // und dann im app.js oder index.js:
  // app.set("view engine", "ejs"); oder app.set("view engine", "pug");
  // app.set("views", "./views");
  // Importieren der entsprechenden html-Dateien nicht vergessen!
  // Quelle: web-dev-simplified: https://www.youtube.com/watch?v=6BozpmSjk-Y
});

adminRouter.get("/users/:id", (req, res) => {
  res.send(`Hier kommt der Nutzer mit der ID ${req.params.id} hin.`);
  // res.sendFile(__dirname + "/user.html");
  // oder so:
  // res.render("user", { user: user });
  // etc....
  // Ihr kennt das Spiel ;)
});

adminRouter.post("/users", (req, res) => {
  res.send("Hier kommt das Formular zum Anlegen eines neuen Nutzers hin.");
  // res.sendFile(__dirname + "/newUser.html");
  // und so weiter...
});

adminRouter.put("/users/:id", (req, res) => {
  res.send(
    `Hier kommt das Formular zum Bearbeiten des Nutzers mit der ID ${req.params.id} hin.`
    // und so weiter...
  );
});

adminRouter.delete("/users/:id", (req, res) => {
  res.send(
    `Hier kommt eine Interaktion zum Löschen des Nutzers mit der ID ${req.params.id} hin.`
  );
});

// Dann noch ein paar Routen zur Nutzerverwaltung.
app.get("/login", (req, res) => {
  res.send("Hier kommt das Loginformular für den Nutzer hin.");
});

app.get("/register", (req, res) => {
  res.send("Hier das Registrierungsformular für neue Nutzer einfügen.");
});

// Hier wird der Server auf Port 3000 gestartet.
ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

// Der laufende Prozess wird beendet, wenn Strg+C gedrückt wird. Auskommentieren, wenn das nicht gewünscht ist.
process.on("SIGINT", () => {
  process.exit();
});
