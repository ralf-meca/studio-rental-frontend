import * as React from 'react'
import {useMemo, useState} from 'react'
import {useFormContext} from "react-hook-form";
import {IReservationFormValues} from "./reserve/reservation.consants.ts";
import {differenceInHours, parse} from "date-fns";
import Typography from "@mui/material/Typography";
import {Divider, Link} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface ISummarySectionProps {
}

const SummarySection: React.FC<ISummarySectionProps> = () => {
    const methods = useFormContext<IReservationFormValues>()
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    const hoursReservedInTotal = useMemo(() => {
        // Here we format the hours into a date format to use build in date-fns function to compare them
        const startingHour = parse(methods?.watch("startingHour"), "HH:mm", new Date())
        const endingHour = parse(methods?.watch("endingHour"), "HH:mm", new Date())

        // Get the difference in minutes, then convert to hours
        return differenceInHours(endingHour, startingHour)
    }, [methods])

    const totalPrice = useMemo(() => {
        const lightsTotal = methods?.watch("selectedLights")?.reduce((previousVal, currentVal) => previousVal + currentVal.price * currentVal.quantity, 0)

        return hoursReservedInTotal * 10 + lightsTotal
    }, [methods])

    return <section className={`summary expanded-${isExpanded}`}>
        <div className="row justify-content-between mt-4">
            {/* See More / See Less Button */}
            <div className="d-flex justify-content-center">
            <Link onClick={toggleContent} className="see-more-link">
                {isExpanded ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
            </Link>
            </div>
            <div className="col-3">
                <Typography fontSize={30}>Total</Typography>
            </div>
            <div className="col-5 d-flex justify-content-end">
                <Typography fontSize={32} fontWeight={600}>{totalPrice}.00 &#8364;</Typography>
            </div>
            <Divider sx={{bgcolor: "secondary.light"}}/>
            <div className="summary-body">
                <div className="row justify-content-between  mt-2">
                    <div className="col-6">
                        <Typography fontSize={15} fontWeight={100}>
                            10 &#8364; x {hoursReservedInTotal} hours
                        </Typography>
                    </div>
                    <div className="col-5 d-flex justify-content-end">
                        <Typography fontSize={20} fontWeight={200}>{hoursReservedInTotal * 10}.00 &#8364;</Typography>
                    </div>
                </div>
                <Divider sx={{bgcolor: "secondary.light"}}/>
                {methods?.watch("selectedLights")?.map(light => <>
                    <div className="row justify-content-between  mt-2">
                        <div className="col-7">
                            <Typography fontSize={15} fontWeight={150}>
                                {light.name}
                            </Typography>
                            <Typography fontSize={12} fontWeight={100}>
                                x {light.quantity}
                            </Typography>

                        </div>
                        <div className="col-5 d-flex justify-content-end">
                            <Typography fontSize={20}
                                        fontWeight={200}>{light.quantity * light.price}.00 &#8364;</Typography>
                        </div>
                    </div>
                </>)}
                <Divider sx={{bgcolor: "secondary.light", marginTop: "10px"}}/>
            </div>
        </div>
    </section>
}

export default SummarySection