import * as React from 'react'
import {useEffect, useMemo, useState} from 'react'
import {FormProvider, useFormContext} from "react-hook-form";
import SelectRHF from "../../../../components/shared-components/form/SelectRHF.tsx";
import {FIELD_REQUIRED_DEFAULT_CONFIG} from "../../../../shared/shared.constants.ts";
import {IReservationFormValues} from "../reservation.consants.ts";
import DatePickerRHF from "../../../../components/shared-components/form/DatePickerRHF.tsx";
import {endingHoursListNormalizer, startingHoursListNormalizer} from "./date-hour-picker.utils.ts";
import {ILabelValueOption} from "../../../../shared/types.ts";
import {Tooltip} from "@mui/material";

interface IDateHourPickerProps {
    isAdmin?: boolean
}

const DateHourPicker: React.FC<IDateHourPickerProps> = ({isAdmin = false}) => {

    const methods = useFormContext<IReservationFormValues>()
    const [startingHoursToDisplay, setStartingHoursToDisplay] = useState<ILabelValueOption[]>([])
    const [endingHoursToDisplay, setEndingHoursToDisplay] = useState<ILabelValueOption[]>([])

    // After selecting the date we are going to filter it's blocked hours by the response and pass that
    const blockedHours = useMemo(() => {
        // If there isn't a date selected or any blocked hours we return an empty array
        if (!methods?.watch("date") || !methods?.watch("blockedHoursAndDays")?.length) {
            return []
        }

        // We filter and return the hoursBlocked of the date selected, or return an empty array
        return methods?.watch("blockedHoursAndDays")?.filter(el => el?.date === methods?.watch("date"))?.[0]?.hoursBlocked
            // Then we format the array we found  into ILabelValue[] type
            .map((el: string) => ({label: el, value: el})) ?? []
    }, [methods?.watch("date"), methods?.watch("blockedHoursAndDays")])

    // If the date is changed we clear the old values from the time selects
    // Setting up the list containing the hours to be displayed to the select startingHour
    useEffect(() => {
        methods?.setValue("startingHour", "")
        setStartingHoursToDisplay(startingHoursListNormalizer(methods?.watch("date")))

        methods?.setValue("endingHour", "")
        setEndingHoursToDisplay([]) //clear old values
    }, [methods?.watch("date")])

    // If the startingHour is changed we clear the old value from the endingHour select
    // Setting up the list containing the hours to be displayed to the select endingHour
    useEffect(() => {
        methods?.setValue("endingHour", "")
        setEndingHoursToDisplay(endingHoursListNormalizer(methods?.watch(), isAdmin))
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
                    isAdmin={isAdmin}
                />
            </FormProvider>
        </div>
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-4">
                <Tooltip title={(!methods?.watch("date")) ? "Select date" : ""} placement="bottom-start">
                    <span>
                        <SelectRHF
                            options={startingHoursToDisplay}
                            disabledOptions={blockedHours}
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
                            isAdmin={isAdmin}
                        />
                    </span>
                </Tooltip>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-4">
                <Tooltip title={
                    (!methods?.watch("date") || !methods?.watch("startingHour")) ? "Select starting hour" : ""
                } placement="bottom-start">
                    <span>
                        <SelectRHF
                            options={endingHoursToDisplay}
                            label="End"
                            disabledOptions={blockedHours}
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
                            isAdmin={isAdmin}
                        />
                    </span>
                </Tooltip>
            </div>

        </div>
    </>
}

export default DateHourPicker