import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const ErrorPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>'Postbox | 404 ErrorPage'</title>
        <meta name='description' content='User login' />
      </Helmet>
      <div className="h-screen flex flex-col items-center justify-center bg-blue-500">
        <h1 className="text-6xl text-white font-extrabold">404</h1>
        <p className="text-2xl text-white font-semibold mt-4">Oops! Page Not Found</p>
      </div>
    </HelmetProvider>
  );
};

export default ErrorPage;
