import { jwtDecode } from 'jwt-decode';
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Chat from './pages/Chat';
import CreateOfferRequest from './pages/CreateOfferRequest';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Register from './pages/Register';

function AppContent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    let isAdmin = false;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.admin) isAdmin = true;
        } catch (error) { console.error("Error decoding token on logout:", error); }
    }
    localStorage.removeItem('token');
    if (isAdmin) {
        navigate('/admin/login');
    } else {
        navigate('/login');
    }
  };

  // --- MODIFIED PrivateRoute ---
  // It now checks if the token is a valid USER token.
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    try {
        const decoded = jwtDecode(token);
        // If the token has a 'user' property, it's a valid user.
        if (decoded.user) {
            return <Layout onLogout={handleLogout}>{children}</Layout>;
        }
    } catch (error) {
        console.error("Invalid token:", error);
    }
    // If the token is missing, invalid, or an admin token, log out and redirect.
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  };

  const AdminPrivateRoute = ({ children }) => {
      if (!localStorage.getItem('token')) { return <Navigate to="/admin/login" />; }
      try {
          const decoded = jwtDecode(localStorage.getItem('token'));
          if (decoded.admin) {
              return <Layout onLogout={handleLogout}>{children}</Layout>;
          }
      } catch (error) { console.error("Invalid token:", error); }
      localStorage.removeItem('token');
      return <Navigate to="/admin/login" />;
  };

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Private User Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateOfferRequest /></PrivateRoute>} />
        <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        {/* Private Admin Route */}
        <Route path="/admin/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
  );
}

// Wrapper component to provide the Router context
const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;