import * as React from 'react'
import {ReactNode, useState} from 'react'
import {useFormContext} from "react-hook-form";
import {IReservationFormValues} from "../reservation.consants.ts";

interface IContactFormProps {
}

const ContactForm: React.FC<IContactFormProps> = () => {
    const {register, formState: {errors}} = useFormContext<IReservationFormValues>()
    const [uploadedImage, setUploadedImage] = useState<string>()


    // todo @ralf add errors into the form
    const validatePhoneNumber = (number: string) => {
        const numberRegex = /^(\+355\s?|0)?\s?6[7-9]\d\s?\d{3}\s?\d{4,5}$/;
        if (!number) {
            return "Mandatory"
        }
        if (numberRegex.test(number)) {
            return "Please enter a valid phone number"
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            return "Mandatory"
        }
        if (!emailRegex.test(email)) {
            return "Please enter a valid email"
        }
    }

    return <div className="col-md-6 col-sm-6 col-xs-12" id="reserve">
        <input
            {...register("name", {required: "Mandatory"})}
            className="form-control mb-4" placeholder="Emër"
        />
        {errors?.name &&
            <span className="errorMessage">{errors.name.message as ReactNode}</span>
        }
        <input {...register("email", {validate: value => validateEmail(value)})}
               className="form-control mb-4" placeholder="E-mail"
        />
        {errors?.email &&
            <span className="errorMessage">{errors.email.message as ReactNode}</span>}

        <input {...register("number", {validate: value => validatePhoneNumber(value)})}
               className="form-control mb-4" placeholder="+355 XX XXX XXXX"
        />
        {errors?.number &&
            <span className="errorMessage">{errors.number.message as ReactNode}</span>}

        <input {...register("idPhoto", {required: "Mandatory"})}
               className="form-control mb-4" type="file" accept="image/*"
               onChange={(e) => {
                   const file = e.target.files?.[0]
                   setUploadedImage(file ? URL.createObjectURL(file) : undefined)
               }}
        />
        {errors?.idPhoto &&
            <span className="errorMessage">{errors.idPhoto.message as ReactNode}</span>}

        {uploadedImage &&
            <img src={uploadedImage} alt="uploadedImage" style={{maxWidth: "200px"}}/>
        }
        <br/>
    </div>
}

export default ContactForm