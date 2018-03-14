/* eslint-disable import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import HomePage from './HomePage';
import Header from './Header';
import {
  Switch,
  // NavLink,
  Route
} from 'react-router-dom';
// import AboutPage from './AboutPage';
import NotFoundPage from './NotFoundPage';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  render() {
    // const activeStyle = { color: 'blue' };
    return (
      <div>
        <Header/>
        {/* <navigation>
          <NavLink exact to="/" activeStyle={activeStyle}>Home</NavLink>
          {' | '}
          <NavLink to="/about" activeStyle={activeStyle}>About</NavLink>
        </navigation> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          {/* <Route path="/about" component={AboutPage} /> */}
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
