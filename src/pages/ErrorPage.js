import React from 'react'
import { Helmet,HelmetProvider } from 'react-helmet-async'

const ErrorPage = () => {
  return (
    <HelmetProvider>
    <Helmet>
            <title>'Postbox | 404 ErrorPage'</title>
            <meta name='description' content='User login' />
    </Helmet>
    <h1>404</h1>
        </HelmetProvider>
  )
}

export default ErrorPage