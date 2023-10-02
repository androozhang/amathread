import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client'


const EditPost = ({data}) => {

    const {id} = useParams();
    const [post, setPost] = useState(data.filter(item => item.id == id)[0]);


    const updatePost = async (event) => {
        event.preventDefault();

        await supabase
        .from('Post')
        .update({ title: post.title, description: post.description})
        .eq('id', id);

        window.location = "/";
    }

    // DELETE post
    const deletePost = async (event) => {
        event.preventDefault();

        await supabase
        .from('Post')
        .delete()
        .eq('id', id);

        window.location = "/";
    }

    const handleChange = (event) => {
        const { title, value } = event.target;
        updatePost((prePost) => ({
            ...prePost,
            [title]: value
        }));
    }
    
  
    return (
        <div>
            <form onSubmit={updatePost}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" value={post.title} onChange={handleChange}/><br />
                <br/>

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={post.description} onChange={handleChange}>
                </textarea>
                <br/>
                <input type="submit" value="Submit" />
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
    )
}

export default EditPost;
