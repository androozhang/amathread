import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';
import { supabase } from '../client';
import Comment from '../components/Comment';
import moment from 'moment';
import { useAuth } from '../context/AuthProvider';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AuthRoute } from '../components/AuthRoute'

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [vote, setVotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [username, setUsername] = useState('');

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

    checkUpvoteStatus(); // Check upvote status when the component mounts
  }, [id, user]);

  useEffect(() => {
    if (user) {
      // Fetch the username of the logged-in user
      supabase
        .from('User')
        .select('username')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setUsername(data.username);
          }
        });
    }
  }, [user]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
     event.preventDefault();
    if (!user) {
      // If the user is not logged in, do nothing
      return;
    }

    try {
      // Fetch the username from the User table
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (userError) {
        console.error(userError);
        return;
      }
      console.log(userData);

      const fetchedUsername = userData.username;

      // Create a new comment object with the fetched username
      const newComment = {
        post_id: id,
        description: comment,
        username: fetchedUsername,
      };
      console.log(id)
      const { data: commentData, error: commentError } = await supabase
        .from('Comment')
        .insert([newComment]);

      if (commentError) {
        console.error(commentError);
        return;
      }

      // Update the comments state with the new comment
      setComments([...comments, commentData[0]]);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async () => {
    console.log('User:', user);
    console.log('Post:', post);
    console.log('Vote:', vote);
    console.log('Has Upvoted:', hasUpvoted);
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
    <Container>
      <div>
        <div className="card mt-5">
          <Row className="mt-1">
            <Col md={1} className="vote-col d-flex flex-column align-items-center mt-3 text-center">
              <div className="votes-section">
                <Button
                  variant="primary"
                  onClick={handleUpvote}
                  style={{
                    color: hasUpvoted ? 'blue' : 'initial',
                  }}
                >
                  &uarr;
                </Button>
                <div>{vote}</div>
              </div>
            </Col>
            <Col md={11} className="mb-3">
              <div className="Content">
                <p className="Card-date">
                  Created {moment(post.created_at).fromNow()} by {post.username}
                </p>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
            </Col>
          </Row>
          <Row>
            {user && user.id === post.user_id && (
              <Col md={12}>
                <Link
                  to={`../edit/${post.id}`}
                  className="btn btn-warning"
                >
                  Edit Post
                </Link>
              </Col>
            )}
          </Row>
        </div>
        <div className="comment-section">
          <Row className='mt-5'>
            <Col md={12}>
              <h3>Comments</h3>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
            {user ? (
            <form onSubmit={handleCommentSubmit}>
                <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={handleCommentChange}
                className="form-control"
                ></textarea>
                <Button
                type="submit"
                variant="primary"
                className="mt-2"
                >
                Submit
                </Button>
            </form>
            ) : (
            <p>Login to comment</p>
            )}
            </Col>
          </Row>
          {comments.map((comment) => (
            <Row key={comment.id} className="mt-3">
              <Col md={12}>
                <Comment comment={comment} />
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default PostDetail;
