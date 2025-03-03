import * as React from 'react'
import {IconButton, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useFieldArray, useFormContext} from "react-hook-form";
import {ILight, IReservationFormValues} from "../reservation.consants.ts";

interface ILightsReservationProps {
}

const LightsReservation: React.FC<ILightsReservationProps> = () => {

    const mockedDataLights = [
        {
            id: 1, name: "Led 300 W godox sl 300 ii", price: 5, quantity: 1,
            img: "https://studio.visualminds.al/lights/1.jpeg"
        },
        {
            id: 2, name: "Nanelite tubes", price: 5, quantity: 4, img: "https://studio.visualminds.al/lights/2.jpeg"
        },
        {
            id: 3, name: "40 W Zhiyun m40", price: 5, quantity: 2, img: "https://studio.visualminds.al/lights/3.jpeg"
        },
        {
            id: 4, name: "100 W Zhiyun fw100", price: 5, quantity: 2, img: "https://studio.visualminds.al/lights/4.jpeg"
        },
        {
            id: 5, name: "Led 200 W Godox fv200", price: 5, quantity: 1,
            img: "https://studio.visualminds.al/lights/5.jpeg"
        },
        {
            id: 6, name: "Led 150 W Godox fv150", price: 5, quantity: 1,
            img: "https://studio.visualminds.al/lights/6.jpeg"
        },
        {
            id: 7, name: "Led 150 W Godox sl150ii", price: 5, quantity: 1,
            img: "https://studio.visualminds.al/lights/7.jpeg"
        },
        {
            id: 8, name: "Strobe 600 W Godox ad600bm", price: 5, quantity: 1,
            img: "https://studio.visualminds.al/lights/8.jpeg"
        },
    ]

    const methods = useFormContext<IReservationFormValues>()

    const selectedLightsFieldArray = useFieldArray({name: "selectedLights", control: methods?.control})

    const handleAddQuantity = ({id, price, name}: ILight) => {
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
            selectedLightsFieldArray.append({id, name, quantity: 1, price});
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
                    {mockedDataLights.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="center" style={{padding: 0}}>
                                <img src={row?.img} alt={row?.name} style={{width: "50px"}}/>
                            </TableCell>
                            <TableCell component="th" scope="row" width={"20%"}>
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.price} &#8364;/h</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => handleRemoveQuantity(row)}>
                                    <RemoveIcon
                                        sx={{
                                            background: (!selectedLightsFieldArray?.fields?.find(light => light?.name === row?.name)?.quantity ||
                                                selectedLightsFieldArray?.fields?.find(light => light?.name === row?.name)?.quantity === 0)
                                                ? "rgba(253,92,99,0.63)" // Lighter color when disabled
                                                : "#fd5c63", // Normal color when enabled
                                            color: "white",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </IconButton>
                                {selectedLightsFieldArray?.fields?.filter(light => light?.name === row?.name)?.[0]?.quantity ?? 0}

                                <IconButton
                                    onClick={() => handleAddQuantity(row)}
                                    disabled={selectedLightsFieldArray?.fields?.filter(light => light?.name === row?.name)?.[0]?.quantity === row?.quantity}
                                >
                                    <AddIcon
                                        sx={{
                                            background: selectedLightsFieldArray?.fields?.find(light => light?.name === row?.name)?.quantity === row?.quantity
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