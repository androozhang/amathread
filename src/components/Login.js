import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../client'; // Update the import path

const LoginPage = () => {
  return (
    <div>
      <h2>Login or Register</h2>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  );
};

export default LoginPage;
