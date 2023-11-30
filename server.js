const express = require("express");                         // Importerar Express.js-modulen för att skapa en server och hantera HTTP-förfrågningar
const app = express();                                      // Skapar en Express-applikation genom att anropa express()
const bodyParser = require("body-parser");                  // Importerar body-parser för att tolka data från HTTP-förfrågningar

const fs = require("fs");                                   // Importerar File System-modulen för att hantera filer i Node.js
const ejs = require("ejs");                                 // Importerar EJS-modulen för att rendera HTML med dynamiska data

app.use(bodyParser.urlencoded({ extended: true }));         // Använder bodyParser för att tolka URL-kodad data från förfrågningar
app.use(express.static("public"));                          // Specificerar att statiska filer ska serveras från mappen "public"
app.set("view engine", "ejs");                              // Sätter EJS som view engine för att rendera HTML-sidor


// Läs befintlig data från users.json om filen finns
let users = [];
try {
  const userData = fs.readFileSync("newpost.json", "utf8");     // Läser data från "newpost.json"
  if (userData) {
    users = JSON.parse(userData);                            // Om filen innehåller data tolkas det som JSON och lagras i users-variabeln
  }
} catch (err) {
  console.error("Fel vid läsning av users-filen:", err);     // Felhantering vid läsning av filen
}

// Läs befintlig data från newpost.json om filen finns
let posts = [];
try {
  const postData = fs.readFileSync("newpost.json", "utf8");  // Läser data från "newpost.json"
  if (postData) {
    posts = JSON.parse(postData);           // Om filen innehåller data tolkas det som JSON och lagras i posts-variabeln                      
  }
} catch (err) {
  console.error("Fel vid läsning av gästboksfilen:", err);    // Felhantering vid läsning av filen
}

// Route för att visa användare och gästboksinlägg
app.get("/", (req, res) => {
  fs.readFile('newpost.json', 'utf8', (err, data) => {        // Läser data från "newpost.json"
    if (err) {
      console.error('Fel vid läsning av filen:', err);        // Felhantering vid läsning av filen
      return res.status(500).send('Serverfel');
    }

    const postsData = JSON.parse(data);                       // Tolkar inläggsdata som JSON
    //console.log("DATA"+postsData)

    let output = "";
    if (postsData && postsData.length > 0) {                  // Om inlägg finns
      for (let i = 0; i < postsData.length; i++) {            // Loopar igenom inläggen
        output += `<p><b>${postsData[i].name}</b> från ${
          postsData[i].homepage || "ingen hemsida"
        } skriver: <br><i>${postsData[i].comment}</i></p><hr>`    // Genererar HTML för varje inlägg
        ;
      }
    }
    //res.render('gastbok.html', { users: users, posts: postsData, guestbookEntries: output });
    let html = fs.readFileSync("gastbok.html").toString();                              // Läser innehållet från "gastbok.html"
    html = html.replace("<!-- Här kommer inläggen att visas dynamiskt -->", output);    // Ersätter kommentar i HTML med dynamiskt genererad data
    res.send(html);                                                                     // Skickar den renderade HTML-sidan till klienten
  });
});

// Route för att hantera POST-förfrågningar för användare
app.post("/submit", (req, res) => {
  const { Name, Email, Homepage, Tel, Comment } = req.body;                             // Hämtar data från formuläret
  users.push({ Name, Email, Homepage, Tel, Comment });                                  // Lägger till användardata i users

  console.log(req.bodys)                                                  
  fs.writeFile("newpost.json", JSON.stringify(users), (err) => {                        // Sparar användardata till "newpost.json"

    if (err) {
      console.error("Fel vid skrivning till users-filen:", err);                        // Felhantering vid skrivning av filen
      return res.status(500).send("Serverfel");
    }
    res.redirect("/");                                                                  // Omdirigerar till startsidan
  });
});

// Route för att hantera POST-förfrågningar för gästboksinlägg
app.post("/posts", (req, res) => {
  const { name, email, homepage, tel, comment } = req.body;                             // Hämtar data från formuläret för gästboksinlägg
  const newPost = { name, email, homepage, tel, comment };                              // Skapar ett nytt gästboksinlägg
  posts.push(newPost);                                                                  // Lägger till det nya inlägget i posts

  fs.writeFile("newpost.json", JSON.stringify(posts), (err) => {                        // Sparar gästboksinlägget till "newpost.json"
    if (err) {
      console.error("Fel vid skrivning till gästboksfilen:", err);                      // Felhantering vid skrivning av filen
      return res.status(500).send("Serverfel");
    }
    res.redirect("/");                                                                  // Omdirigerar till startsidan
  });
});

// Starta servern på port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servern lyssnar på port ${PORT}`);                                       // Skriver ut ett meddelande när servern startar
});



// Denna ruta ersätter första GET-routen med att skicka login.html som respons
// Nivå 2
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

