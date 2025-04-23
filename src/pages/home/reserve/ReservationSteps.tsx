import * as React from 'react'
import {Dispatch, SetStateAction, useEffect, useMemo} from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import {styled} from '@mui/material/styles'
import {StepConnector, stepConnectorClasses, StepIconProps, Tooltip} from "@mui/material"
import DateHourPicker from "./DateHourPicker/DateHourPicker.tsx"
import {useFormContext} from "react-hook-form"
import {IReservationFormValues} from "./reservation.consants.ts"
import LightsReservation from "./lightsReservation/LightsReservation.tsx";
import ContactForm from "./contactForm/ContactForm.tsx";
import Rules from "./Rules.tsx";
import RuleIcon from '@mui/icons-material/Rule';
import CheckboxRHF from "../../../components/shared-components/form/CheckBoxRHF.tsx";
import dayjs from "dayjs";
import {getBlockedDatesAndHours} from "../../admin-pages/blockAvailability/block-availability.utils.ts";

const ColorlibStepIconRoot = styled('div')<{ ownerState: { completed?: boolean, active?: boolean } }>(({theme}) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 30,
    height: 30,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700],
    }),
    variants: [
        {
            props: ({ownerState}) => ownerState.active,
            style: {
                backgroundImage: 'linear-gradient(90deg, rgba(0,36,71,1) 0%, rgba(0,36,71,1) 100%)',
                boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
            },
        },
        {
            props: ({ownerState}) => ownerState.completed,
            style: {
                backgroundImage: 'linear-gradient(90deg, rgba(0,36,71,1) 0%, rgba(0,36,71,1) 100%)',
            },
        },
    ],
}))

const ColorlibConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient(90deg, rgba(0,36,71,1) 0%, rgba(0,36,71,1) 100%)',
            width: 2,
            marginLeft: 2,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient(90deg, rgba(0,36,71,1) 0%, rgba(0,36,71,1) 100%)',
            width: 2,
            marginLeft: 2,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        marginLeft: 2,
        width: 2,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            backgroundColor: "lightGray",
        }),
    },
}))

interface IReservationStepsProps {
    activeStep: number,
    setActiveStep: Dispatch<SetStateAction<number>>
    closeLastStep?: boolean
}

