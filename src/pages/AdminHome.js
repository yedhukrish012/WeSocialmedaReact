/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import LineChart from '../components/Charts/LineChart';
import BarChart from '../components/Charts/BarChart';
import AdminNavbar from '../components/AdminNavbar'; // Import your logout action

import '../App.css'; // Import your CSS styles

const AdminHome = () => {
  return (
    <div>
      <AdminNavbar>
        <BarChart/>
        <LineChart/>
      </AdminNavbar>
    </div>
  );
};

export default AdminHome;
