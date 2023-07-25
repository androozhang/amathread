import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';
import { supabase } from '../client';
import Comment from '../components/Comment';
import moment from "moment"


const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [vote, setVotes] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            const { data: post, error } = await supabase
                .from('Post')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.log(error);
            } else {
                setPost(post);
                setVotes(post.vote);
            }
        };

        fetchPost();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            const { data: comments, error } = await supabase
                .from('Comment')
                .select('*')
                .eq('post_id', id);

            if (error) {
                console.log(error);
            } else {
                setComments(comments);
            }
        };

        fetchComments();
    }, [id]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        const { data: newComment, error } = await supabase
            .from('Comment')
            .insert({ post_id: id, description: comment });

        if (error) {
            console.log(error);
        } else {
            setComments([...comments, newComment]);
            setComment('');
        }
    };

    const handleUpvote = async () => {
        const { data, error } = await supabase
            .from('Post')
            .update({ vote: post.vote + 1 })
            .eq('id', id);
        
        if (error) {
            console.log(error);
        } else {
            setVotes(vote+1);
        }
    };

    const deletePost = async (event) => {
        event.preventDefault();

        await supabase
        .from('Post')
        .delete()
        .eq('id', id);

        window.location = "/";
    }
    
    

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="card">
                <div className="votes-section">
                    <button onClick={handleUpvote}>&uarr;</button>
                    <p>Votes: {vote}</p>
                </div>
                <div className="Content">
                    <p className="Card-date">Created {moment(post.created_at).fromNow()}</p>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>   
                    <Link to={`../edit/${post.id}`}>
                    ...




                    </Link>
                </div>
            </div>
            <div className="comment-section">
                <h3>Comments</h3>
                <form onSubmit={handleCommentSubmit}>
                    <label htmlFor="comment">Add a comment</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={comment}
                        onChange={handleCommentChange}
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default PostDetail;
