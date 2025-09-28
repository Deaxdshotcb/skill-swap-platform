import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import CreateOfferRequest from './pages/CreateOfferRequest';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Register from './pages/Register';

// A simple HOC for protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // If there's a token, wrap the page in the main layout
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes have no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Private routes are wrapped in the Layout component */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateOfferRequest /></PrivateRoute>} />
        <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;