import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Nav from '../component/Nav';
import Footer from '../component/Footer';

export default function LoginPage() {
  const [credential, setCredential] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credential);
    if (!success) {
      setError('Invalid credentials'); // ✅ Fix: Ensure error message is set
      return;
    }
    navigate('/'); // ✅ Only navigate if login is successful
    alert("Login successful !");
  };
  

  return (
    <>
    <Nav></Nav>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96 pt-10">
        <p className='text-center text-4xl font-bold pb-6'>Admin Page</p>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block text-gray-700 mb-2">Enter Admin Password</label>
            <input
              type="password"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full px-3 py-2 mb-1 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mb-6 px-4 rounded hover:bg-white hover:text-black transition"
          >
            Log In
          </button>
        </form>
        <a href='https://www.infinitefocus.ie/'>
          <button
            className="w-full bg-red-500 text-white py-2 mb-10 px-4 rounded hover:bg-white hover:text-red-500 transition"
          >
            Go Back Home
          </button>
          </a>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}
