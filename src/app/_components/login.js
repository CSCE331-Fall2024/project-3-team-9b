import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';  // Updated import statement

function Login({ onLoginSuccess }) {
  const onSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log('Login Success. User Info:', decodedToken);
      
      // Store the token and email
      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('userEmail', decodedToken.email);
      
      // Show success message
      alert(`Successfully logged in as ${decodedToken.email}`);
      
      // Call the parent component's success handler
      onLoginSuccess(decodedToken.email);
      
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Failed to process login information');
    }
  };

  const onError = () => {
    console.log('Login Failed');
    alert('Login Failed. Please try again.');
  };

  return (
    <div id="signInButton" className="px-4 py-2 bg-white rounded-lg shadow-lg hover:scale-110 hover:duration-300">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
      />
    </div>
  );
}

export default Login;