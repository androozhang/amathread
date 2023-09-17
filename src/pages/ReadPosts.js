import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../client';
import "./ReadPosts.css"
import { Container, Row, Col } from 'react-bootstrap';

const ReadPosts = (props) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
      }, []);
      

    const fetchPosts = async () => {
        const { data } = await supabase
          .from('Post')
          .select()
          .order('created_at', { ascending: true });
      
        // Set state of posts
        setPosts(data);
      };

    
      return (
        <Container>
        <div className="ReadPosts">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <Row key={post.id} className="mt-3">
              <Card
                key={post.id} // Add a unique key prop for each rendered Card component
                id={post.id}
                title={post.title}
                description={post.description}
                vote = {post.vote}
                time = {post.created_at}
                user = {post.username}
              />
              </Row>
            ))
          ) : (
            <h2>{'No Challenges Yet 😞'}</h2>
          )}
        </div>
        </Container>
      );
      
}

export default ReadPosts;