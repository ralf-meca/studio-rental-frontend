import * as React from 'react'
import {useEffect, useState} from 'react'
import {DateCalendar, PickersDay} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {getBlockedDatesAndHours} from "./block-availability.utils.ts";
import {useForm} from "react-hook-form";
import {IRemoveHoursFormValues} from "../dashboard/dashboard.constants.ts";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

interface IBlockSingleDayProps {
}

const BlockMultipleDays: React.FC<IBlockSingleDayProps> = () => {
    const [startingDay, setStartingDay] = useState<string>('')
    const [selectedDates, setSelectedDates] = useState<string[]>([])
    const [blockedDays, setBlockedDays] = useState<string[]>()

    const methods = useForm<IRemoveHoursFormValues>({
        defaultValues: {
            date: "",
            currentMonth: dayjs().format("YYYY-MM")
        }
    })

    // Function that takes the two dates we have selected, iterates through them and returns an array with all the date in the range
    const generateDateRange = (start: string, end: string) => {
        if (!start || !end) return [];

        const startDate = dayjs(start)
        const endDate = dayjs(end)
        const dates = []

        for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date = date.add(1, 'day')) {
            dates.push(date.format("YYYY-MM-DD"))
        }
        setStartingDay('')

        setSelectedDates(dates)
    }

    // Get the blocked dates and hours on page landing and everytime the month changes
    useEffect(() => {
        getBlockedDatesAndHours(methods?.watch("currentMonth")).then((data) => {
            setBlockedDays(data?.filter((el: any) => el.isAllDayBlocked).map((el: any) => el.date))
        })
    }, [methods?.watch("currentMonth")])

    const handleBlockMultiple = async () => {

        // If not found as blocked return true, so we block it, otherwise false so we unblock the date
        // We start from the starting day, logically the rest of the selection will have the same value
        const isDateToBeBlocked = !blockedDays?.includes(selectedDates[0])


        await axios.put(`/api/blocked-availability/bulk-block-unblock/`, {
            dates: selectedDates, isBlockedByAdmin: isDateToBeBlocked
        }).then(async (value) => {
            if (!value) {
                return
            }
            // We rerun the api to get the details
            await getBlockedDatesAndHours(methods?.watch("currentMonth")).then((data) => {
                setBlockedDays(data?.filter((el: any) => el.isAllDayBlocked).map((el: any) => el.date))
            })
            enqueueSnackbar(`Ditet u ${isDateToBeBlocked ? "" : "zh"}bllokuan me sukses`, {variant: 'success'})
        })


    }

    // Custom day component to render each selected day with conditional styling
    const CustomDay = (dayProps: any) => {
        const {day, ...other} = dayProps;
        const dateFormatted = day.format('YYYY-MM-DD');
        const isSelected = selectedDates.includes(dateFormatted)
        const isFirstDay = selectedDates?.[0] === dateFormatted
        const isBlocked = blockedDays?.includes(dateFormatted)

        return (
            <PickersDay
                {...other}
                day={day}
                sx={{
                    ...((isSelected || isBlocked) && {
                        backgroundColor: isBlocked && isSelected ? "#df8fc5" : isBlocked ? 'lightgray'
                            : isFirstDay
                                ? 'blue'
                                : 'lightblue',
                        color: isBlocked ? 'black' : 'white',
                    }),
                }}
            />
        );
    };

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                onChange={value => {
                    const dateSelected = dayjs(value).format("YYYY-MM-DD");

                    if (selectedDates.length > 0) {
                        // If a range is already selected, clear it and start a new selection.
                        setSelectedDates([]);
                        setStartingDay(dateSelected);
                    } else if (startingDay) {
                        // If a starting day is already selected, generate the range.
                        generateDateRange(startingDay, dateSelected);
                    } else {
                        // If no starting day is selected yet, set it as startingDay.
                        setStartingDay(dateSelected);
                    }
                }}
                slots={{
                    day: CustomDay
                }}
                sx={{margin: 0}}
                onMonthChange={(newMonth) => methods?.watch("currentMonth", newMonth.format("YYYY-MM"))}
            />
        </LocalizationProvider>
        <button
            type="submit"
            className="button-30"
            disabled={!selectedDates.length}
            onClick={handleBlockMultiple}
        >
            {!!blockedDays?.includes(selectedDates[0]) ? "Zhblloko ditet" : "Blloko ditet"}
        </button>
    </>
}

export default BlockMultipleDays