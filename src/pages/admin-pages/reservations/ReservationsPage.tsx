import * as React from 'react'
import {DataGrid, GridCellParams, GridColDef, GridRowParams} from '@mui/x-data-grid';
import dayjs from "dayjs";
import ReservationDialog from "./ReservationDialog.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

const ReservationsPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [reservationList, setReservationList] = useState<any[]>([])
    const [selectedReservation, setSelectedReservation] = useState<any>(null)

    // Get initial month reservations
    useEffect(() => {
        getListData().then(() => undefined)
    }, [])


    const getListData = async (monthParam?: string) => {
        const month = monthParam ?? dayjs().format("YYYY-MM")
        try {
            const response = await axios.get(`/api/reservations/month/${month}`);
            // We set the value from the response
            setReservationList(response.data.map((el: any) => ({
                id: el?._id,
                date: el?.date,
                hours: el?.blockedHours,
                name: el?.name,
                total: el?.totalPrice,
                status: el?.status,
                lightsSelected: el?.selectedLights,
                email: el?.email,
                number: el?.number
            })) ?? [])
        } catch (error) {
            console.error('Error fetching reservations for the month', month, error);
        }
    }

    // const mockedData = [
    //     {id: 1, date: "2025-03-07", hours: ["06:00", "07:00", "08:00"], name: "Ralfi", total: 10, status: "pending"},
    //     {id: 2, date: "2025-03-07", hours: ["09:00", "10:00", "11:00"], name: "Toni", total: 15, status: "pending"},
    //     {id: 3, date: "2025-03-07", hours: ["12:00", "13:00", "14:00"], name: "Blerta", total: 20, status: "accepted"},
    //     {id: 4, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Stela", total: 25, status: "pending"},
    //     {id: 5, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Ana", total: 50, status: "refused"},
    //     {id: 6, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Sara", total: 70, status: "refused"},
    //     {id: 7, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Elisa", total: 20, status: "pending"},
    //     {id: 8, date: "2025-03-07", hours: ["15:00", "16:00", "17:00"], name: "Geri", total: 30, status: "pending"},
    //     {id: 9, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Beni", total: 25, status: "pending"},
    //     {id: 10, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Liku", total: 25, status: "accepted"},
    //     {id: 11, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Qazo", total: 25, status: "accepted"},
    //     {id: 12, date: "2025-04-07", hours: ["15:00", "16:00", "17:00"], name: "Gezim", total: 25, status: "refused"},
    // ]

    const STATUS_MAPPER = {
        "pending": "Pending",
        "refused": "Refused",
        "accepted": "Accepted"
    }
    const STATUS_COLOR_MAPPER = {
        "refused": "rgba(253,92,99,0.63)",
        "accepted": "#D0FFBC"
    }
    const STATUS_COLOR_MAPPER_OLD = {
        "refused": "rgba(253,92,99,0.30)",
        "accepted": "#d6f8c8"
    }
    const isReservationOld = (params: GridRowParams | GridCellParams): string => {
        const rowData = params?.row ? params.row : params;

        const rowDate = rowData.date; // expected format "YYYY-MM-DD"
        const rowHours = rowData.hours; // array of time strings, e.g. ["09:00", "10:00"]
        const rowStatus = rowData.status; // e.g., "pending" or something else

        if (!rowDate || !rowHours || rowHours.length === 0) return ''; // If row won't have any data

        // Get today's date in "YYYY-MM-DD" format.
        const today = dayjs().format("YYYY-MM-DD")
        let isOld = false

        // Check if the row's date is before today.
        if (rowDate < today) {
            isOld = true
        } else if (rowDate === today) {
            // When it's today, compare the last hour.
            const lastHour = rowHours[rowHours.length - 1]
            const rowDateTime = dayjs(`${rowDate} ${lastHour}`, "YYYY-MM-DD HH:mm")
            if (rowDateTime.isBefore(dayjs())) {
                isOld = true
            }
        }

        if (isOld) {
            // If the status is pending and the row is old, return "isOldAndIsStillPending"
            if (rowStatus === 'pending') {
                return 'isOldAndIsStillPending';
            }
            // Otherwise, just return "isOld"
            return 'isOld';
        }

        return '';
    }

    const columns: GridColDef[] = [
        {
            field: "date",
            headerName: "Date",
            valueFormatter: value => dayjs(value).format("DD/MM/YYYY"),
            flex: 1, minWidth: 120,
        },
        {
            field: "hours",
            headerName: "Hours",
            flex: 1, minWidth: 120,
            renderCell: params => <span>{params.value[0]} - {params.value[params.value.length - 1]} </span>
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1, minWidth: 150,
        },
        {
            field: "total",
            headerName: "Total",
            flex: 1, minWidth: 120,
            renderCell: params => <span>{params.value}.00 &#8364;</span>
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5, minWidth: 120, align: "right", headerAlign: "center",
            renderCell: params => {
                return <button
                    className="button-data-grid"
                    style={{
                        background: isReservationOld(params?.row) === "isOld"
                            ? STATUS_COLOR_MAPPER_OLD[params.value as keyof typeof STATUS_COLOR_MAPPER]
                            : STATUS_COLOR_MAPPER[params.value as keyof typeof STATUS_COLOR_MAPPER],
                        color: isReservationOld(params?.row) === "isOld" ? "gray" : "black"
                    }}
                    onClick={() => handleClickOpenDialog(params)}
                >
                    <span>{STATUS_MAPPER[params.value as keyof typeof STATUS_MAPPER]}</span>
                </button>
            }
        },
    ]


    const handleClickOpenDialog = (params : GridCellParams) => {
        const isOld = isReservationOld(params?.row)
        setSelectedReservation({...params?.row, isOld: !!isOld})
        setOpenDialog(true);
    };

    return <>
        <DataGrid
            columns={columns}
            rows={reservationList}
            pageSizeOptions={[5]}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5
                    }
                },
            }}
            hideFooterSelectedRowCount
            sx={{
                '.isOld': {
                    // backgroundColor: '#afafaf',
                    color: 'lightgray',
                    '&:hover': {
                        // backgroundColor: '#9b9b9b',
                        color: 'lightgray'
                    }
                },
                '.isOldAndIsStillPending': {
                    backgroundColor: '#ffc1cc',
                    '&:hover': {
                        backgroundColor: '#d39fa9',
                    }
                }
            }}
            getRowClassName={params => isReservationOld(params)}

        />
        <button style={{position: "absolute", top: 100, left: "50%"}}>1</button>
        <ReservationDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            callBackFunction={getListData}
            reservation={selectedReservation}
        />
    </>
}

export default ReservationsPage