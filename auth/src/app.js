import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { errorHandler } from './middleware/error.handler.js';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { MONGO_URI as DB_URI } from './config/index.js';
import logger from './config/logger.js';
import Routes from './routes/index.js';
import superConnector from './connectors/super.connector.js';
import { EmailConnector } from './connectors/email/index.js';
import { GoogleConnector } from './connectors/google/index.js';
import { FacebookConnector } from './connectors/facebook/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));


const app = express();
const MONGO_URI = DB_URI;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

try {
  mongoose.connect(MONGO_URI);
  logger.info('DB Connected');
} catch (error) {
  console.log(error);
}

superConnector.registerProvider('email', new EmailConnector());
superConnector.registerProvider('google', new GoogleConnector());
superConnector.registerProvider('facebook', new FacebookConnector());

app.get('/health-check', async (req, res) => {
  return res.status(200).json({
    message: 'Auth Server is running',
    success: true,
  });
});

app.use(Routes);

app.use((req, res, next) => {
  next(createHttpError.NotFound('Endpoint not found'));
});

app.use(errorHandler);

export default app;
