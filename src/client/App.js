import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../../assets/css/style.css'

import Feed from './Feed';
import Chats from './Chats';

// Main Application Component
const App = () => {
  
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta name="description" content="Newsfeed of all your friends on Graphbook" />
      </Helmet>
      <Feed />
      <Chats />
    </div>
  )
}
export default App