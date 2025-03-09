import * as React from 'react'
import {Dispatch, SetStateAction, useState} from 'react'
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
import SelectRHF from "../../../components/shared-components/SelectRHF.tsx";
import {ILabelValueOption} from "../../../shared/types.ts";
import TextFieldRHF from "../../../components/shared-components/TextFieldRHF.tsx";

interface IOrderDialogProps {
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    callBackFunction: () => void
    reservation: any
}

const ReservationDialog: React.FC<IOrderDialogProps> = ({openDialog, setOpenDialog, callBackFunction, reservation}) => {
    const handleConfirm = () => {
        callBackFunction()
        setOpenDialog(false);
    }

    const methods = useForm<{ status: string, doorCode: number }>({
        defaultValues: {
            status: reservation?.status,
            doorCode: reservation?.doorCode
        }
    })

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };
    console.log('reservation', reservation)

    const SELECT_OPTIONS: ILabelValueOption[] = [
        {label: "Pending", value: "pending"},
        {label: "Refuzuar", value: "refused"},
        {label: "Pranuar", value: "accepted"},
    ]

    return <Dialog open={openDialog}
                   onClose={() => setOpenDialog(false)}
                   maxWidth="md"
                   fullWidth={true}>
        <DialogTitle id="alert-dialog-title">
            Detajet e rezervimit
        </DialogTitle>
        <DialogContent>
            Rezervuesi:
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
                            <TableCell>{reservation?.hours.length * 10}.00 &#8364;</TableCell>
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
                            {reservation?.total - reservation?.hours.length * 10}.00 &#8364;
                        </TableCell>
                        <TableCell>
                            {/* See More / See Less Button */}
                            <div className="d-flex justify-content-center">
                                <Link onClick={toggleContent} className="see-more-link">
                                    {isExpanded ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* Lights Detailed Table */}
            {isExpanded &&
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

            <div className="row">
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
            <Button onClick={handleConfirm} variant="contained" loading={false} disabled={reservation?.isOld}>
                Konfirmo zgjedhjen
            </Button>

        </DialogActions>
    </Dialog>
}

export default ReservationDialog