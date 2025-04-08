import * as React from 'react'
import {useState} from 'react'
import {Controller, useFormContext} from "react-hook-form";
import {IReservationFormValues} from "../reservation.consants.ts";
import TextFieldRHF from "../../../../components/shared-components/form/TextFieldRHF.tsx";
import {FIELD_REQUIRED_DEFAULT_CONFIG} from "../../../../shared/shared.constants.ts";
import {TextField} from "@mui/material";

interface IContactFormProps {
}

const ContactForm: React.FC<IContactFormProps> = () => {
    const {register, control} = useFormContext<IReservationFormValues>()
    const [uploadedImage, setUploadedImage] = useState<string>()

    const validatePhoneNumber = (number: number | null) => {
        // Regex has in it all the european phone number prefixes
        // const numberRegex = /^(?:\+|00)?(3[0-9]{1,2}|4[0-9]{1,2})\d{6,10}$/;
        if (!number) {
            return "Field is required"
        }
        if (number?.toString()?.length <= 9) {
            return "Please enter a valid phone number"
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            return "Field is required"
        }
        if (!emailRegex.test(email)) {
            return "Please enter a valid email"
        }
    }

    return <div className="col-md-6 col-sm-6 col-xs-12" id="reserve">
        <TextFieldRHF
            label="Name"
            controllerProps={{
                name: "name",
                control,
                rules: {
                    required: FIELD_REQUIRED_DEFAULT_CONFIG,
                }
            }}
            className="mb-4"
        />
        <TextFieldRHF
            label="E-mail"
            controllerProps={{
                name: "email",
                control,
                rules: {
                    validate: value => validateEmail(value),
                }
            }}
            className="mb-4"
        />

        <Controller
            name="number"
            control={control}
            rules={{
                validate: value => validatePhoneNumber(value),
            }}
            render={({field, fieldState}) => {

                return <div className="mb-4">
                    <TextField
                        label={<>
                            Number
                            <span style={{color: 'red', fontSize: 22}}>
                                *
                            </span>
                        </>}
                        error={!!fieldState.error}
                        helperText={fieldState?.error?.message}
                        fullWidth
                        type="number"
                        placeholder="355 XX XXX XXXX"
                        {...field}
                        slotProps={{htmlInput: {inputMode: 'numeric'}}}
                    />
                </div>
            }}
        />

        <input {...register("idPhoto", {required: "Mandatory"})}
               className="form-control mb-4" type="file" accept="image/*"
               onChange={(e) => {
                   const file = e.target.files?.[0]
                   setUploadedImage(file ? URL.createObjectURL(file) : undefined)
               }}
        />

        {uploadedImage &&
            <img src={uploadedImage} alt="uploadedImage" style={{maxWidth: "200px", filter: "drop-shadow(10px 8px 10px #B2B2B2)"}}/>
        }
        <br/>
    </div>
}

export default ContactForm