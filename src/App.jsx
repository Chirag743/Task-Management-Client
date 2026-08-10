import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHomePage from './pages/dashboard/DashboardHomePage'
import DashboardTasksPage from './pages/dashboard/DashboardTasksPage'
import DashboardProfilePage from './pages/dashboard/DashboardProfilePage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'tasks', element: <DashboardTasksPage /> },
      { path: 'my-profile', element: <DashboardProfilePage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
