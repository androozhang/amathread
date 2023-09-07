import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, authenticated }) => {
  return (
    <Route
      element={
        authenticated ? (
          <Element />
        ) : (
          <Navigate to="/login" replace state={{ from: window.location.pathname }} />
        )
      }
    />
  );
};

export default PrivateRoute;
