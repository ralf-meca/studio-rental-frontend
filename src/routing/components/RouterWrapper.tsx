import {Outlet} from 'react-router-dom'
import HeaderFooter from "../../components/shared-components/HeaderFooter.tsx";
import {FC} from "react";
import AdminLayout from "../../components/shared-components/AdminLayout.tsx";

interface IRouterWrapperProps {
    isAdmin: boolean
}

const RouterWrapper: FC<IRouterWrapperProps> = ({isAdmin}) => {

    return <div>
        {isAdmin
            ?
            <AdminLayout>
                <Outlet/>
            </AdminLayout>
            :
            <HeaderFooter>
                <Outlet/>
            </HeaderFooter>
        }
    </div>
}

export default RouterWrapper
