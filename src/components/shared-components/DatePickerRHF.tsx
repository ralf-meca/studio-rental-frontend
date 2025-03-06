import * as React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale'
import {Controller, UseControllerProps, useFormContext} from "react-hook-form";


interface IDatePickerRHFProps {
    label?: string
    controllerProps: UseControllerProps<any>
    isAdmin: boolean
}

const DatePickerRHF: React.FC<IDatePickerRHFProps> = ({label, controllerProps, isAdmin}) => {
    const {watch, setValue} = useFormContext()

    // Making the calendar's weeks start with Monday
    dayjs.extend(updateLocale)
    dayjs.updateLocale('en', {
        weekStart: 1,
    })

    const isDateBooked = (day: string) => {
        const dayBlocked = watch("blockedHoursAndDays")?.filter((el: any) => el.date === day)[0]

        if (dayBlocked?.isAllDayBlocked) return true
        // If all hours are reserved and user is client the entire day should be disabled
        if (dayBlocked?.hoursBlocked.length === 18 && !isAdmin) return true
        // If nothing is found the day is not disabled
        return false
    }

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                {...controllerProps}
                render={({field: {onChange, value}}) => (
                    <DatePicker
                        label={label}
                        value={dayjs(value) ?? ""}
                        onChange={value => onChange(dayjs(value).format("YYYY-MM-DD"))}
                        onMonthChange={(newMonth) => setValue("currentMonth", newMonth.format("YYYY-MM"))}
                        shouldDisableDate={day => isDateBooked(dayjs(day).format("YYYY-MM-DD"))}
                        minDate={dayjs()} // Can't select dates previous than today's date
                        maxDate={dayjs().add(3, "month")} // Can't select a date further than 2 months from today's date
                        views={["year", "month", "day"]}
                        format={"DD/MM/YYYY"}
                        sx={{width: "100%"}}
                        orientation="portrait"
                    />
                )}/>
        </LocalizationProvider>
    </>
}
export default DatePickerRHF