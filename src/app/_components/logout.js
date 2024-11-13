// _components/logout.js
import { googleLogout } from '@react-oauth/google';

function Logout({ onLogoutSuccess }) {
  const handleLogout = () => {
    try {
      googleLogout();
      // Clear stored credentials
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      
      console.log('Logged out successfully');
      alert('Successfully logged out');
      
      // Call the parent component's logout handler
      onLogoutSuccess();
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout');
    }
  };

  return (
    <div id="signOutButton" className="px-4 py-2 bg-black rounded-lg shadow-lg hover:scale-110 hover:duration-300">
      <button
        onClick={handleLogout}
        className="text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;