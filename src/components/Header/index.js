import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss'

const Header = () => (
  <div className='header-container'>
    <div className='header-logo'>
      <h1><Link to={`${process.env.PUBLIC_URL}/`}>Courie</Link></h1>
    </div>
  </div>
);

export default Header;