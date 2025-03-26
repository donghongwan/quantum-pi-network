// app.js
const { config, validateConfig } = require('./config');

async function main() {
    try {
        // Validate configuration
        validateConfig();

        // Use the configuration
        console.log("Connecting to Pi Network...");
        console.log(`API Key: ${config.piNetwork.apiKey}`);
        console.log(`Network URL: ${config.piNetwork.url}`);

        // Add your application logic here
        // For example, you could initialize a connection to the Pi Network API

    } catch (error) {
        console.error("Error in application:", error.message);
        process.exit(1);
    }
}

// Execute the main function
main();
