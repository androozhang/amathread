import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useAuth } from '../context/AuthProvider';

const CreatePost = () => {
  const [post, setPost] = useState({
    title: '',
    description: '',
    vote: '',
  });

  const [username, setUsername] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };

  const createPost = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from('Post').insert([
        {
          title: post.title,
          description: post.description,
          username: username,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error('Error inserting post:', error);
      } else {
        console.log('Post inserted successfully:', data);
      }
    } catch (error) {
      console.error('Error in createPost:', error);
    }
    window.location = '/';
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from('User')
        .select('username')
        .eq('user_id', user.id)
        .single()
        .then((data, error) => {
          if (!error && data) {
            setUsername(data.data.username);
          }
        });
    }
  }, [user]);

  return (
    <form className="max-w-sm mx-auto mt-10">
      <div className="mb-5">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={post.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div>
        <input
          type="submit"
          value="Submit"
          className="block w-full p-2 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
        />
      </div>
    </form>
  );
};

export default CreatePost;
