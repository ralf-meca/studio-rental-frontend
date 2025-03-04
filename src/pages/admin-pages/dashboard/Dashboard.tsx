import * as React from 'react'
import {useEffect} from 'react'
import DateHourPicker from "../../home/reserve/DateHourPicker/DateHourPicker.tsx";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {Button} from "@mui/material";
import {IRemoveHoursFormValues} from "./dashboard.constants.ts";
import axios from "axios";

interface IDashboardProps {
}

const Dashboard: React.FC<IDashboardProps> = () => {
    const methods = useForm<IRemoveHoursFormValues>({defaultValues: {date: ""}})

    useEffect(() => {
        console.log('methods?.watch(', methods?.watch())
    }, [methods])

    const handleDisableHours: SubmitHandler<IRemoveHoursFormValues> = async(formValues: IRemoveHoursFormValues) => {
        console.log('', formValues)
        const res = await axios.post('/api/blocked-hours', {
            date : {
                date: formValues?.date,
                blockedHours: []
            }
        })
        console.log('res',res.data)
    }

    return <>
        <div style={{height: "100vh"}}>
            <div className="disableHours" style={{width: "80%", marginTop: "130px", marginLeft: "100px"}}>
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

export default Dashboard