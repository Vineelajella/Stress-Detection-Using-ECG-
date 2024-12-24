const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs'); // Import the fs module
const csv = require('csv-parser'); // Import csv-parser

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Mock function to predict stress based on input data
async function predictStress(inputData) {
    
    const meanValue = inputData.flat().reduce((a, b) => a + b, 0) / inputData.flat().length;
    return meanValue > 0.5 ? "Stressed" : "Not Stressed";
}

// Prediction endpoint
app.post('/api/predict', upload.single('ecgFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        const filePath = req.file.path;
        const inputData = []; // Array to hold the parsed CSV data

        // Read and process the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                inputData.push(Object.values(row).map(Number)); // Convert values to numbers
            })
            .on('end', async () => {
                // Get prediction
                const result = await predictStress(inputData);
                
                res.json({ result });
            })
            .on('error', (error) => {
                console.error("Error reading CSV:", error);
                res.status(500).json({ error: "Error reading CSV" });
            });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Prediction error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
