import express from 'express';
import path from 'path';

const app = express();

// static folders
const root = path.join(__dirname, '../../');
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'uploads'));
});

app.listen(8000, () => console.log('Listening on port 8000...'));