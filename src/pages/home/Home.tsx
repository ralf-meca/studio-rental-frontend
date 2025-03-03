import * as React from 'react'
import {useMemo, useState} from 'react'
// import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./../../index.css"
import studioPhoto1 from "./../../assets/brand/studio-photo.jpeg"
import studioPhoto2 from "./../../assets/brand/studio1.jpg"
import studioPhoto3 from "./../../assets/brand/studio2.jpg"
import studioPhoto4 from "./../../assets/brand/studio3.jpg"
import {ImageSlider} from "./imageSlider/ImageSlider.tsx";
import ReservationSteps from "./reserve/ReservationSteps.tsx";
import InformationSection from "./InformationSection.tsx";
import SummarySection from "./SummarySection.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {IReservationFormValues} from "./reserve/reservation.consants.ts";

const Home: React.FC = () => {
    // const navigate = useNavigate()
    const methods = useForm<IReservationFormValues>({defaultValues: {date: ""}})

    const [response, setResponse] = useState('');
    const [activeStep, setActiveStep] = React.useState<number>(0)

    const detailsColumnSizes = useMemo(() => activeStep === 0 ? "col-sm-12 col-md-8 col-lg-8 col-xl-8" : "col-sm-12 col-md-12 col-lg-5 col-xl-5"
        , [activeStep])
    const reservationColumnSizes = useMemo(() => activeStep === 0 ? "col-sm-12 col-md-4 col-lg-4 col-xl-4" : "col-sm-12 col-md-12 col-lg-7 col-xl-7"
        , [activeStep])

    const docWidth = document.documentElement.offsetWidth;

    [].forEach.call(
        document.querySelectorAll('*'),
        function(el: any) {
            if (el.offsetWidth > docWidth) {
                console.log(el);
            }
        }
    );

    const handleButtonClick = async () => {
        try {
            // Call the API endpoint
            const res = await axios.get('/api/availability');
            console.log('res', res)
            setResponse(res.data)
        } catch (error: any) {
            setResponse('Error: ' + error.message);
        }
    };


    return <>
        <section id="hero">
            <div className="h-100 d-flex flex-column justify-content-between">
                <ImageSlider images={[studioPhoto1, studioPhoto2, studioPhoto3, studioPhoto4]}/>
                {/*<div className="col-12 d-flex justify-content-center" style={{marginTop: "30vh"}}>*/}
                {/*    <Button onClick={() => navigate('#reserve')} className="button-30"*/}
                {/*            size={"large"}*/}
                {/*    > REZERVO TANI!*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
        </section>
        <section id="details-and-reserve">
            <div className="row justify-content-space-between">
                <div className={detailsColumnSizes} style={{paddingLeft: 25}}>
                    {activeStep === 0
                        ? <InformationSection/>
                        : <FormProvider {...methods}><SummarySection/></FormProvider>
                    }

                </div>
                <div className={reservationColumnSizes}>
                    <div style={{position: "sticky", top: 0}}>
                        <FormProvider {...methods}>
                            <ReservationSteps activeStep={activeStep} setActiveStep={setActiveStep}/>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </section>
        <button onClick={handleButtonClick}>Get Availability</button>
        <div>{response}</div>
    </>
}

export default Home