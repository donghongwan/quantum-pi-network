require('dotenv').config();
const Joi = require('joi'); // For environment variable validation

// Define a schema for environment variables
const envSchema = Joi.object({
    PORT: Joi.number().default(3000),
    API_BASE_URL: Joi.string().uri().default('http://localhost:3000/api'),
    BLOCKCHAIN_URL: Joi.string().uri().default('http://127.0.0.1:8545'),
    INFURA_PROJECT_ID: Joi.string().required(),
    ETHERSCAN_API_KEY: Joi.string().required(),
    PICOIN_ADDRESS: Joi.string().optional().default(''),
    GOVERNANCE_ADDRESS: Joi.string().optional().default(''),
    ENABLE_LOGGING: Joi.boolean().default(true), // New feature for enabling/disabling logging
    LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'), // New feature for log level
    ENABLE_CORS: Joi.boolean().default(true), // New feature for enabling CORS
}).unknown(); // Allow unknown keys

// Validate environment variables
const { error, value: validatedEnv } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Export the validated environment variables
const environment = {
    PORT: validatedEnv.PORT,
    API_BASE_URL: validatedEnv.API_BASE_URL,
    BLOCKCHAIN_URL: validatedEnv.BLOCKCHAIN_URL,
    INFURA_PROJECT_ID: validatedEnv.INFURA_PROJECT_ID,
    ETHERSCAN_API_KEY: validatedEnv.ETHERSCAN_API_KEY,
    PICOIN_ADDRESS: validatedEnv.PICOIN_ADDRESS,
    GOVERNANCE_ADDRESS: validatedEnv.GOVERNANCE_ADDRESS,
    ENABLE_LOGGING: validatedEnv.ENABLE_LOGGING,
    LOG_LEVEL: validatedEnv.LOG_LEVEL,
    ENABLE_CORS: validatedEnv.ENABLE_CORS,
};

module.exports = environment;
