import * as React from 'react'
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material'
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import {useForm} from "react-hook-form";
import SelectRHF from "../../../components/shared-components/form/SelectRHF.tsx";
import {ILabelValueOption} from "../../../shared/types.ts";
import TextFieldRHF from "../../../components/shared-components/form/TextFieldRHF.tsx";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

interface IOrderDialogProps {
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    callBackFunction: () => void
    reservation: any
}

const ReservationDialog: React.FC<IOrderDialogProps> = ({openDialog, setOpenDialog, callBackFunction, reservation}) => {
    const [isLightSectionExpanded, setIsLightSectionExpanded] = useState(false)
    const [isIDVisible, setIsIDVisible] = useState(false)
    const methods = useForm<{ status: string, doorCode: number }>()

    // Sets the initial form values
    useEffect(() => {
        methods?.reset({
            status: reservation?.status,
            doorCode: reservation?.doorCode
        })
    }, [reservation])

    const handleConfirm = async () => {
        const status = methods?.watch("status")
        await axios.patch(`/api/reservations/${reservation?.id}`, {
            status: status,
            doorCode: methods?.watch("doorCode"),
            withCredentials: true,
        }).then(() => {
            callBackFunction()
            setOpenDialog(false);

            // Depending on the status in the end we show the following messages
            status === "accepted" && enqueueSnackbar("Kerkesa u pranua", {variant: 'success'})

            status === "refused" && enqueueSnackbar("Kerkesa u refuzua", {variant: 'error'})

            status === "pending" && enqueueSnackbar("Kerkesa u riktye ne 'Pending'", {variant: 'info'})
        })
    }

    const toggleContentLightSection = () => {
        setIsLightSectionExpanded(!isLightSectionExpanded);
    };
    const toggleContentIDSection = () => {
        setIsIDVisible(!isIDVisible);
    }

    const SELECT_OPTIONS: ILabelValueOption[] = [
        {label: "Pending", value: "pending"},
        {label: "Refuzuar", value: "refused"},
        {label: "Pranuar", value: "accepted"},
    ]

    const hoursReservedInTotal = useMemo(() => {
        // Here we format the hours into a date format to use build in date-fns function to compare them
        const startingHour = dayjs(reservation?.hours[0], "HH:mm")
        const endingHour = dayjs(reservation?.hours[reservation?.hours?.length - 1], "HH:mm")

        // Get the difference in minutes, then convert to hours
        return endingHour.diff(startingHour, "hour")
    }, [reservation])

    return <Dialog open={openDialog}
                   onClose={() => setOpenDialog(false)}
                   maxWidth="md"
                   fullWidth={true}>
        <DialogTitle id="alert-dialog-title">
            Detajet e rezervimit
        </DialogTitle>
        <DialogContent>
            <TableContainer component={Paper}
                            sx={{minWidth: "100%", maxHeight: 500, overflow: "auto", marginBottom: 3}}>
                <Table aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{width: 150}}>Emri:</TableCell>
                            <TableCell>{reservation?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>E-mail:</TableCell>
                            <TableCell>{reservation?.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Numri i Telefonit:</TableCell>
                            <TableCell>{reservation?.number}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* See More / See Less Button */}
            <div className="">
                <Link onClick={toggleContentIDSection} className="see-more-link d-flex">
                    <Typography fontWeight={600} marginBottom={2}>
                        {isIDVisible ? "Fshih" : "Shiko"} Karten e ID
                    </Typography>
                    {isIDVisible ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                </Link>

                {isIDVisible &&
                    <img src={`http://localhost:3001/${reservation.idPhoto}`} alt="idPhoto" width={500}/>
                }
            </div>
            <TableContainer component={Paper}
                            sx={{minWidth: "100%", maxHeight: 500, overflow: "auto", marginBottom: 3}}>
                <Table aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{width: 150}}>Dita:</TableCell>
                            <TableCell>{dayjs(reservation?.date).format("DD/MM/YYYY")}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ora e fillimit:</TableCell>
                            <TableCell>{reservation?.hours[0]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ora e mbarimit:</TableCell>
                            <TableCell>{reservation?.hours[reservation?.hours?.length - 1]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Totali nga oret:</TableCell>
                            <TableCell>{hoursReservedInTotal * 10}.00 &#8364;</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{width: 150}}>
                            Totali nga pajisjet
                        </TableCell>
                        <TableCell>
                            {reservation?.total - (hoursReservedInTotal * 10)}.00 &#8364;
                        </TableCell>
                        <TableCell>
                            {/* See More / See Less Button */}
                            {!!reservation?.lightsSelected.length &&
                                <div className="d-flex justify-content-center">
                                    <Link onClick={toggleContentLightSection} className="see-more-link">
                                        {isLightSectionExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                    </Link>
                                </div>
                            }
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* Lights Detailed Table */}
            {isLightSectionExpanded &&
                <TableContainer component={Paper} sx={{minWidth: "100%", maxHeight: 500, overflow: "auto"}}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {Array.isArray(reservation?.lightsSelected) &&
                                reservation?.lightsSelected?.map((light: any) => (
                                    <TableRow key={light?.id}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell align="center" style={{padding: 0}}>
                                            <img src="https://studio.visualminds.al/lights/6.jpeg" alt={light?.id}
                                                 style={{width: '30px'}}/>
                                        </TableCell>
                                        <TableCell component="th" scope="row" width={"50%"}>
                                            {light.name} x {light?.quantity} ({light.price}&#8364;/h)
                                        </TableCell>
                                        <TableCell
                                            align="right">{light.price * reservation?.hours.length} &#8364;</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{width: 150}}>
                            <Typography fontSize={15} fontWeight={800}>
                                Totali i rezervimit
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography fontSize={15} fontWeight={800}>
                                {reservation?.total}.00 &#8364;
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="row mt-4">
                <div className="col-6">
                    <SelectRHF
                        label="Statusi"
                        options={SELECT_OPTIONS}
                        disabled={reservation?.isOld}
                        controllerProps={{
                            name: "status",
                            control: methods?.control
                        }}
                    />
                </div>
                {(!!reservation?.doorCode || methods?.watch("status") === "accepted") &&
                    <div className="col-6">
                        <TextFieldRHF
                            label="Kodi i deres"
                            disabled={reservation?.isOld}
                            controllerProps={{
                                name: "doorCode",
                                control: methods?.control
                            }}
                            slotProps={{
                                input: {
                                    style: {height: 40}
                                }
                            }}
                        />
                    </div>
                }
            </div>


        </DialogContent>
        <DialogActions className='d-flex justify-content-between'>
            <Button onClick={() => setOpenDialog(false)}>
                Anullo
            </Button>
            <button onClick={handleConfirm} className="button-30 mx-4 mb-2"
                    disabled={reservation?.isOld || methods?.watch("status") === "pending"}>
                Konfirmo zgjedhjen
            </button>

        </DialogActions>
    </Dialog>
}

export default ReservationDialog