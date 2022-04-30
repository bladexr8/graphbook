import express from 'express';
import path from 'path';

// middleware
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

const app = express();

// middleware

// compress responses
app.use(compress());

// set security options
// refer to https://github.com/helmetjs/helmet for docs
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "*.amazonaws.com"]
  }
}));
app.use(helmet.referrerPolicy({ policy: 'same-origin'}));

// allow cors
app.use(cors());

// static folders
const root = path.join(__dirname, '../../');
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));

// app routes
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'uploads'));
});

app.listen(8000, () => console.log('Listening on port 8000...'));