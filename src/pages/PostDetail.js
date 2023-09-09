import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';
import { supabase } from '../client';
import Comment from '../components/Comment';
import moment from "moment"
import { useAuth } from '../context/AuthProvider';


const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [vote, setVotes] = useState(0);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    const { user } = useAuth();

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

    useEffect(() => {
    const checkUpvoteStatus = async () => {
        // Check if the user has already upvoted this post
        if (user) {
            const { data: upvotes, error } = await supabase
                .from('Upvote')
                .select('user_id')
                .eq('post_id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.log(error);
            } else {
                setHasUpvoted(!!upvotes); // Set hasUpvoted to true if there is an upvote record
            }
        }
    };

    checkUpvoteStatus(); // Check upvote status when component mounts
}, [id, user]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
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
        if (!user || user.id === post.user_id) {
            // If the user is not logged in or is the post author, do nothing
            return;
        }
    
        // Check if the user has already upvoted this post
        if (hasUpvoted) {
            // Remove the upvote
            const { error: deleteError } = await supabase
                .from('Upvote')
                .delete()
                .eq('post_id', id)
                .eq('user_id', user.id);
    
            if (deleteError) {
                console.log(deleteError);
            } else {
                setVotes(vote - 1);
                setHasUpvoted(false); // Update the upvote status to false
            }
        } else {
            // Add an upvote to both the Post and Upvotes table
            const { error: updateError } = await supabase
                .from('Post')
                .update({ vote: post.vote + 1 })
                .eq('id', id);
    
            if (updateError) {
                console.log(updateError);
            } else {
                setVotes(vote + 1);
                setHasUpvoted(true); // Update the upvote status to true
    
                // Update the Vote table with the new upvote
                const { error: insertError } = await supabase
                    .from('Upvote')
                    .insert([{ post_id: id, user_id: user.id }]);
    
                if (insertError) {
                    console.log(insertError);
                }
            }
        }
    };
    
    

    
    

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="card">
                <div className="votes-section">
                    <button
                    onClick={handleUpvote}
                    style={{ color: hasUpvoted ? 'blue' : 'initial' }}
                    >
                        &uarr;
                    </button>
                    <p>Votes: {vote}</p>
                    {console.log(hasUpvoted)}
                </div>
                <div className="Content">
                    <p className="Card-date">Created {moment(post.created_at).fromNow()} by {post.user_id}</p>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>  
                    {user && user.id === post.user_id && ( // Check if the user is the post author
                        <Link to={`../edit/${post.id}`}>
                            Edit Post
                        </Link>
                    )}
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
