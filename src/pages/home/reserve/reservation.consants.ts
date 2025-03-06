export interface ILight {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface IReservationFormValues {
    date: string,
    startingHour: string,
    endingHour: string,
    selectedLights: ILight[]
    name: string,
    email: string,
    number: string,
    idPhoto: string,
    isConditionsAccepted: boolean
    currentMonth: string
    blockedHoursAndDays: any[]
}