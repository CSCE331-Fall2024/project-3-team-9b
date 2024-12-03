import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login({ onLoginSuccess }) {
  const onSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log('Login Success. User Info:', decodedToken);
      
      // Store credentials in sessionStorage
      sessionStorage.setItem('token', credentialResponse.credential);
      sessionStorage.setItem('userEmail', decodedToken.email);
      
      // Show success message
      alert(`Successfully logged in as ${decodedToken.email}`);
      
      // Call the parent component's success handler
      onLoginSuccess(decodedToken.email, credentialResponse.credential);
      
    } catch (error) {
      console.error('Error processing login:', error);
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
        size="large"
        type="standard"
        shape="rectangular"
        width="250"
        prompt="select_account"
        auto_select={false}
        ux_mode="popup"
        context="signin"
      />
    </div>
  );
}

export default Login;