// inferenceService.js
const express = require('express');
const tf = require('@tensorflow/tfjs-node'); // TensorFlow.js for Node.js
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const app = express();
const port = process.env.PORT || 3000;

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'inferenceService.log' })
    ]
});

// Load the TensorFlow Lite model
let model;
async function loadModel() {
    try {
        model = await tf.loadGraphModel('file://path/to/neural_network_model.tflite');
        logger.info('Model loaded successfully');
    } catch (error) {
        logger.error('Error loading model:', error.message);
        throw error;
    }
}

// Middleware to limit the number of requests
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Use JSON middleware and rate limiting
app.use(express.json());
app.use(limiter);

// Endpoint to validate transactions
app.post('/validate-transaction', async (req, res) => {
    const modelInput = req.body; // Expecting input data for the model

    // Validate input
    if (!modelInput || !Array.isArray(modelInput)) {
        logger.error('Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const inputTensor = tf.tensor2d([modelInput]); // Convert input to tensor
        const prediction = model.predict(inputTensor);
        const isValid = prediction.dataSync()[0] > 0.5; // Assuming binary classification

        logger.info('Transaction validation result:', { isValid });
        res.json({ isValid });
    } catch (error) {
        logger.error('Error during inference:', error.message);
        res.status(500).json({ error: 'Error during inference' });
    }
});

// Start the service
app.listen(port, () => {
    logger.info(`Inference service running at http://localhost:${port}`);
});

// Load the model on startup
loadModel();
