import * as React from 'react'
import {useState} from 'react'
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import {Grid2, IconButton} from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditRentalDialog from "./EditRentalDialog.tsx";
import {IRentalFormValues, RENTAL_STATUS_OPTIONS} from "./rentals.constants.ts";
import NewRentalDialog from "./NewRentalDialog.tsx";
import {useGetRentalsListData} from "../../../shared/useGetRentalsListData.ts";

interface ILightRentalsProps {
}

const RentalsPage: React.FC<ILightRentalsProps> = () => {
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [openNewDialog, setOpenNewDialog] = useState<boolean>(false)
    const [selectedRental, setSelectedRental] = useState<IRentalFormValues>()


    const {rentalList, isRentalListLoading, setRefetchRentalsList} = useGetRentalsListData(false, true)

    const handleEditRental = (params: GridCellParams) => {
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
                <img src={`http://localhost:3001${params?.value}`} alt={params.row.name} style={{width: '50px'}}/>
        },
        {
            field: "name",
            headerName: "Emri",
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
                callBackFunction={() => setRefetchRentalsList(prevVal => !prevVal)}
                rental={selectedRental}
            />
        }
        <NewRentalDialog
            openDialog={openNewDialog}
            setOpenDialog={setOpenNewDialog}
            callBackFunction={() => setRefetchRentalsList(prevVal => !prevVal)}
        />
    </>
}

export default RentalsPage