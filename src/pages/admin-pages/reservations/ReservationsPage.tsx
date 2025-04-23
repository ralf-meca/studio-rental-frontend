import * as React from 'react'
import {useEffect, useState} from 'react'
import {DataGrid, GridCellParams, GridColDef, GridRowParams} from '@mui/x-data-grid';
import dayjs from "dayjs";
import ReservationDialog from "./ReservationDialog.tsx";
import axios from "axios";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {Grid2, IconButton} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {STATUS_COLOR_MAPPER, STATUS_COLOR_MAPPER_OLD, STATUS_MAPPER} from "./reservations.constants.ts";

const ReservationsPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [reservationList, setReservationList] = useState<any[]>([])
    const [isReservationListLoading, setIsReservationListLoading] = useState<any>(null)
    const [selectedReservation, setSelectedReservation] = useState<any>(null)
    const [monthSelected, setMonthSelected] = useState<string>(dayjs().format("YYYY-MM"))

    // Get the list of the reservations everytime the month changes
    useEffect(() => {
        setIsReservationListLoading(true)
        getListData().then(() => setIsReservationListLoading(false))
    }, [monthSelected])

    const getListData = async () => {
        try {
            const response = await axios.get(`/api/reservations/month/${monthSelected}`, {withCredentials: true});
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
                number: el?.number,
                idPhoto: el?.idPhoto
            })) ?? [])
        } catch (error) {
            console.error('Error fetching reservations for the month', monthSelected, error);
        }
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


    const handleClickOpenDialog = (params: GridCellParams) => {
        const isOld = isReservationOld(params?.row)
        setSelectedReservation({...params?.row, isOld: !!isOld})
        setOpenDialog(true)
    };

    return <>
        <Grid2 container>
            <Grid2 size={12} marginBottom={3}>
                <DataGrid
                    columns={columns}
                    rows={reservationList}
                    loading={isReservationListLoading}
                    pageSizeOptions={[10]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        },
                    }}
                    hideFooterSelectedRowCount
                    sx={{
                        '.isOld': {
                            color: 'lightgray',
                            '&:hover': {
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
            </Grid2>
            <Grid2 size={12} display={"flex"} justifyContent={"end"}>
                <IconButton
                    onClick={() => setMonthSelected(dayjs(monthSelected).subtract(1, "month").format("YYYY-MM"))}
                    disabled={isReservationListLoading}
                >
                    <ArrowBackIosNewIcon/>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        openTo="month"                     // Start the picker in month view
                        views={['year', 'month']}          // Allow selection of year and month
                        label="Zgjidh Muajin"
                        value={dayjs(monthSelected)}
                        disabled={isReservationListLoading}
                        onChange={value => setMonthSelected(dayjs(value).format("YYYY-MM"))}
                        orientation="portrait"

                    />
                </LocalizationProvider>
                <IconButton
                    onClick={() => setMonthSelected(dayjs(monthSelected).add(1, "month").format("YYYY-MM"))}
                    disabled={isReservationListLoading}
                >
                    <ArrowForwardIosIcon/></IconButton>
            </Grid2>
        </Grid2>
        <ReservationDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            callBackFunction={getListData}
            reservation={selectedReservation}
        />
    </>
}

export default ReservationsPage