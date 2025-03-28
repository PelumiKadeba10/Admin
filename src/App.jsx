import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainDisplay from './pages/MainDisplay';
// import Preview from './pages/Preview';
import ProtectedRoute from './component/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainDisplay />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/preview" 
            element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            } 
          /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;