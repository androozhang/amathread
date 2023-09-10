import { useEffect, useState } from 'react';
import { supabase } from '../client'; // Import your Supabase client
import { useAuth } from '../context/AuthProvider';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut, passwordReset, updatePassword } = useAuth();
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const { error } = await passwordReset();
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const { error } = await updatePassword();
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
