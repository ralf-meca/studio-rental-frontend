import * as React from 'react'
import {useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import VisualMindsIcon from './../../assets/brand/visual-minds-logo-white.png'
import {useNavigate} from "react-router-dom";
import {COLORS} from "../../shared/theme.constants.ts";
import BackToTop from "./BackToTop.tsx";

interface IHeaderFooterProps {
    children?: React.ReactNode
}

const HeaderFooter: React.FC<IHeaderFooterProps> = (props) => {
    const {children} = props
    const navigate = useNavigate()
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

    const handleCloseNavMenu = (url: string) => {
        setIsDrawerOpen(false)
        url && navigate(`/${url}`)
        console.log(isDrawerOpen)
    }

    return <>
        <AppBar position="static" style={{background: "black"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters id="back-to-top-anchor">
                    <div>
                        <img src={VisualMindsIcon} alt={"icon"} style={{width: "100px", display: "inherit"}}/>
                    </div>

                    <div className={"col-1 d-none d-lg-block"}>
                        <Button
                            key={"reserve"}
                            onClick={() => handleCloseNavMenu('reserve')}
                            sx={{my: 2, color: COLORS.fourthColor, display: 'block'}}
                        >
                            Produktet
                        </Button>
                    </div>
                    <div className={"col-6 mx-4 d-none d-lg-block"}>
                        <Button
                            key={"aboutUs"}
                            onClick={() => handleCloseNavMenu('')}
                            sx={{my: 2, color: COLORS.fourthColor, display: 'block'}}
                        >
                            Rreth nesh
                        </Button>
                    </div>
                </Toolbar>
            </Container>
        </AppBar>

        {
            children
        }

        <div className={"d-none d-lg-block"}>
            <BackToTop/>
        </div>

        <footer id="copyright">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <span id="copyright-span">Copyright &copy; 2025 Visual Minds</span>
                    </div>
                </div>
            </div>
        </footer>
    </>
}

export default HeaderFooter