import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";
import {Button} from '@mui/material'
import SuspenseFallback from "./routing/components/SuspenseFallback.tsx";
import {closeSnackbar, SnackbarProvider} from 'notistack'
import ProtectedRoute from "./components/shared-components/ProtectedRoute.tsx";

const RouterWrapper = lazy(() => import('./routing/components/RouterWrapper.tsx'))
const Home = lazy(() => import('./pages/home/Home.tsx'))
const OrdersPage = lazy(() => import('./pages/admin-pages/orders/OrdersPage.tsx'))
const Dashboard = lazy(() => import('./pages/admin-pages/dashboard/Dashboard.tsx'))
const AdminLogin = lazy(() => import('./pages/admin-pages/login/AdminLogin.tsx'))

const router = createBrowserRouter([
    {
        element: <RouterWrapper/>,
        children: [
            {path: "/", element: <Home/>},
            {
                path: "/admin",
                element: <ProtectedRoute/>,
                children: [
                    {path: "dashboard", element: <Dashboard/>},
                    {path: "orders", element: <OrdersPage/>}
                ]
            },
            {path: "admin/login", element: <AdminLogin/>}
        ]
    }
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
