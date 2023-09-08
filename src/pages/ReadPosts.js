import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../client';
import "./ReadPosts.css"

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
        <div className="ReadPosts">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <Card
                key={post.id} // Add a unique key prop for each rendered Card component
                id={post.id}
                title={post.title}
                description={post.description}
                vote = {post.vote}
                time = {post.created_at}
                user = {post.user_id}
              />
            ))
          ) : (
            <h2>{'No Challenges Yet 😞'}</h2>
          )}
        </div>
      );
      
}

export default ReadPosts;