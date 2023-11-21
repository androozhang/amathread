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
          {user ? (
            <div>
              <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-black md:text-5xl lg:text-3xl">
                <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  Welcome,
              </span> {username}</h2>
              <Link to="/update-password">
              <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span class="text-black relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Update Password
                </span>
              </button>
              </Link>
              <Link to="/passwordreset">
              <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span class="text-black relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Reset Password
                </span>
              </button>
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
        <button onClick={handleLogout}class="mt-5 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                  Logout
            </button>
            </div>
          ) : (
            <div>
              <p>Loading username data...</p>
            </div>
          )}
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
