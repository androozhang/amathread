import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import './CreatePost.css';
import { useAuth } from '../context/AuthProvider';

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        description: '',
        vote: '',
    });

    const [username, setUsername] = useState(''); // State to store the logged-in user's username

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
                    vote: 0,
                    username: username, // Set the username to the logged-in user's username
                    user_id: user.id, // Set the user_id to the logged-in user's id
                },
            ]);
    
            if (error) {
                // Handle the error here, e.g., log it or show an error message to the user
                console.error('Error inserting post:', error);
            } else {
                // Insertion was successful
                console.log('Post inserted successfully:', data);
                // Optionally, you can redirect the user to another page here
                // window.location = '/';
            }
        } catch (error) {
            console.error('Error in createPost:', error);
        }
        window.location = '/';
    };
    

    const { user } = useAuth();

    // Fetch the username of the logged-in user when the component mounts
    useEffect(() => {
        if (user) {
            // Fetch the username of the logged-in user
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
        <div>
            <form onSubmit={createPost} id='form'>
                <label htmlFor='title'>Title</label> <br />
                <input
                    type='text'
                    id='title'
                    name='title'
                    value={post.title}
                    onChange={handleChange}
                />
                <br />

                <label htmlFor='description'>Description</label>
                <br />
                <input
                    type='text'
                    id='description'
                    name='description'
                    value={post.description}
                    onChange={handleChange}
                />
                <br />

                <input type='submit' value='Submit' />
            </form>
        </div>
    );
};

export default CreatePost;
