import * as React from 'react'
import dayjs from "dayjs";
import {DateCalendar} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {useState} from "react";
import {Button} from "@mui/material";

interface IBlockSingleDayProps {
}

const BlockSingleDay: React.FC<IBlockSingleDayProps> = () => {
    const [dateToBlock, setDateToBlock] = useState<string>()

    const handleBlock = () => {
        const output = {
            date: dateToBlock,
            hoursBlocked: [],
            isBlockedByAdmin: true,
            isAllDayBlocked: true,
        }
        console.log('output',output)
    }

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                onChange={value => setDateToBlock(dayjs(value).format("YYYY-MM-DD"))}
            />
        </LocalizationProvider>
        <Button
            type="submit"
            variant="contained"
            loading={false}
            disabled={!dateToBlock}
            onClick={handleBlock}
        >
            Blloko oret
        </Button>
    </>
}

export default BlockSingleDay