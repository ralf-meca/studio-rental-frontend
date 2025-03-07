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
    number: number,
    idPhoto: any,
    isConditionsAccepted: boolean
    currentMonth: string
    blockedHoursAndDays: any[]
}