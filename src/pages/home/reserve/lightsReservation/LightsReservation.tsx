import * as React from 'react'
import {IconButton, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useFieldArray, useFormContext} from "react-hook-form";
import {ILight, IReservationFormValues} from "../reservation.consants.ts";
import {useGetRentalsListData} from "../../../../shared/useGetRentalsListData.ts";

interface ILightsReservationProps {
}

const LightsReservation: React.FC<ILightsReservationProps> = () => {


    const {rentalList} = useGetRentalsListData(true, false)

    const methods = useFormContext<IReservationFormValues>()

    const selectedLightsFieldArray = useFieldArray({name: "selectedLights", control: methods?.control})

    const handleAddQuantity = ({id, price, name, image}: ILight) => {
        const existingIndex = selectedLightsFieldArray.fields.findIndex(item => item.name === name);
        if (existingIndex !== -1) {
            const existingItem = selectedLightsFieldArray.fields[existingIndex];
            if (!existingItem) return;


            // If item exists, we update the quantity
            selectedLightsFieldArray.update(existingIndex, {
                ...existingItem,
                quantity: (existingItem.quantity ?? 0) + 1,
            });
        } else {
            // If item doesn't exist, append it with quantity 1
            selectedLightsFieldArray.append({id, name, quantity: 1, price, image});
        }
    }

    const handleRemoveQuantity = ({name}: ILight) => {
        const existingIndex = selectedLightsFieldArray.fields.findIndex(item => item.name === name);

        if (existingIndex !== -1) {
            const existingItem = selectedLightsFieldArray.fields[existingIndex];
            if (!existingItem) return

            // If quantity reaches 0 we remove the object from the selected lights
            if (existingItem.quantity === 1) {
                selectedLightsFieldArray.remove(existingIndex)
                return
            }

            // If item exists, we update the quantity
            selectedLightsFieldArray.update(existingIndex, {
                ...existingItem,
                quantity: (existingItem.quantity ?? 0) - 1,
            })
        }
    }

    return <>
        <TableContainer component={Paper} sx={{minWidth: "100%", maxHeight: 500, overflow: "auto"}}>
            <Table aria-label="simple table">
                <TableBody>
                    {rentalList.map((rental) => (
                        <TableRow
                            key={rental?.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="center" style={{padding: 0}}>
                                <img src={`http://localhost:3001${rental?.image}`} alt={rental?.name} style={{width: "50px"}}/>
                            </TableCell>
                            <TableCell component="th" scope="row" width={"20%"}>
                                {rental?.name}
                            </TableCell>
                            <TableCell align="right">{rental?.price} &#8364;/h</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => handleRemoveQuantity(rental)}>
                                    <RemoveIcon
                                        sx={{
                                            background: (!selectedLightsFieldArray?.fields?.find(light => light?.name === rental?.name)?.quantity ||
                                                selectedLightsFieldArray?.fields?.find(light => light?.name === rental?.name)?.quantity === 0)
                                                ? "rgba(253,92,99,0.63)" // Lighter color when disabled
                                                : "#fd5c63", // Normal color when enabled
                                            color: "white",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </IconButton>
                                {selectedLightsFieldArray?.fields?.filter(light => light?.name === rental?.name)?.[0]?.quantity ?? 0}

                                <IconButton
                                    onClick={() => handleAddQuantity(rental)}
                                    disabled={selectedLightsFieldArray?.fields?.filter(light => light?.name === rental?.name)?.[0]?.quantity === rental?.quantity}
                                >
                                    <AddIcon
                                        sx={{
                                            background: selectedLightsFieldArray?.fields?.find(light => light?.name === rental?.name)?.quantity === rental?.quantity
                                                ? "#B0C4DE" // Lighter color when disabled
                                                : "#007FFF", // Normal color when enabled
                                            color: "white",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default LightsReservation