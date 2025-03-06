import dayjs from "dayjs";
import {OPEN_HOUR_LIST} from "./date-hour-picker.constants.ts";
import {IReservationFormValues} from "../reservation.consants.ts";
import {ILabelValueOption} from "../../../../shared/types.ts";


// Gets all the available hours for the day and filers them to display on the startingHour Select
export const startingHoursListNormalizer = (formValuesDate: string) => {
    const theHourAtTheMoment = dayjs().format("HH:mm")

    // Closing time is 23:00 so the latest selectable starting time of the day can be 21:00
    const availableHours = OPEN_HOUR_LIST?.filter(item => item.value !== "22:00" && item.value !== "23:00")

    // Find the index of the current hour in availableHours
    const startingIndex = OPEN_HOUR_LIST?.findIndex(item => item.value === theHourAtTheMoment)

    // If current time is found, and if today's date is selected return all remaining available hours of the day
    return startingIndex >= 0 && formValuesDate === dayjs().format("yyyy-MM-dd")
        ? availableHours.slice(startingIndex + 1)
        : availableHours
}

// Filters the remaining hours after startingHour
export const endingHoursListNormalizer = (formValues: IReservationFormValues, isAdmin: boolean) => {

    if (!formValues?.startingHour) {
        return []
    }
    // Find the index of the selected starting hour in OPEN_HOUR_LIST
    const startingIndex = OPEN_HOUR_LIST?.findIndex(item => item.value === formValues?.startingHour);

    const blockedHours = formValues?.blockedHoursAndDays?.filter(el => el.date === formValues?.date)?.[0]?.hoursBlocked
    const blockedHoursFormatted = blockedHours?.map((el: string) => ({label: el, value: el}))

    // Find the index of the selected starting hour in blockedHoursFormatted
    const startingIndexBlockedHours = blockedHoursFormatted?.findIndex((item: ILabelValueOption) => item.value === formValues?.startingHour)

    const isUnblockingHours = !!blockedHours?.filter((el: string) => el === formValues?.startingHour)?.[0]?.length


    // We return the remaining hours skipping the selected hour and one more hour
    // (so if startingHour is 09:00, the endingHour list starts with 11:00) ,
    // (except if user is Admin, then we don't need to skip anything, since admin shouldn't have the 2 hours minimum required)
    if (isAdmin) {
        // Admin can block/unblock hours, if unblocking, show only the hours that he can unblock
        if (isUnblockingHours) {
            return startingIndexBlockedHours >= 0 && startingIndexBlockedHours < blockedHoursFormatted.length
                ? blockedHoursFormatted.slice(startingIndexBlockedHours)
                : [] // Return empty if no valid hour can be selected
        } else {
            return startingIndex >= 0 && startingIndex < OPEN_HOUR_LIST?.length
                ? OPEN_HOUR_LIST?.slice(startingIndex)
                : [] // Return empty if no valid hour can be selected
        }
    } else {
        return startingIndex >= 0 && startingIndex + 2 < OPEN_HOUR_LIST?.length
            ? OPEN_HOUR_LIST?.slice(startingIndex + 2) // Skip one and show the next one
            : [] // Return empty if no valid hour can be selected after skipping
    }
}