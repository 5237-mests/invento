import axios from 'axios';

const logout = async () => {
  try {
    // Implement logout logic here (clear session data, redirect to login page)
    await axios.get('/api/logout');
    // refresh page
    location.reload();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export default logout;
