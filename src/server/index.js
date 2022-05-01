import express from 'express';
import path from 'path';

// make our GraphQL server publicly accessible to our clients, 
// we are going to bind the Apollo Server to the /graphql path
import services from './services';

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
if(process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.amazonaws.com"]
    }
  }));
}
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

/**
 * make our GraphQL server publicly accessible to our clients, 
 * we are going to bind the Apollo Server to the /graphql path.
 * loop through all indexes of the services object and use the 
 * index as the name of the route the service will be bound to. 
 * The path would be /example for the example index in the 
 * services object. For a typical service, such as a REST 
 * interface, we rely on the standard app.use method of 
 * Express.js.
 */
const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    (async() => {
      await services[name].start();
      services[name].applyMiddleware({ app });
    })();
  } else {
    app.use('/${name}', services[name]);
  }
}

app.listen(8000, () => console.log('Listening on port 8000...'));