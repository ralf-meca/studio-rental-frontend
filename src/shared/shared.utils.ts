export const generateSelectedHours = (startingHour:string, endingHour: string) => {
    const blockedHours = [];

    // Converting the hours in numbers to iterate through them.
    let [startHour, startMinute] = startingHour.split(":").map(Number);
    const [endHour, endMinute] = endingHour.split(":").map(Number);

    // Iteration adds 0 on missing positions, ex. if we get startHour = 9, it fills the rest with 0 returning 09:00
    while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
        blockedHours.push(`${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`);
        startHour++;
    }

    return blockedHours;
}