const ReservationSteps: React.FC<IReservationStepsProps> = ({activeStep, setActiveStep, closeLastStep = false}) => {
    const methods = useFormContext<IReservationFormValues>()

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    // If we pass closeLastStep as true from the parent component, it changes to the next step,
    // we need it only one time in the end when we click submit
    useEffect(() => {
        closeLastStep && setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }, [closeLastStep])


    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
        methods?.reset({
            date: "",
            currentMonth: dayjs().format("YYYY-MM"),
            idPhoto: ''
        })
        // Refetch the data so the user will have the updated values if he resets the form.
        getBlockedDatesAndHours(methods?.watch("currentMonth"), false).then(value => {
            methods?.setValue('blockedHoursAndDays', value)
        })
    }

    const ColorlibStepIcon = (props: StepIconProps) => {
        const {active, completed, className} = props

        const icons: { [index: string]: React.ReactElement } = {
            1: <CalendarMonthOutlinedIcon fontSize={"small"} />,
            2: <LightbulbOutlinedIcon fontSize={"small"}/>,
            3: <RuleIcon fontSize={"small"}/>,
            4: <FeedOutlinedIcon fontSize={"small"}/>,
        }

        return (
            <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        )
    }

    // We need the Date and the time range to continue to the next step
    const isDateAndHoursContinueButtonDisabled = useMemo(() =>
            !methods?.watch("date") || !methods?.watch("startingHour") || !methods?.watch("endingHour")
        , [methods?.watch("date"), methods?.watch("startingHour"), methods?.watch("endingHour")])

    return (
        <Box>
            <div className="d-flex justify-content-center">
                <Typography fontSize={30} fontWeight={300}>Reserve</Typography>
            </div>
            <Stepper activeStep={activeStep} orientation="vertical" connector={<ColorlibConnector/>}>
                {/* Select date and hours step */}
                <Step key="1">
                    <StepLabel slots={{stepIcon: ColorlibStepIcon}}>
                        {activeStep === 0
                            ? "Select date and hours"
                            : `${!!methods?.watch("date") ? dayjs(methods?.watch("date")).format("DD/MM/YYYY") : ""} - From ${methods?.watch("startingHour")} To ${methods?.watch("endingHour")}`
                        }
                    </StepLabel>
                    <StepContent
                        sx={{marginLeft: "14px", borderLeft: "1.8px solid #eaeaf0", alignContent: "middle"}}>
                        <div className="d-flex justify-content-center mb-2">
                            <Typography fontSize={20} fontWeight="bold">10&#8364;</Typography>
                            <Typography fontSize={12} sx={{display: "flex", alignItems: "end"}}>
                                /Hour
                            </Typography>
                        </div>
                        <div className="d-flex justify-content-center mb-1">
                            <Typography fontSize={12} sx={{display: "flex", alignItems: "end"}}>
                                2 h minimum
                            </Typography>
                        </div>

                        <DateHourPicker/>

                        <Box sx={{mb: 2}}>
                            <Tooltip title={
                                (!methods?.watch("date") || !methods?.watch("startingHour") || !methods?.watch("endingHour"))
                                    ? "Select date and the hours to continue" : ""
                            }>
                                    <span>
                                        <button className="button-30" type="button" onClick={handleNext}
                                                style={{marginTop: 10}}
                                                disabled={isDateAndHoursContinueButtonDisabled}
                                        >
                                            Continue
                                        </button>
                                    </span>
                            </Tooltip>
                        </Box>
                    </StepContent>
                </Step>

                {/*Select lights rental step*/}
                <Step key="2">
                    <StepLabel slots={{stepIcon: ColorlibStepIcon}}>
                        Select lights rental
                    </StepLabel>
                    <StepContent sx={{marginLeft: "14px", borderLeft: "1.8px solid #eaeaf0"}}>
                        <LightsReservation/>
                        <Box sx={{mb: 2}}>
                            <button className="button-30" type="button" onClick={handleNext}
                                    style={{marginTop: 20, marginRight: 10}}>
                                Continue
                            </button>
                            <Button onClick={handleBack} sx={{mt: 1, mr: 1}}>
                                Back
                            </Button>
                        </Box>
                    </StepContent>
                </Step>

                {/* Rules */}
                <Step key="3">
                    <StepLabel slots={{stepIcon: ColorlibStepIcon}}>
                        Rules
                    </StepLabel>
                    <StepContent sx={{marginLeft: "14px", borderLeft: "1.8px solid #eaeaf0"}}>
                        <Rules/>
                        <CheckboxRHF
                            label="I have read and accept the Terms and Conditions of Visual Minds, as well as the rules and cancellation policy of the venue"
                            controllerProps={{
                                control: methods?.control,
                                name: "isConditionsAccepted",
                            }}
                            sx={{
                                marginTop: "10px"
                            }}
                        />

                        <Box sx={{mb: 2}}>
                            <button className="button-30" type="button" onClick={handleNext}
                                    style={{marginTop: 20, marginRight: 10}}
                                    disabled={!methods?.watch('isConditionsAccepted')}
                            >
                                Accept & continue
                            </button>
                            <Button onClick={handleBack} sx={{mt: 1, mr: 1}}>
                                Back
                            </Button>
                        </Box>
                    </StepContent>
                </Step>

                {/* Contact Form Submit request Step */}
                <Step key="4">
                    <StepLabel
                        slots={{stepIcon: ColorlibStepIcon}}
                        optional={<Typography variant="caption">Last step</Typography>}
                    >
                        Submit request
                    </StepLabel>
                    <StepContent sx={{marginLeft: "14px", borderLeft: "1.8px solid #eaeaf0"}}>
                        <ContactForm/>
                        <Box sx={{mb: 2}}>
                            <button className="button-30" type="submit" style={{marginTop: 20, marginRight: 10}}>
                                Book Now!
                            </button>
                            <Button onClick={handleBack} sx={{mt: 1, mr: 1}}>
                                Back
                            </Button>
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>
            {activeStep === 4 && (
                <Paper square elevation={0} sx={{p: 3}}>
                    <Typography>Booking request sent</Typography>
                    <Button onClick={handleReset} sx={{mt: 1, mr: 1}}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    )
}

export default ReservationSteps