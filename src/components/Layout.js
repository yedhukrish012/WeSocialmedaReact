import React  from 'react'
import { Helmet } from 'react-helmet'
import NavBar from './NavBar'



const Layout = ({title,content,children}) => {
  return (
    <>
      <Helmet>
            <title>{title}</title>
            <meta name='description' content={content} />
      </Helmet>
      <NavBar/>
      <div >
        {children}
      </div>
    </>
  )
}

export default Layout
