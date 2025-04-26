import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import LearningPlansPage from './pages/LearningPlansPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import CreateLearningPlanPage from './pages/CreateLearningPlanPage';
import NetworkPage from './pages/NetworkPage';
import ProfilePage from './pages/ProfilePage';
import MyRecipesPage from './pages/MyRecipesPage';
import MyLearningPlansPage from './pages/MyLearningPlansPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f00',
    },
    secondary: {
      main: '#26a69a',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Component that applies the Layout to its children
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Public routes with layout */}
            <Route element={<LayoutWrapper />}>
              <Route index element={<HomePage />} />
              <Route path="recipes" element={<RecipesPage />} />
              <Route path="recipes/:id" element={<RecipeDetailPage />} />
              <Route path="learning-plans" element={<LearningPlansPage />} />
              <Route path="learning-plans/:id" element={<LearningPlanDetailPage />} />
              
              {/* Protected routes */}
              <Route path="recipes/add" element={
                <ProtectedRoute>
                  <AddRecipePage />
                </ProtectedRoute>
              } />
              <Route path="recipes/edit/:id" element={
                <ProtectedRoute>
                  <AddRecipePage />
                </ProtectedRoute>
              } />
              <Route path="learning-plans/create" element={
                <ProtectedRoute>
                  <CreateLearningPlanPage />
                </ProtectedRoute>
              } />
              <Route path="create-learning-plan/:id" element={
                <ProtectedRoute>
                  <CreateLearningPlanPage />
                </ProtectedRoute>
              } />
              <Route path="network" element={
                <ProtectedRoute>
                  <NetworkPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="my-recipes" element={
                <ProtectedRoute>
                  <MyRecipesPage />
                </ProtectedRoute>
              } />
              <Route path="my-learning-plans" element={
                <ProtectedRoute>
                  <MyLearningPlansPage />
                </ProtectedRoute>
              } />
              <Route path="notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
