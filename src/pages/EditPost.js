import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client';

const EditPost = ({ data }) => {
  const { id } = useParams();
  const [post, setPost] = useState(data.filter((item) => item.id == id)[0]);

  const updatePost = async (event) => {
    event.preventDefault();

    await supabase
      .from('Post')
      .update({ title: post.title, description: post.description })
      .eq('id', id);

    window.location = '/';
  };

  const deletePost = async (event) => {
    event.preventDefault();

    await supabase.from('Post').delete().eq('id', id);

    window.location = '/';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

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
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Description
        </label>
        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          value={post.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>
      <div>
        <input
          type="submit"
          value="Submit"
          className="block w-full p-2 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm text-center"
        />
        <button
          className="deleteButton block w-full p-2 mt-3 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm text-center"
          onClick={deletePost}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default EditPost;
