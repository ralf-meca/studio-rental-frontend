import * as React from 'react'
import {useState} from 'react'
import Typography from "@mui/material/Typography";
import DoneIcon from '@mui/icons-material/Done';
import {Link} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface IRulesProps {
}

const Rules: React.FC<IRulesProps> = () => {
    const [isRentalPoliciesExpanded, setIsRentalPoliciesExpanded] = useState(false);
    const [isRulesExpanded, setIsRulesExpanded] = useState(false);

    const toggleRentalPoliciesExpanded = () => {
        setIsRentalPoliciesExpanded(!isRentalPoliciesExpanded);
    };
    const toggleRulesExpanded = () => {
        setIsRulesExpanded(!isRulesExpanded);
    };

    return <>
        <Typography fontSize={20} fontWeight={700}>
            RENTAL POLICIES
        </Typography>
        <ul>
            <li key={1}>
                Studio can be rented at 10€ h, minimum booking for 2 hours (total 20€ )
                Time is prepaid every 60 minutes. Example: 0-119 min = 20€, after that every hour starting at
                HH:00-HH:59 =
                10€/h.
            </li>
            <li key={2}>
                Booking is confirmed at least 24h prior to the shooting.
            </li>
            {isRentalPoliciesExpanded && <>
                <li key={3}>
                    Prepaid time cannot be divided, even if the client finishes earlier than the established prepaid
                    time,
                    cost will be paid in full. (10€)h)
                </li>
                <li key={4}>
                    Extra Hours (standard hourly rate applies) are available only when there is no booking confirmed
                    after
                    your
                    reservation.
                </li>
                <li key={5}>
                    The client is responsible for any damage caused to the equipment or studio space during the usage
                    period.
                    All equipment used must be returned in the same condition as it was received.
                </li>
                <li key={6}>
                    The payment must be completed before the end of the studio usage day. Late Payment: In case of
                    delayed
                    payment, a 2% interest will be applied.
                </li>
            </>}
        </ul>
        {/* See More / See Less Button */}
        <Link onClick={toggleRentalPoliciesExpanded} className="see-more-link">
            {isRentalPoliciesExpanded ? 'See Less' : 'See More'}
            {isRentalPoliciesExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Link>

        <Typography fontSize={20} fontWeight={700} className="mt-4">
            RULES
        </Typography>

        <ul>
            <li key={1}>Smoking is not allowed</li>
            <li key={2}>Keep the environment and the floor clean</li>
            <li key={3}>Do not damage the white plaster part</li>
            <li key={4}>The studio is monitored by CCTV cameras</li>
            <li key={5}>Any damage caused will be paid</li>
        </ul>

        {isRulesExpanded && <>
            <Typography fontSize={20} fontWeight={700} className="mt-4">
                FACILITIES
            </Typography>

            <Typography fontSize={15}>
                <DoneIcon/> WiFi
                <br/>
                <DoneIcon/> Electric energy
                <br/>
                <DoneIcon/> Dressing rooms
                <br/>
                <DoneIcon/> Accommodation space
                <br/>
                <DoneIcon/> Toilet
                <br/>
                <DoneIcon/> Private parking nearby (with fee)
                <br/>
            </Typography>

            <Typography fontSize={20} fontWeight={700} className="mt-4">
                WIFI
            </Typography>

            <Typography fontWeight={500}>Network name: Visual Minds</Typography>
            <Typography fontWeight={500}>Password: visual 123E</Typography>

            <Typography fontSize={20} fontWeight={700} className="mt-4">
                CHECKOUT
            </Typography>
            Check in and check out are according to the reservation Make sure all the lights are turned off when you
            leave
        </>
        }
        {/* See More / See Less Button */}
        <div className="d-flex my-4">
        <Link onClick={toggleRulesExpanded} className="see-more-link">
            {isRulesExpanded ? 'See Less' : 'See More'}
            {isRulesExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Link>
        </div>
    </>
}

export default Rules