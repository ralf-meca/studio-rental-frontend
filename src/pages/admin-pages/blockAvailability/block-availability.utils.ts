import dayjs from "dayjs";
import axios from "axios";

// Function to call the API that returns all the blocked dates and hours of a month
export const getBlockedDatesAndHours = async (monthParam: string) => {
    const month = monthParam ?? dayjs().format("YYYY-MM")
    let blockedHoursAndDays

    try {
        const response = await axios.get(`/api/blocked-availability/month/${month}`);
        // We set the value from the response into the form values to have it available in the context
        // in other parts of the form
        blockedHoursAndDays = response.data
    } catch (error) {
        console.error('Error fetching blocked hours for the month', month, error);
    }

    return blockedHoursAndDays
}