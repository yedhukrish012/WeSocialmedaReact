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
     <div className="fixed top-0 w-full bg-white shadow-lg z-50">
     <NavBar/>
     </div>
      <div >
        {children}
      </div>
    </>
  )
}

export default Layout
