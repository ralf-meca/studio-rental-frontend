import {ILabelValueOption} from "../../../shared/types.ts";

export interface IRentalFormValues {
    id: string
    img: string
    name: string
    description: string
    price: number
    quantity: number
    status: string
}

export const RENTAL_STATUS_OPTIONS: ILabelValueOption[]= [
    {label: "I prenotueshem",value: "available"},
    {label: "Nuk mund te prenotohet",value: "notAvailable"},
]