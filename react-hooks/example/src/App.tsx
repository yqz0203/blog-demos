import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import UseState from './pages/UseState';
import Index from './pages/Index';
import UseEffect from './pages/UseEffect';
import UseCallback from './pages/UseCallback';

const App: React.FC = () => {
  return (
    <main className="app">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/usestate" component={UseState} />
          <Route path="/useeffect" component={UseEffect} />
          <Route path="/usecallback" component={UseCallback} />
        </Switch>
      </BrowserRouter>
    </main>
  );
};

export default App;
