import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {IRemoveHoursFormValues} from "../dashboard/dashboard.constants.ts";
import DateHourPicker from "../../home/reserve/DateHourPicker/DateHourPicker.tsx";
import {Tooltip, Typography} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {getBlockedDatesAndHours} from "./block-availability.utils.ts";
import {generateSelectedHours} from "../../../shared/shared.utils.ts";

interface IBlockHoursProps {
}

const BlockHours: React.FC<IBlockHoursProps> = () => {

    const methods = useForm<IRemoveHoursFormValues>({
        defaultValues: {
            date: "",
            currentMonth: dayjs().format("YYYY-MM")
        }
    })

    const getBlockedDatesAndHoursList = () => {
        getBlockedDatesAndHours(methods?.watch("currentMonth")).then(value => {
            methods?.setValue('blockedHoursAndDays', value)
        })
    }

    // Get the blocked dates and hours on page landing and everytime the month changes
    useEffect(() => {
        getBlockedDatesAndHoursList()
    }, [methods?.watch("currentMonth")])

    const blockedHoursResponseObject = useMemo(() =>
            methods?.watch("blockedHoursAndDays")?.filter(el => el.date === methods?.watch("date"))?.[0]
        , [methods?.watch("blockedHoursAndDays"), methods?.watch("date")])


    const isUnblockingHours = !!blockedHoursResponseObject?.hoursBlocked?.filter((el: string) => el === methods?.watch("startingHour"))?.[0]?.length


    const handleDisableHours: SubmitHandler<IRemoveHoursFormValues> = async (formValues: IRemoveHoursFormValues) => {
        // Gets the startingHour and endingHour and generates an array that holds all the hours inside that range
        const blockedHours = generateSelectedHours(formValues?.startingHour, formValues?.endingHour)

        if (isUnblockingHours) {

            await axios.put(`/api/blocked-availability/remove-blocked-hours/${formValues.date}`, {
                hoursToUnblock: blockedHours
            }).then(async (value) => {
                if (!value) {
                    return
                }
                await getBlockedDatesAndHoursList()
                enqueueSnackbar('Oret u zhbllokuan me sukses', {variant: 'success'})
            })

        } else {
            // If admin is blocking the selected hours
            const payload = {
                date: formValues.date,
                hoursBlocked: blockedHours,
                isBlockedByAdmin: true,
                isAllDayBlocked: false,
            }

            // If blockedHours exist it means we are updating an existing object, so we use a different method
            if (!!blockedHoursResponseObject?.hoursBlocked) {
                await axios.put(`/api/blocked-availability/add/${formValues?.date}`, {
                    hoursBlocked: blockedHours
                }).then(async (value) => {
                    if (!value) {
                        return
                    }
                    await getBlockedDatesAndHoursList()
                    enqueueSnackbar('Oret u bllokuan me sukses', {variant: 'success'})
                })
            } else {
                await axios.post('/api/blocked-availability/hours', {...payload})
                    .then(async (value) => {
                        if (!value) {
                            return
                        }
                        await getBlockedDatesAndHoursList()
                        enqueueSnackbar('Oret u bllokuan me sukses', {variant: 'success'})
                    })
            }

        }
    }

    return <>
        <div className="row">
            <div className="col-sm-12, col-md-6, col-lg-6, col-xl-6 mt-3">
                <form onSubmit={methods?.handleSubmit(handleDisableHours)}>
                    <FormProvider {...methods}>
                        <DateHourPicker isAdmin/>
                    </FormProvider>
                    <Tooltip title={
                        (!methods?.watch("date") || !methods?.watch("startingHour") || !methods?.watch("endingHour"))
                            ? "Select date and the hours to continue" : ""
                    }>
                        <span>
                            {!blockedHoursResponseObject?.isBlockedByAdmin && !!blockedHoursResponseObject?.hoursBlocked?.length && <>
                                <div className="d-flex mb-3">
                                    <InfoOutlinedIcon color="disabled"/>
                                    <Typography color="gray">Oret e bllokuara jane nga rezervimet e
                                        klienteve</Typography>
                                </div>
                            </>}
                            <button
                                type="submit"
                                className="button-30"
                                disabled={!methods?.watch("date") || !methods?.watch("startingHour") || !methods?.watch("endingHour")}
                            >
                                {isUnblockingHours ? "Zhblloko oret" : "Blloko oret"}
                            </button>
                        </span>
                    </Tooltip>
                </form>
            </div>
        </div>
    </>
}

export default BlockHours