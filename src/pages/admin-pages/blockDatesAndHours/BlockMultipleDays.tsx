import * as React from 'react'
import {useEffect, useState} from 'react'
import {DateCalendar} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {Button} from "@mui/material";
import dayjs from "dayjs";

interface IBlockSingleDayProps {
}

const BlockMultipleDays: React.FC<IBlockSingleDayProps> = () => {
    const [startingDay, setStartingDay] = useState<string | null>()
    const  [selectedDates, setSelectedDates]  = useState<string[]>([])

    const generateDateRange = (start: string, end:string) => {
        if (!start || !end) return [];

        const startDate = dayjs(start)
        const endDate = dayjs(end)
        const dates = []

        for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date = date.add(1, 'day')) {
            dates.push(date.format("YYYY-MM-DD"))
        }
        setStartingDay(null)

        setSelectedDates(dates)
    }

    useEffect(() => {
        console.log('selectedDates', selectedDates)
    }, [selectedDates])

    const handleBlock = () => {
        const output = {
            date: startingDay,
            hoursBlocked: [],
            isBlockedByAdmin: true,
            isAllDayBlocked: true,
        }
        console.log('output', output)
    }

    // todo change color of the days on the selected range

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                onChange={value => {
                    const dateSelected = dayjs(value).format("YYYY-MM-DD")

                    if (!!startingDay) {
                        generateDateRange(startingDay, dateSelected) // Call function to translate the range selected into an array of dates
                    } else {
                        setStartingDay(dateSelected)
                    }

                }}
                // slots={{
                //     day: (dayProps) => {
                //         const date = dayProps.day.format("YYYY-MM-DD");
                //         const isSelected = selectedDates.includes(date);
                //
                //         return (
                //             <Box
                //                 sx={{
                //                     width: 36,
                //                     height: 36,
                //                     borderRadius: "50%",
                //                     display: "flex",
                //                     alignItems: "center",
                //                     justifyContent: "center",
                //                     bgcolor: isSelected ? "lightblue" : "transparent",
                //                 }}
                //             >
                //                 {dayProps.day.date()}
                //             </Box>
                //         );
                //     }
                // }}
            />
        </LocalizationProvider>
        <Button
            type="submit"
            variant="contained"
            loading={false}
            disabled={!startingDay}
            onClick={handleBlock}
        >
            Blloko oret
        </Button>
    </>
}

export default BlockMultipleDays