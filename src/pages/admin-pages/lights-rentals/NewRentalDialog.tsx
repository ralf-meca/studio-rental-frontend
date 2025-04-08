import * as React from 'react'
import {Dispatch, SetStateAction, useEffect} from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle, Tooltip} from '@mui/material'
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
}

const NewRentalDialog: React.FC<IOrderDialogProps> = ({openDialog, setOpenDialog, callBackFunction}) => {
    const methods = useForm<IRentalFormValues>({
        defaultValues: {
            img: "", description: "", name: "", price: undefined, quantity: undefined, status: "",
        }
    })
    const handleConfirm: SubmitHandler<IRentalFormValues> = async (formValues: IRentalFormValues) => {
        console.log('formValues', formValues)

        try {
            const formData = new FormData();
            formData.append("name", formValues.name);
            formData.append("description", formValues.description);
            formData.append("price", formValues.price.toString());
            formData.append("quantity", formValues.quantity.toString());
            formData.append("status", formValues.status);
            formData.append("img", formValues.img[0]); // Get the first file

            console.log('formValues.img[0]',formValues.img)
            axios.post('/api/rentals', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(() => {
                enqueueSnackbar("Pajisja e re u shtua me sukses", {variant: 'success'})
            })

        } catch (error) {
            console.error("Error creating rental:", error);
        }

        await callBackFunction()
    }
    useEffect(() => {
        console.log('watch', methods?.watch("img"))
    }, [methods?.watch("img")])

    return <Dialog open={openDialog}
                   onClose={() => setOpenDialog(false)}
                   maxWidth="md"
                   fullWidth={true}>
        <form onSubmit={methods?.handleSubmit(handleConfirm)}>
            <DialogTitle id="alert-dialog-title">
                Shto detajet e pajisjes
            </DialogTitle>

            <DialogContent>

                <div className="row d-flex justify-content-center">
                    {!!methods?.watch("img").length &&
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

                <Tooltip title={(!methods?.watch("img")) ? "Vendos nje foto" : ""} placement="bottom-start">
                    <span>
                        <button type="submit" className="button-30 mx-4 mb-2" disabled={!methods?.watch("img")}>
                            Krijo
                        </button>
                        </span>
                </Tooltip>
            </DialogActions>
        </form>
    </Dialog>
}

export default NewRentalDialog