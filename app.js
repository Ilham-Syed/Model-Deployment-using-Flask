const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static("public"));

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Render the index page
app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

// Handle the file upload and send it to Flask for prediction
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     // Send the image to the Flask server (replace 'http://flask-server-url/predict' with your actual Flask server URL)
//     const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
//       image: req.file.buffer.toString("base64"),
//     });

//     // Render the result on the webpage
//     res.render("index", {
//       result: flaskResponse.data.result,
//       error: flaskResponse.data.error,
//     });
//   } catch (error) {
//     console.error(error);
//     res.render("index", { error: "Error processing the image(from node)" ,result : null});
//   }
// });
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString("base64");

    // Send the image to the Flask server
    const flaskResponse = await axios.post("http://127.0.0.1:5000", {
      image: imageBase64,
    });

    // Render the result on the webpage
    res.render("index", {
      result: flaskResponse.data.result,
      error: flaskResponse.data.error,
    });
  } catch (error) {
    console.error(error);
    res.render("index", { error: "Error processing the image", result: null });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
