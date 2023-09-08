import React, { useState } from 'react';
import { supabase } from '../client';
import './CreatePost.css';
import { useAuth } from '../context/AuthProvider';

const CreatePost = () => {
    const [post, setPosts] = useState({
        title: '',
        description: '',
        vote: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target; // Update to name and value
        setPosts({ ...post, [name]: value }); // Update to name
    };

    const createPost = async (event) => {
        event.preventDefault();

        await supabase
            .from('Post')
            .insert({ title: post.title, description: post.description, user_id: user.id})
            .select();

        window.location = '/';
    };

    const { user } = useAuth();

    return (
        <div>
            <form onSubmit={createPost} id='form'>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" value={post.title} onChange={handleChange} /><br /> {/* Update id and name */}
                <br />

                <label htmlFor="description">Description</label><br />
                <input type="text" id="description" name="description" value={post.description} onChange={handleChange} /><br /> {/* Update id and name */}
                <br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default CreatePost;
