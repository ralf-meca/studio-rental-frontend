import * as React from 'react'
import {useMemo, useState} from 'react'
import "./../../index.css"
import studioPhoto1 from "./../../assets/brand/studio-photo.jpeg"
import studioPhoto2 from "./../../assets/brand/studio1.jpg"
import studioPhoto3 from "./../../assets/brand/studio2.jpg"
import studioPhoto4 from "./../../assets/brand/studio3.jpg"
import {ImageSlider} from "./imageSlider/ImageSlider.tsx";
import ReservationSteps from "./reserve/ReservationSteps.tsx";
import InformationSection from "./InformationSection.tsx";
import SummarySection from "./SummarySection.tsx";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {IReservationFormValues} from "./reserve/reservation.consants.ts";
import dayjs from "dayjs";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

const Home: React.FC = () => {
    const [closeLastStep, setCloseLastStep] = useState<boolean>(false)
    const methods = useForm<IReservationFormValues>({
        defaultValues: {
            date: "",
            currentMonth: dayjs().format("YYYY-MM"),
            idPhoto: ''
        }
    })

    const handleSubmitReservation: SubmitHandler<IReservationFormValues> = async (formValues: IReservationFormValues) => {
        setCloseLastStep(true)

        const formData = new FormData();
        formData.append('date', formValues?.date)
        formData.append('startingHour', formValues?.startingHour)
        formData.append('endingHour', formValues?.endingHour)
        formData.append('selectedLights', JSON.stringify(formValues?.selectedLights)); // Stringify array data
        formData.append('name', formValues?.name)
        formData.append('email', formValues?.email)
        formData.append('number', formValues?.number.toString())
        formData.append('idPhoto', formValues?.idPhoto?.[0])

        // Send the request
        axios.post('/api/reservations', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(() => {
                setCloseLastStep(false) // reset state to false if user will do another reservation, it can work again
                enqueueSnackbar("Booking request sent - you will be notified via email", {variant: 'success'})
            })
            .catch(error => console.error('Error:', error))
    }

    const [activeStep, setActiveStep] = React.useState<number>(0)

    const detailsColumnSizes = useMemo(() => activeStep === 0 ? "col-sm-12 col-md-8 col-lg-8 col-xl-8" : "col-sm-12 col-md-12 col-lg-5 col-xl-5"
        , [activeStep])
    const reservationColumnSizes = useMemo(() => activeStep === 0 ? "col-sm-12 col-md-4 col-lg-4 col-xl-4" : "col-sm-12 col-md-12 col-lg-7 col-xl-7"
        , [activeStep])

    return <>
        <section id="hero">
            <div className="h-100 d-flex flex-column justify-content-between">
                <ImageSlider images={[studioPhoto1, studioPhoto2, studioPhoto3, studioPhoto4]}/>
            </div>
        </section>
        <section className="container mt-5" id="details-and-reserve">
            <div className="row justify-content-space-between">
                <div className={detailsColumnSizes} style={{paddingLeft: 25}}>
                    {activeStep === 0
                        ? <InformationSection/>
                        : <FormProvider {...methods}><SummarySection/></FormProvider>
                    }

                </div>
                <div className={reservationColumnSizes}>
                    <div style={{position: "sticky", top: 0}}>
                        <form onSubmit={methods?.handleSubmit(handleSubmitReservation)}>
                            <FormProvider {...methods}>
                                <ReservationSteps activeStep={activeStep} setActiveStep={setActiveStep}
                                                  closeLastStep={closeLastStep}/>
                            </FormProvider>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default Home