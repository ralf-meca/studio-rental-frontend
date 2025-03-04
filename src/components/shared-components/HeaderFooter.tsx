import * as React from 'react'
import VisualMindsIcon from './../../assets/brand/visual-minds-logo-black.png'
import BackToTop from "./BackToTop.tsx";

interface IHeaderFooterProps {
    children?: React.ReactNode
}

const HeaderFooter: React.FC<IHeaderFooterProps> = (props) => {
    const {children} = props

    return <>
        <img src={VisualMindsIcon} alt={"icon"} style={{
            width: "100px",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1
        }}/>

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