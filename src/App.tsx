import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DealerRegister from './pages/auth/DealerRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import DealerDashboard from './pages/dealer/DealerDashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardMain from './pages/dashboard/DashboardMain';
import DealerListing from './pages/admin/DealerListing';
import DealerDetails from './pages/admin/DealerDetails';
import LoanListing from './pages/admin/LoanListing';
import RepresentativeListing from './pages/admin/RepresentativeListing';
// Create a theme instance for your application
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // You can customize these colors
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes browser styles */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/dealer/register" element={<DealerRegister />} />
            <Route path="/admin/dashboard" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardMain />
            </PrivateRoute>
          } />
            <Route path="/dealer/dashboard" element={
              <PrivateRoute allowedRoles={['dealer']}>
                <DealerDashboard />
              </PrivateRoute>
            } />

             <Route path="/dealer-listing" element={<PrivateRoute allowedRoles={['admin']}><DealerListing /></PrivateRoute>} />
             <Route path="/dealer-details/:id" element={<PrivateRoute allowedRoles={['admin']}><DealerDetails /></PrivateRoute>} />

             <Route path="/loan-listing" element={<PrivateRoute allowedRoles={['admin']}><LoanListing /></PrivateRoute>} />
             <Route path="/loan-details/:id" element={<PrivateRoute allowedRoles={['admin']}><DealerDetails /></PrivateRoute>} />

             <Route path="/user-listing" element={<PrivateRoute allowedRoles={['admin']}><RepresentativeListing /></PrivateRoute>} />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;