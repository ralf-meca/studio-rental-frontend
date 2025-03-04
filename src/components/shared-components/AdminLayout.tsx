import * as React from 'react';
import {ReactNode} from 'react';
import {extendTheme} from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import LogoutIcon from '@mui/icons-material/Logout';
import {AppProvider, Navigation} from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import {PageContainer} from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import VisualMindsIcon from './../../assets/brand/visual-minds-logo-black.png'
import {useLocation, useNavigate} from "react-router-dom";

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
    /*** 🟢 BUTTON AT THE BOTTOM ***/
    {
        segment: 'logout',
        title: 'Log out',
        icon: <LogoutIcon />,
    }
];

const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
    typography: {
        h6: {
            color: "black !important"
        }
    }
});

interface IAdminLayoutProps {
    children: ReactNode
}
const AdminLayout: React.FC<IAdminLayoutProps>= ({children}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src={VisualMindsIcon} alt="visual minds black logo" />,
                title: 'Visual Minds Studio',
                homeUrl: '/admin',
            }}
            router={{
                pathname: `/${pathname.split("/")[2]}`,
                searchParams: new URLSearchParams(),
                navigate: (path: string | URL) => {

                    if (path === "/logout"){
                        localStorage.removeItem('token')
                        navigate('/admin/login')
                        return
                    }

                    navigate(`/admin${String(path)}`)
                }
            }}
            theme={demoTheme}
            window={window}
        >
            <DashboardLayout>
                <PageContainer>
                    <Grid container spacing={1}>
                        {children}
                    </Grid>
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
export default AdminLayout