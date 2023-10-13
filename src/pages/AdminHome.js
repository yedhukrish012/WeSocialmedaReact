/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import BarChart from '../components/Charts/BarChart';
import AdminNavbar from '../components/AdminNavbar';
 // Import your logout action

import '../App.css'; // Import your CSS styles

const AdminHome = () => {
  return (
    <div>
      <AdminNavbar/>
        <BarChart/>
    </div>
  );
};

export default AdminHome;
