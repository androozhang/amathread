import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes, Route, Navigate } from 'react-router-dom'; // Import Route and Navigate
import ReadPosts from './pages/ReadPosts';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Navbar from './components/Navbar';
import { createClient } from '@supabase/supabase-js';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './client';
import LoginPage from './components/Login';
import PrivateRoute from './components/PrivateRoute';



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

  const [userSession, setUserSession] = useState(null);


  const element = useRoutes([
    {
      path: '/',
      element: <ReadPosts data={posts} />,
    },
    {
      path: '/edit/:id',
      element: <EditPost data={posts} />,
    },
    {
      path: '/post/:id',
      element: <PostDetail data={posts} />,
    },
    {
      path: '/new',
      element: <CreatePost />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
  ]);

  return (
    <div className="App">
      <Navbar />
      {element}
      {!userSession ? (
        <Navigate to="/login" />
      ) : (
        <div>
          <h2>Welcome, {userSession.user.email}!</h2>
          {/* Include your protected components */}
        </div>
      )}
    </div>
  );
};

export default App;