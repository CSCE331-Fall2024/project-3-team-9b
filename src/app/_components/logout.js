import { googleLogout } from '@react-oauth/google';

function Logout({ onLogoutSuccess }) {
  const handleLogout = () => {
    try {
      googleLogout();
      // Clear all stored credentials from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('accessToken');
      
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
    <div id="signOutButton" className="px-4 py-2 bg-black rounded-lg shadow-lg hover:scale-110 hover:duration-300 flex items-start justify-center">
      <button
        onClick={handleLogout}
        className="text-2xl text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;