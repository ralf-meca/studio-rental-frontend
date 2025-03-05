import * as React from 'react'
import {useEffect} from 'react'
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {IRemoveHoursFormValues} from "../dashboard/dashboard.constants.ts";
import DateHourPicker from "../../home/reserve/DateHourPicker/DateHourPicker.tsx";
import {Button} from "@mui/material";

interface IBlockHoursProps {
}

const BlockHours: React.FC<IBlockHoursProps> = () => {
    const methods = useForm<IRemoveHoursFormValues>({defaultValues: {date: ""}})

    useEffect(() => {
        console.log('methods?.watch(', methods?.watch())
    }, [methods])

    const handleDisableHours: SubmitHandler<IRemoveHoursFormValues> = async (formValues: IRemoveHoursFormValues) => {
        console.log('', formValues)

        // Gets the startingHour and endingHour and generates an array that holds all the hours inside that range
        const generateBlockedHours = () => {
            const blockedHours = [];

            // Converting the hours in numbers to iterate through them.
            let [startHour, startMinute] = formValues?.startingHour.split(":").map(Number);
            const [endHour, endMinute] = formValues?.endingHour.split(":").map(Number);

            while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
                blockedHours.push(`${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`);
                startHour++;
            }

            return blockedHours;
        }

        const output = {
            date: formValues.date,
            hoursBlocked: generateBlockedHours(),
            isBlockedByAdmin: true,
            isAllDayBlocked: false,
        }

        console.log('output',output)

        // const res = await axios.post('/api/blocked-hours', {
        //     date : {
        //         date: formValues?.date,
        //         blockedHours: []
        //     }
        // })
        // console.log('res',res.data)
    }
    return <>
        <div style={{height: "100vh"}}>
            <div className="disableHours" style={{width: "80%", marginTop: "30px",}}>
                <form onSubmit={methods?.handleSubmit(handleDisableHours)}>
                    <FormProvider {...methods}>
                        <DateHourPicker/>
                    </FormProvider>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={false}
                        disabled={!methods?.watch("date") || !methods?.watch("startingHour") || !methods?.watch("endingHour")}
                    >
                        Blloko oret
                    </Button>
                </form>
            </div>
        </div>
    </>
}

export default BlockHours