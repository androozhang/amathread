import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const Register = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const usernameRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const register = (email, password, username) =>
    supabase.auth.signUp({ email, password, username });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
          !passwordRef.current?.value ||
          !emailRef.current?.value ||
          !confirmPasswordRef.current?.value ||
          !usernameRef.current?.value
        ) {
          setErrorMsg("Please fill all the fields");
          return;
        }
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
          setErrorMsg("Passwords don't match");
          return;
        }
        try {
          setErrorMsg("");
          setLoading(true);
          const { user, session, error } = await register(
            emailRef.current.value,
            passwordRef.current.value,
            usernameRef.current.value
          );
          if (error) {
            setErrorMsg("Error in Creating Account");
            setLoading(false);
            console.log(error)
            return;
          }
          
          // Insert the username into your user data table
          const { data: userData, error: userError } = await supabase
            .from('User') // Replace with your table name
            .insert([
              {
                user_id: user.id, // Assuming your user data table has an 'user_id' column
                username: usernameRef.current.value,
                // Add other user data fields as needed
              },
            ])
            .single();
          
          if (userError) {
            setErrorMsg("Error inserting username into database");
            setLoading(false);
            return;
          }
          
          setMsg(
            "Registration Successful. Check your email to confirm your account"
          );
        } catch (error) {
          setErrorMsg("Error in Creating Account");
          console.log(error)
        }   
        setLoading(false);
      };

      const handleGoogleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        })
        
      };
      

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="confirm-password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={confirmPasswordRef} required />
            </Form.Group>
            {errorMsg && (
              <Alert
                variant="danger"
                onClose={() => setErrorMsg("")}
                dismissible>
                {errorMsg}
              </Alert>
            )}
            {msg && (
              <Alert variant="success" onClose={() => setMsg("")} dismissible>
                {msg}
              </Alert>
            )}
            <div className="text-center mt-2">
              <Button disabled={loading} type="submit" className="w-50">
                Register
              </Button>
              <Button disabled={loading} onClick={handleGoogleSignIn} className="w-50">
                Register with Google
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already a User? <Link to={"/login"}>Login</Link>
      </div>
    </>
  );
};

export default Register;