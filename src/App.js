import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes and Route
import ReadPosts from './pages/ReadPosts';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import NavBar from './components/Navbar';
import { supabase } from './client';
import { useAuth } from './context/AuthProvider';
import { Container } from "react-bootstrap";
import AuthRoute from './components/AuthRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import UserProfile from './pages/UserProfile';
import UpdatePassword from './pages/UpdatePassword';


const App = () => {
  const [posts, setPosts] = useState({
    title: '',
    description: '',
    vote: '',
  });

  useEffect(() => {
    // Fetch posts from database on component mount
    fetchPosts();
  }, []);

  // Fetch posts from Supabase database
  const fetchPosts = async () => {
    const { data } = await supabase.from('Post').select();
    // Set state of posts
    setPosts(data);
  };

  const { user } = useAuth();

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<ReadPosts data={posts} />} />
        <Route path="/edit/:id" element={<EditPost data={posts} />} />
        <Route path="/post/:id" element={<PostDetail data={posts} />} />
        <Route element={<AuthRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/new" element={<CreatePost />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
      </div>
  );
};

export default App;
