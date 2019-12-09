import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Router from './scenes/router';
import './main.css';
import { createStore, Provider } from './stores/createStore';

const store = createStore();

const App = () => {
  useEffect(() => {
    // bootstrap app
  }, []);

  return (
    <Provider value={store}>
      <BrowserRouter>
        <Route path="/" component={Router} />
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
