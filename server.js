const express = require('express');
const winston = require('winston');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3020;

// Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// MongoDB Connection Setup
const mongoUser = process.env.MONGO_USERNAME;
const mongoPass = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const uri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/?authSource=admin`;

let db;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db('calculatorDB');
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Validate Numbers Middleware
const validateNumbers = (req, res, next) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = req.query.num2 !== undefined ? parseFloat(req.query.num2) : undefined;

  if (isNaN(num1) || (req.query.num2 !== undefined && isNaN(num2))) {
    const message = 'Both num1 and num2 must be valid numbers';
    logger.error(message);
    return res.status(400).json({ error: message });
  }

  req.num1 = num1;
  req.num2 = num2;
  next();
};

// Log to DB Utility
const logToDatabase = (operation, num1, num2, result) => {
  if (db) {
    db.collection('operations').insertOne({
      operation,
      num1,
      num2,
      result,
      timestamp: new Date()
    });
  }
};

// Calculator Routes
app.get('/add', validateNumbers, (req, res) => {
  const result = req.num1 + req.num2;
  logger.info(`Addition: ${req.num1} + ${req.num2} = ${result}`);
  logToDatabase('add', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/subtract', validateNumbers, (req, res) => {
  const result = req.num1 - req.num2;
  logger.info(`Subtraction: ${req.num1} - ${req.num2} = ${result}`);
  logToDatabase('subtract', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/multiply', validateNumbers, (req, res) => {
  const result = req.num1 * req.num2;
  logger.info(`Multiplication: ${req.num1} * ${req.num2} = ${result}`);
  logToDatabase('multiply', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/divide', validateNumbers, (req, res) => {
  if (req.num2 === 0) {
    const message = 'Division by zero is not allowed';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  const result = req.num1 / req.num2;
  logger.info(`Division: ${req.num1} / ${req.num2} = ${result}`);
  logToDatabase('divide', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/power', validateNumbers, (req, res) => {
  const result = Math.pow(req.num1, req.num2);
  logger.info(`Power: ${req.num1} ^ ${req.num2} = ${result}`);
  logToDatabase('power', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/mod', validateNumbers, (req, res) => {
  const result = req.num1 % req.num2;
  logger.info(`Modulo: ${req.num1} % ${req.num2} = ${result}`);
  logToDatabase('mod', req.num1, req.num2, result);
  res.json({ result });
});

app.get('/sqrt', (req, res) => {
  const num = parseFloat(req.query.num);
  if (isNaN(num)) {
    const message = 'Invalid input: num must be a valid number';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (num < 0) {
    const message = 'Invalid input: Cannot calculate square root of a negative number';
    logger.error(message);
    return res.status(400).json({ error: message });
  }

  const result = Math.sqrt(num);
  logger.info(`Square Root: sqrt(${num}) = ${result}`);
  logToDatabase('sqrt', num, null, result);
  res.json({ result });
});

app.get('/', (req, res) => {
  res.send('Calculator Microservice with MongoDB Integration is Running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start Server
app.listen(port, () => {
  logger.info(`Calculator microservice running at http://localhost:${port}`);
});
