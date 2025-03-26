const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const genAI = new GoogleGenerativeAI("AIzaSyBjVNlK6cutejW5OhyiduRQvlLfwZYRcOA");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

app.get("/", (req, res) => {
    res.render("index", { response: null });
});

app.get("/submit", async (req, res) => {
    let query = req.query.text || req.body.text;

    if (!query) {
        return res.render("index", { response: "Query text is required" });
    }

    try {
        // Ask Gemini API for a structured summary
        const prompt = ` you are the best chet boat ,you can provide every answer to the user ,
        you can provide the answer in 30 to 150s word depending on the questiin after giving the answer said to user how i can help you ,
        after giving the answer show the user "how can i further help you :"
         \n\n ${query}`;
        const result = await model.generateContent([prompt]);
        const formattedResponse = result.response.text(); // Get formatted response

        res.render("index", { response: formattedResponse });
    } catch (error) {
        res.render("index", { response: `Error: ${error.message}` });
    }
});