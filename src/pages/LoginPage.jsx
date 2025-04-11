import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Nav from '../component/Nav';
import Footer from '../component/Footer';

export default function LoginPage() {
  const [text, setText] = useState('');
  const fullText = "Welcome Admin !";
  const [credential, setCredential] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === fullText.length) clearInterval(typingInterval);
    }, 100); // Speed (ms per letter)

    return () => clearInterval(typingInterval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credential);
    if (!success) {
      setError('Invalid Password'); // ✅ Fix: Ensure error message is set
      return;
    }
    navigate('/'); // ✅ Only navigate if login is successful
    alert("Login successful !");
  };
  

  return (
    <>
    <Nav></Nav>
    <div className="min-h-screen grid md:flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-90 pt-16">
      <p className='text-center text-3xl font-bold pb-5'>
        {text.split('Admin').map((part, i) => (
          <span key={i}>
            {part}
            {i < 1 && <span className='text-red-500'>Admin</span>}
          </span>
        ))}
      </p>
      <div className='text-justify text-sm mb-6 p-3 bg-red-50 rounded-lg'>
      <p>Please note there might be some delay in the login process. 
        <p className='pt-2'>Wait for the pop-up to show to confirm successful login,<span> Thanks</span></p></p>     
      </div>
      <form onSubmit={handleSubmit}>
          <div className="mb-1 relative">
            <input
              type={showPassword ? "text" : "password"}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className="w-full py-2 pr-10 mb-10 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Enter Password"
            required
            />
            <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-69 top-1/4 transform -translate-y-1/2 mr-2 cursor-pointer text-gray-500 hover:text-blue-500"
            >
            {showPassword ? (
              // Eye off icon (you can customize the SVG)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.364.27-2.661.758-3.847M6.47 6.47A7.974 7.974 0 0012 4c5.523 0 10 4.477 10 10 0 1.338-.264 2.61-.745 3.778M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.235.752-.552 1.46-.938 2.106M12 19c-4.478 0-8.268-2.943-9.542-7" />
              </svg>
            )}
            </span>
          </div>
          {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mb-10 px-4 rounded hover:bg-white hover:text-black transition"
          >
            Log In
          </button>
        </form>
        {/* <a href='https://www.infinitefocus.ie/'>
          <button
            className="w-full bg-red-500 text-white py-2 mb-10 px-4 rounded hover:bg-white hover:text-red-500 transition"
          >
            Go Back Home
          </button>
          </a> */}
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}
