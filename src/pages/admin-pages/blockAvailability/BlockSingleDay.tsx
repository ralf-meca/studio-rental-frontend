import * as React from 'react'
import {useEffect, useState} from 'react'
import dayjs from "dayjs";
import {DateCalendar, PickersDay} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {useForm} from "react-hook-form";
import {IRemoveHoursFormValues} from "../dashboard/dashboard.constants.ts";
import {getBlockedDatesAndHours} from "./block-availability.utils.ts";

interface IBlockSingleDayProps {
}

const BlockSingleDay: React.FC<IBlockSingleDayProps> = () => {
    const [dateSelected, setDateSelected] = useState<string>('')
    const [blockedDays, setBlockedDays] = useState<string[]>()

    const methods = useForm<IRemoveHoursFormValues>({
        defaultValues: {
            date: "",
            currentMonth: dayjs().format("YYYY-MM")
        }
    })

    // Get the blocked dates and hours on page landing and everytime the month changes
    useEffect(() => {
        getBlockedDatesAndHours(methods?.watch("currentMonth")).then((data) => {
            setBlockedDays(data?.filter((el: any) => el.isAllDayBlocked).map((el: any) => el.date))
        })
    }, [methods?.watch("currentMonth")])

    const handleBlockUnBlock = async () => {
        // If not found as blocked return true, so we block it, otherwise false so we unblock the date
        const isDateToBeBlocked = !blockedDays?.includes(dateSelected)

        await axios.put(`/api/blocked-availability/block-unblock-day/${dateSelected}`, {
            isBlocked: isDateToBeBlocked
        }).then(async (value) => {
            if (!value) {
                return
            }
            // We rerun the api to get the details
            await getBlockedDatesAndHours(methods?.watch("currentMonth")).then((data) => {
                setBlockedDays(data?.filter((el: any) => el.isAllDayBlocked).map((el: any) => el.date))
            })
            enqueueSnackbar(`Dita u ${isDateToBeBlocked ? "" : "zh"}bllokua me sukses`, {variant: 'success'})
        })
    }

    // Custom day component to render each selected day with conditional styling
    const CustomDay = (dayProps: any) => {
        const { day, ...other } = dayProps;
        const dateFormatted = day.format('YYYY-MM-DD');
        const isBlocked = blockedDays?.includes(dateFormatted);

        return (
            <PickersDay
                {...other}
                day={day}
                sx={{
                    ...(isBlocked && {
                        backgroundColor: dateFormatted === dateSelected ? 'gray !important' : 'lightgray',
                    }),
                }}
            />
        );
    };

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                onChange={value => setDateSelected(dayjs(value).format("YYYY-MM-DD"))}
                sx={{margin: 0}}
                onMonthChange={(newMonth) => methods?.setValue("currentMonth", newMonth.format("YYYY-MM"))}
                slots={{
                    day: CustomDay
                }}

            />
        </LocalizationProvider>
        <button
            type="submit"
            className="button-30"
            disabled={!dateSelected}
            onClick={handleBlockUnBlock}
        >
            {!blockedDays?.includes(dateSelected) ? "Blloko diten" : "Zhblloko diten"}
        </button>
    </>
}

export default BlockSingleDay