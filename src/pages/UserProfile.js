import { useEffect, useState } from 'react';
import { supabase } from '../client'; // Import your Supabase client
import { useAuth } from '../context/AuthProvider';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { Row, Col, Container} from 'react-bootstrap';

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
          .from('User')
          .select('username')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching username:', error);
          if (!data) {
          console.log(data)
          // If the fetched username is empty, generate a random username
          let fetchedUsername = generateRandomUsername();
          // Update the User table with the generated username
          const { error: updateError } = await supabase
            .from('User')
            .insert({ username: fetchedUsername, user_id: user.id })
            .eq('user_id', user.id);
          if (updateError) {
            console.error('Error updating username:', updateError);
          }
          setUsername(fetchedUsername);
          }
        } else {
          console.log('Username data:', data);
          let fetchedUsername = data.username;
          if (!fetchedUsername) {
            // If the fetched username is empty, generate a random username
            fetchedUsername = generateRandomUsername();
            // Update the User table with the generated username
            const { error: updateError } = await supabase
              .from('User')
              .update({ username: fetchedUsername })
              .eq('user_id', user.id);
            if (updateError) {
              console.error('Error updating username:', updateError);
            }
          }
          setUsername(fetchedUsername);
        }
      };

      fetchData();
    }
  }, [user]);

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
      <Container className="mt-5">
      <Row>
        <Col md={12} className="text-center">
          {user ? (
            <div>
              <h2>Welcome, {username}</h2>
              <Button className='mr-20'onClick={handleLogout}>Logout</Button>
              <Link to="/update-password">
                <Button>Update Password</Button>
              </Link>
              <Link to="/passwordreset">
                <Button>Reset Password</Button>
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
                user = {post.user}
              />
            ))
          ) : (
            <h2>{'You didn\'t make any posts yet 😞'}</h2>
          )}
        </div>
            </div>
          ) : (
            <div>
              <p>Loading username data...</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
    );
};

export default UserProfile;

function generateRandomUsername() {
  const adjectives = ['happy', 'sunny', 'lucky', 'clever', 'funny', 'bright'];
  const nouns = ['cat', 'dog', 'bird', 'flower', 'star', 'apple'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);

  // Combine an adjective, a noun, and a random number
  const randomUsername = `${randomAdjective}${randomNoun}${randomNumber}`;

  return randomUsername;
}
