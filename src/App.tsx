import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";
import {Button} from '@mui/material'
import SuspenseFallback from "./routing/components/SuspenseFallback.tsx";
import {closeSnackbar, SnackbarProvider} from 'notistack'
import ProtectedRoute from "./components/shared-components/ProtectedRoute.tsx";

const RouterWrapper = lazy(() => import('./routing/components/RouterWrapper.tsx'))
const Home = lazy(() => import('./pages/home/Home.tsx'))
const OrdersPage = lazy(() => import('./pages/admin-pages/reservations/ReservationsPage.tsx'))
const Dashboard = lazy(() => import('./pages/admin-pages/dashboard/Dashboard.tsx'))
const AdminLogin = lazy(() => import('./pages/admin-pages/login/AdminLogin.tsx'))
const BlockDatesAndHours = lazy(() => import('./pages/admin-pages/blockAvailability/BlockAvailabilityPage.tsx'))

const router = createBrowserRouter([
    {
        element: <RouterWrapper isAdmin={false}/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "admin/login", element: <AdminLogin/>} // using the normal RouterWrapper
        ],
    },
    {
        element: <RouterWrapper isAdmin={true}/>, // Separate wrapper for admin pages
        children: [
            {
                path: "admin",
                element: <ProtectedRoute/>, // Protect all admin routes
                children: [
                    {path: "dashboard", element: <Dashboard/>},
                    {path: "reservations", element: <OrdersPage/>},
                    {path: "block-dates-and-hours", element: <BlockDatesAndHours/>},
                ],
            },
        ],
    },
]);

function App() {
    return (
        <SnackbarProvider
            autoHideDuration={8000}
            maxSnack={3}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            action={(snackbarId) => (
                <Button style={{color: 'white'}} onClick={() => closeSnackbar(snackbarId)}>
                    Mbyll
                </Button>
            )}
        >
            <Suspense fallback={<SuspenseFallback/>}>
                <RouterProvider router={router}/>
            </Suspense>
        </SnackbarProvider>
    )
}

export default App
