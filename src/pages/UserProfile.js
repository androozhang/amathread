import { useEffect, useState } from 'react';
import { supabase } from '../client'; // Import your Supabase client
import { useAuth } from '../context/AuthProvider';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState(null); // State to hold the fetched username

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signOut();
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {

    if (user) {
      console.log('User ID:', user.id);
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('User') // Check this table name
          .select('username')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching username:', error);
          console.log(data)
        } else {
          console.log('Username data:', data);
          setUsername(data.username); // Set the fetched username in state
        }
      };

      fetchData();
    }
  }, [user]); // Include 'user' in the dependencies array to re-fetch data when the user changes

  const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
      }, []);
      

    const fetchPosts = async () => {
        const { data } = await supabase
          .from('Post')
          .select("*")
          .eq("user_id", user.id)
          .order('created_at', { ascending: true });
      
        // Set state of posts
        setPosts(data);
      };

    return (
      <div>
        {user ? (
          <div>
            <h2>Welcome {username}</h2>
            <Button onClick={handleLogout}>Logout</Button>
            <Link to="/update-password"> {/* Use Link to navigate to the Update Password page */}
              <Button>
                Update Password
              </Button>
            </Link>
            <Link to="/passwordreset"> {/* Use Link to navigate to the Password Reset page */}
              <Button>
                Reset Password
              </Button>
            </Link>
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
          </div>
          
        ) : (
          <div>
            <p>Loading username data...</p>
          </div>
        )}
      </div>
    );
};

export default UserProfile;
