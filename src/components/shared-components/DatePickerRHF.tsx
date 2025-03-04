import * as React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale'
import {Controller, UseControllerProps} from "react-hook-form";


interface IDatePickerRHFProps {
    label?: string
    controllerProps: UseControllerProps<any>
}

const DatePickerRHF: React.FC<IDatePickerRHFProps> = ({label, controllerProps}) => {

    // Making the calendar's weeks start with Monday
    dayjs.extend(updateLocale)
    dayjs.updateLocale('en', {
        weekStart: 1,
    })

    // Function to disable weekends (Saturdays & Sundays)
    const isWeekend = (date: dayjs.Dayjs) => {
        const day = date.day();
        return day === 0 || day === 6; // Sunday (0) or Saturday (6)
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
                        shouldDisableDate={isWeekend} // Disable Saturdays & Sundays
                        minDate={dayjs()} // Can't select dates previous than today's date
                        maxDate={dayjs().add(3, "month")} // Can't select a date further than 2 months from today's date
                        views={["year", "month", "day"]}
                        format={"DD/MM/YYYY"}
                        sx={{width: "100%"}}
                    />
                )}/>
        </LocalizationProvider>
    </>
}
export default DatePickerRHF