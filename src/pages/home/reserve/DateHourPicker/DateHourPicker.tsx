import * as React from 'react'
import {useEffect, useMemo} from 'react'
import { FormProvider, useFormContext} from "react-hook-form";
import SelectRHF from "../../../../components/shared-components/SelectRHF.tsx";
import {ILabelValueOption} from "../../../../shared/types.ts";
import {FIELD_REQUIRED_DEFAULT_CONFIG} from "../../../../shared/shared.constants.ts";
import {IReservationFormValues} from "../reservation.consants.ts";
import DatePickerRHF from "../../../../components/shared-components/DatePickerRHF.tsx";
import dayjs from 'dayjs';

interface IDateHourPickerProps {
}

const DateHourPicker: React.FC<IDateHourPickerProps> = () => {
    const methods = useFormContext<IReservationFormValues>()

    // If the date is changed we clear the old values from the time selects
    useEffect(() => {
        methods?.setValue("startingHour", "")
        methods?.setValue("endingHour", "")
    }, [methods?.watch("date")])

    // If the startingHour is changed we clear the old value from the endingHour select
    useEffect(() => {
        methods?.setValue("endingHour", "")
    }, [methods?.watch("startingHour")])


    // todo @ralf change with available hours array when available from the service response
    const openHoursList: ILabelValueOption[] = [
        {label: "06:00", value: "06:00"},
        {label: "07:00", value: "07:00"},
        {label: "08:00", value: "08:00"},
        {label: "09:00", value: "09:00"},
        {label: "10:00", value: "10:00"},
        {label: "11:00", value: "11:00"},
        {label: "12:00", value: "12:00"},
        {label: "13:00", value: "13:00"},
        {label: "14:00", value: "14:00"},
        {label: "15:00", value: "15:00"},
        {label: "16:00", value: "16:00"},
        {label: "17:00", value: "17:00"},
        {label: "18:00", value: "18:00"},
        {label: "19:00", value: "19:00"},
        {label: "20:00", value: "20:00"},
        {label: "21:00", value: "21:00"},
        {label: "22:00", value: "22:00"},
        {label: "23:00", value: "23:00"},
    ]


    // Gets all the available hours for the day and filers them to display on the startingHour Select
    const mockedTimeStartingTimeList = useMemo(() => {
        const theHourAtTheMoment = dayjs().format("HH:mm")

        // Closing time is 23:00 so the latest selectable starting time of the day can be 21:00
        const availableHours = openHoursList.filter(item => item.value !== "22:00" && item.value !== "23:00")

        // Find the index of the current hour in availableHours
        const startingIndex = openHoursList.findIndex(item => item.value === theHourAtTheMoment)

        // If current time is found, and if today's date is selected return all remaining available hours of the day
        return startingIndex >= 0 && methods?.watch("date") === dayjs().format("yyyy-MM-dd")
            ? availableHours.slice(startingIndex + 1)
            : availableHours

    }, [methods?.watch("date")])

    const endingTimeList = useMemo(() => {
        const startingHour = methods?.watch("startingHour");

        if (!startingHour) {
            return []
        }
        // Find the index of the selected starting hour in openHoursList
        const startingIndex = openHoursList.findIndex(item => item.value === startingHour);

        // We return the remaining hours skipping the selected hour and one more hour
        // (so if startingHour is 09:00, the endingHour list starts with 11:00)
        return startingIndex >= 0 && startingIndex + 2 < openHoursList.length
            ? openHoursList.slice(startingIndex + 2) // Skip one and show the next one
            : [] // Return empty if no valid hour can be selected after skipping

    }, [methods?.watch("startingHour")])

    return <>
        <div className="col-12 mb-4">
            <FormProvider {...methods}>
                <DatePickerRHF
                    label="Which day?"
                    controllerProps={{
                        control: methods?.control,
                        name: "date",
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG,
                        }
                    }}
                />
            </FormProvider>
        </div>
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-4">
                <SelectRHF
                    options={mockedTimeStartingTimeList}
                    disabledOptions={[{label: "10:00", value: "10:00"}]}
                    label="Start"
                    disabled={!methods?.watch("date")} // If the date has not been selected the hour shouldn't be selectable either
                    controllerProps={{
                        control: methods?.control,
                        name: "startingHour",
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG,
                        }
                    }}
                    isTimeSelect
                />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-4">
                <SelectRHF
                    options={endingTimeList}
                    label="End"
                    // If the date or the starting hour has not been selected, the ending hour shouldn't be selectable either
                    disabled={!methods?.watch("date") || !methods?.watch("startingHour")}
                    controllerProps={{
                        control: methods?.control,
                        name: "endingHour",
                        rules: {
                            required: FIELD_REQUIRED_DEFAULT_CONFIG,
                        }
                    }}
                    isTimeSelect
                />
            </div>

        </div>
    </>
}

export default DateHourPicker