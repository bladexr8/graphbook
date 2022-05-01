// require our index.js file from the graphql folder and 
// re-export all the services into one big object. We can 
// define more services here if we need them.
import graphql from './graphql';
export default {
  graphql,
};