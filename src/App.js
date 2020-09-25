import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header'
import './App.scss'

import Homepage from './containers/Homepage';
import CourieMap from './components/CourieMap';

import {
  useLoadScript
} from "@react-google-maps/api";

const libraries = ["places", "geometry", "drawing"];

const App = () => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_DIRECTIONS_KEY,
    libraries,
  });

  // TODO: Figure out where to actually put this. 
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div className='main-content'>
      <Header />
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Homepage} />
        <Route exact path={`${process.env.PUBLIC_URL}/delivery/:deliveryId`} component={CourieMap} />
      </Switch>
    </div>
  );
};

export default App;