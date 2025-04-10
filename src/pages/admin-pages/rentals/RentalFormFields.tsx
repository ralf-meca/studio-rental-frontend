import * as React from 'react'
import TextFieldRHF from "../../../components/shared-components/form/TextFieldRHF.tsx";
import {NumericFormatRHF} from "../../../components/shared-components/form/NumericFormatRHF.tsx";
import SelectRHF from "../../../components/shared-components/form/SelectRHF.tsx";
import {IRentalFormValues, RENTAL_STATUS_OPTIONS} from "./rentals.constants.ts";
import {useFormContext} from "react-hook-form";
import {FIELD_REQUIRED_DEFAULT_CONFIG_AL} from "../../../shared/shared.constants.ts";

interface IRentalFormFieldsProps {
}

const RentalFormFields: React.FC<IRentalFormFieldsProps> = () => {
    const methods = useFormContext<IRentalFormValues>()

    return <>
        {/* Image upload */}
        <div className="row d-flex justify-content-center">
            <div className="col-6 mt-4">
                <input {...methods?.register("image")}
                       className="form-control mb-4" type="file" accept="image/*"
                />
            </div>
        </div>
        {/* Name */}
        <div className="row my-4">
            <div className="col-6">
                <TextFieldRHF
                    label="Emri"
                    controllerProps={{
                        name: "name",
                        control: methods?.control,
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG_AL,
                        }
                    }}
                />
            </div>
            {/* Availability */}
            <div className="col-6">
                <SelectRHF
                    label="Statusi"
                    options={RENTAL_STATUS_OPTIONS}
                    controllerProps={{
                        name: "status",
                        control: methods?.control,
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG_AL,
                        }
                    }}
                />
            </div>
        </div>
        {/* Description */}
        <div className="row my-4">
            <TextFieldRHF
                label="Pershkrimi"
                multiline
                controllerProps={{
                    name: "description",
                    control: methods?.control
                }}
            />
        </div>
        {/* Price */}
        <div className="row">
            <div className="col-6">
                <NumericFormatRHF
                    label="Cmimi"
                    addEuroSymbol
                    controllerProps={{
                        control: methods?.control,
                        name: "price",
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG_AL,
                        }
                    }}
                />
            </div>
            {/* Quantity */}
            <div className="col-6">
                <NumericFormatRHF
                    label="Sasia"
                    controllerProps={{
                        control: methods?.control,
                        name: "quantity",
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG_AL,
                        }
                    }}
                />
            </div>
        </div>
    </>
}

export default RentalFormFields