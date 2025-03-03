import {Outlet} from 'react-router-dom'
import HeaderFooter from "../../components/shared-components/HeaderFooter.tsx";

const RouterWrapper = () => {

    return <div>
        <HeaderFooter>
            <Outlet/>
        </HeaderFooter>
    </div>
}

export default RouterWrapper
