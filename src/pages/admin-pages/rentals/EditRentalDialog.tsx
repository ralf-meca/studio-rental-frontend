import * as React from 'react'
import {Dispatch, SetStateAction, useEffect, useMemo} from 'react'
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
            if (formValues.image && formValues.image.length > 0) {
                formData.append("img", formValues.image[0])
            }

            await axios.put(`/api/rentals/${rental?.id}`, formData,{
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(() => {
                enqueueSnackbar("Pajisja u modifikua me sukses", {variant: 'success'})
                setOpenDialog(false)
            })

        } catch (error) {
            console.error("Error updating rental:", error);
        }
        await callBackFunction()
        methods?.reset()
    }

    // Clear form values everytime dialog is closed, or another rental dialog is opened.
    useEffect(() => {
        methods?.reset(rental)
    }, [rental?.id, openDialog])

    // If the image in the formValues is a string it's returned from the BE and we need to locate it in port 3001, otherwise locate it in the FileList
    const imageSrc = useMemo(()=> {
        return typeof methods?.watch("image") === "string"
            ? `http://localhost:3001${methods?.watch("image")}`
            : !!methods?.watch("image") ? URL.createObjectURL(methods?.watch("image")?.[0]) : ''
    },[methods?.watch("image")])

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
                    {!!imageSrc &&
                        <img src={imageSrc} alt="uploadedImage"
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