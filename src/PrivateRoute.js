import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ element, ...rest }) {
  const { user } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      element={user ? element : <Navigate to="/" />}
    />
  );
}

export default PrivateRoute;
