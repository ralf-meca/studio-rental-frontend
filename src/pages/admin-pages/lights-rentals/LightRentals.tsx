import * as React from 'react'
import {useEffect, useState} from 'react'
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import {Grid2, IconButton} from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditRentalDialog from "./EditRentalDialog.tsx";
import {IRentalFormValues, RENTAL_STATUS_OPTIONS} from "./rentals.constants.ts";
import NewRentalDialog from "./NewRentalDialog.tsx";
import axios from "axios";

interface ILightRentalsProps {
}

const LightRentals: React.FC<ILightRentalsProps> = () => {
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [openNewDialog, setOpenNewDialog] = useState<boolean>(false)
    const [selectedRental, setSelectedRental] = useState<IRentalFormValues>()
    const [rentalList, setRentalList] = useState<any[]>([])
    const [isRentalListLoading, setIsRentalListLoading] = useState<any>(null)

    const getRentalsListData = async () => {
        try {
            const response = await axios.get("/api/rentals");
            // We set the value from the response
            setRentalList(response.data.map((el: any) => ({
                id: el?._id,
                img: el?.img,
                name: el?.name,
                description: el?.description,
                price: el?.price,
                quantity: el?.quantity,
                status: el?.status
            })) ?? [])
        } catch (error) {
            console.error('Error fetching the rentals', error);
        }
    }
    // Get the list of the rentals on page landing

    useEffect(() => {
        setIsRentalListLoading(true)
        getRentalsListData().then(() => setIsRentalListLoading(false))
    }, [])

    const handleEditRental = (params: GridCellParams) => {
        console.log('params', params?.row)
        setSelectedRental(params?.row)
        setOpenEditDialog(true)
    }

    const handleNewRental = () => {
        setOpenNewDialog(true)
    }

    const columns: GridColDef[] = [
        {
            field: "image", headerName: "",
            flex: 1,
            minWidth: 80, align: "center",
            renderCell: params =>
                <img src="https://studio.visualminds.al/lights/6.jpeg" alt={params.row.name} style={{width: '50px'}}/>
        },
        {
            field: "name",
            headerName: "Name",
            flex: 2,
            minWidth: 250,
        },
        {
            field: "description",
            headerName: "Pershkrimi",
            flex: 2,
            minWidth: 200,
        },
        {
            field: "price",
            headerName: "Cmimi / ore",
            flex: 1, align: "right", headerAlign: "right",
            minWidth: 130, renderCell: params => <span>{params?.value}.00  &#8364;</span>
        },
        {
            field: "quantity",
            headerName: "Sasia ne dispozicion",
            flex: 1,
            minWidth: 250, align: "center", headerAlign: "center",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 200, align: "center", headerAlign: "center",
            renderCell: params => (
                <div className="button-data-grid"
                     style={{background: params?.value === "available" ? "#D0FFBC" : "rgba(253,92,99,0.63)"}}>
                    {RENTAL_STATUS_OPTIONS.find(el => el.value === params?.value)?.label}
                </div>
            )
        },
        {
            field: "edit",
            headerName: "",
            flex: 0.5,
            minWidth: 100, align: "center",
            renderCell: params => <IconButton onClick={() => handleEditRental(params)}><EditNoteIcon/></IconButton>
        }
    ]

    // const mockedLightsData = [
    //     {
    //         id: 1, name: "Led 300 W godox sl 300 ii", price: 5, quantity: 1,
    //         img: "https://studio.visualminds.al/lights/1.jpeg", status: "available"
    //     },
    //     {
    //         id: 2, name: "Nanelite tubes", price: 5, quantity: 4,
    //         img: "https://studio.visualminds.al/lights/2.jpeg", status: "notAvailable"
    //     },
    //     {
    //         id: 3, name: "40 W Zhiyun m40", price: 5, quantity: 2,
    //         img: "https://studio.visualminds.al/lights/3.jpeg", status: "available"
    //     },
    //     {
    //         id: 4, name: "100 W Zhiyun fw100", price: 5, quantity: 2,
    //         img: "https://studio.visualminds.al/lights/4.jpeg", status: "available"
    //     },
    //     {
    //         id: 5, name: "Led 200 W Godox fv200", price: 5, quantity: 1,
    //         img: "https://studio.visualminds.al/lights/5.jpeg", status: "notAvailable"
    //     },
    //     {
    //         id: 6, name: "Led 150 W Godox fv150", price: 5, quantity: 1,
    //         img: "https://studio.visualminds.al/lights/6.jpeg", status: "available"
    //     },
    //     {
    //         id: 7, name: "Led 150 W Godox sl150ii", price: 5, quantity: 1,
    //         img: "https://studio.visualminds.al/lights/7.jpeg"
    //     },
    //     {
    //         id: 8, name: "Strobe 600 W Godox ad600bm", price: 5, quantity: 1,
    //         img: "https://studio.visualminds.al/lights/8.jpeg"
    //     }
    // ]

    return <>
        <Grid2 container>
            <Grid2 size={12} marginBottom={3}>
                <DataGrid
                    columns={columns}
                    rows={rentalList}
                    disableColumnMenu
                    loading={isRentalListLoading}
                    pageSizeOptions={[5]}
                    hideFooterSelectedRowCount
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        },
                    }}
                />
            </Grid2>
            <Grid2 size={12} display={"flex"} justifyContent={"end"}>
                <button onClick={handleNewRental} className="button-30">
                    Shto pajisje te re
                </button>
            </Grid2>
        </Grid2>

        {selectedRental &&
            <EditRentalDialog
                openDialog={openEditDialog}
                setOpenDialog={setOpenEditDialog}
                callBackFunction={getRentalsListData}
                rental={selectedRental}
            />
        }
        <NewRentalDialog
            openDialog={openNewDialog}
            setOpenDialog={setOpenNewDialog}
            callBackFunction={getRentalsListData}
        />
    </>
}

export default LightRentals