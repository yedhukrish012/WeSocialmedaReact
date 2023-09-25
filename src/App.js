
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/authslice';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminHome from './pages/AdminHome';
import UsersList from './pages/UsersList';
import AdminPostManage from './pages/AdminPostManage';
import ReportedPostList from './pages/ReportedPostList';
import BlockedPostList from './pages/BlockedPostList';
import FollowerListPage from './pages/FollowerListPage';
import FollowingListPage from './pages/FollowingListPage';
import UserProfile from './pages/UserProfile';
import UpdateProfilePic from './components/UpdateProfilePic';


function App() {

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <Router>
        <Routes>
          <Route path ='/' element = {<LoginPage/>} />
          <Route path ='/register' element = {<RegisterPage/>} />
          <Route path ='/home' element = {user ? <HomePage /> : <LoginPage /> } />  
          <Route path ='/adm' element = {<AdminHome/>} /> 
          <Route path ='/userlist' element = {<UsersList/>} /> 
          <Route path ='/PostList' element = {<AdminPostManage/>} /> 
          <Route path ='/RepotedPostList' element = {<ReportedPostList/>} /> 
          <Route path ='/Blockedpost' element = {<BlockedPostList/>} /> 
          <Route path ='/followers' element = {<FollowerListPage/>} /> 
          <Route path ='/following' element = {<FollowingListPage/>} /> 
          <Route path = '/profile'  element = {<UserProfile/>}/>
          <Route path = '/updatpro'  element = {<UpdateProfilePic/>}/>
          <Route path ='/*' element = {<ErrorPage/>} /> 
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;