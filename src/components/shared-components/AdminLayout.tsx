import * as React from 'react';
import {ReactNode} from 'react';
import {extendTheme} from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import {AppProvider, Navigation} from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import {PageContainer} from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import VisualMindsIcon from './../../assets/brand/visual-minds-logo-black.png'
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const NAVIGATION: Navigation = [
    {
        segment: 'reservations',
        title: 'Rezervime',
        icon: <ListAltIcon/>,
    },
    {
        segment: 'block-dates-and-hours',
        title: 'Blloko data dhe ore',
        icon: <BlockIcon/>,
    },
    {
        segment: 'rentals',
        title: 'Pajisjet me qera',
        icon: <EmojiObjectsOutlinedIcon/>,
    },
    {
        kind: 'divider',
    },
    /*** 🟢 BUTTON AT THE BOTTOM ***/
    {
        segment: 'logout',
        title: 'Log out',
        icon: <LogoutIcon/>,
    }
];

const customTheme = extendTheme({
    colorSchemes: {light: true, dark: false},
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
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ul: {
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                },
            },
        },
    }
});

interface IAdminLayoutProps {
    children: ReactNode
}

const AdminLayout: React.FC<IAdminLayoutProps> = ({children}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src={VisualMindsIcon} alt="visual minds black logo"/>,
                title: 'Visual Minds Studio',
                homeUrl: '/',
            }}
            router={{
                pathname: `/${pathname.split("/")[2]}`,
                searchParams: new URLSearchParams(),
                navigate: (path: string | URL) => {

                    if (path === "/logout") {
                        axios.post('/api/admin/logout', {}, {withCredentials: true}).then(() => {
                            navigate('/admin/login')
                        })
                        return
                    }

                    navigate(`/admin${String(path)}`)
                }
            }}
            theme={customTheme}
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