import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Router from './scenes/router';
import './main.css';

const App = () => {
  useEffect(() => {
    // bootstrap app
  }, []);

  return (
    <BrowserRouter>
      <Route path="/" component={Router} />
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
