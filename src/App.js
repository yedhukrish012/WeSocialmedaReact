
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/authslice';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminHome from './pages/AdminHome';
import UsersList from './pages/UsersList';
import AdminPostManage from './pages/AdminPostManage';
import ReportedPostList from './pages/ReportedPostList';
import BlockedPostList from './pages/BlockedPostList';

function App() {

  const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkAuth());
	});


  return (
    <>
      <Router>
        <Routes>
          <Route path ='/' element = {<LoginPage/>} />
          <Route path ='/register' element = {<RegisterPage/>} />
          <Route path ='/home' element = {<HomePage/>} /> 
          <Route path ='/adm' element = {<AdminHome/>} /> 
          <Route path ='/userlist' element = {<UsersList/>} /> 
          {/* <Route path ='/managepost' element = {<PostManage/>} />  */}
          <Route path ='/PostList' element = {<AdminPostManage/>} /> 
          <Route path ='/RepotedPostList' element = {<ReportedPostList/>} /> 
          <Route path ='/Blockedpost' element = {<BlockedPostList/>} /> 
          <Route path ='/*' element = {<ErrorPage/>} /> 
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
