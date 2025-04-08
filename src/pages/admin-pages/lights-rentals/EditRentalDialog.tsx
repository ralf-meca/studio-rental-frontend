import * as React from 'react'
import {Dispatch, SetStateAction, useEffect} from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import Button from "@mui/material/Button";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {IRentalFormValues} from "./rentals.constants.ts";
import RentalFormFields from "./RentalFormFields.tsx";
import {enqueueSnackbar} from "notistack";
import axios from "axios";

interface IOrderDialogProps {
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    callBackFunction: () => void
    rental: IRentalFormValues
}

const EditRentalDialog: React.FC<IOrderDialogProps> = ({openDialog, setOpenDialog, callBackFunction, rental}) => {
    const methods = useForm<IRentalFormValues>()
    const handleConfirm: SubmitHandler<IRentalFormValues> = async (formValues: IRentalFormValues) => {
        try {
            const formData = new FormData()
            formData.append("name", formValues.name)
            formData.append("description", formValues.description)
            formData.append("price", formValues.price.toString())
            formData.append("quantity", formValues.quantity.toString())
            formData.append("status", formValues.status)

            // Append new image only if provided
            if (formValues.img && formValues.img.length > 0) {
                formData.append("img", formValues.img[0])
            }

            await axios.patch(`/api/rentals/${rental?.id}`, formData,{
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(() => {
                enqueueSnackbar("Pajisja e re u shtua me sukses", {variant: 'success'})
            })

        } catch (error) {
            console.error("Error updating rental:", error);
        }
        await callBackFunction()
    }

    useEffect(() => {
        methods?.reset(rental)
    }, [rental])

    return <Dialog open={openDialog}
                   onClose={() => setOpenDialog(false)}
                   maxWidth="md"
                   fullWidth={true}>
        <form onSubmit={methods?.handleSubmit(handleConfirm)}>
            <DialogTitle id="alert-dialog-title">
                Detajet e pajisjes
            </DialogTitle>

            <DialogContent>

                <div className="row d-flex justify-content-center">
                    {!!methods?.watch("img") &&
                        <img src={methods?.watch("img")} alt="uploadedImage"
                             style={{maxWidth: "250px", filter: "drop-shadow(10px 8px 10px #B2B2B2)"}}/>
                    }
                </div>

                {/* Form Fields */}
                <FormProvider {...methods}>
                    <RentalFormFields/>
                </FormProvider>

            </DialogContent>
            <DialogActions className='d-flex justify-content-between'>
                <Button onClick={() => setOpenDialog(false)}>
                    Anullo
                </Button>
                <button type="submit" className="button-30 mx-4 mb-2">
                    Konfirmo ndryshimet
                </button>
            </DialogActions>
        </form>
    </Dialog>
}

export default EditRentalDialog