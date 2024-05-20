import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 5000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BLOGS",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("register.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      console.log(result);
      res.render("home.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log("Login request received with email:", email); // Additional logging

  try {
    const ans = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("Query executed, result:", ans); // Log the entire query result

    if (ans.rows.length > 0) {
      const user = ans.rows[0];
      console.log("User found:", user); // Log the found user
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.redirect("http://localhost:3000");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.error("Error during login process:", err); // More detailed error logging
    res.status(500).send("An error occurred during the login process");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
