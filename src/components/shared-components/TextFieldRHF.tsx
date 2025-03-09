import {InputBaseProps, TextField} from '@mui/material'
import * as React from 'react'
import {Controller, UseControllerProps} from 'react-hook-form'


interface ITextFieldRHFProps extends InputBaseProps {
    label?: string
    placeHolder?: string
    fieldProps?: any
    controllerProps: UseControllerProps<any>
    className?: string
}

const TextFieldRHF: React.FC<ITextFieldRHFProps> = (props) => {

    const {label = '', fieldProps, controllerProps, disabled = false, className = ''} = props

    return <div className={className}>
        <Controller
            {...controllerProps}
            render={({field, fieldState}) => {

                return <TextField
                    size='small'
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    type={'text'}
                    disabled={disabled}
                    sx={{ height: "50px", "& .MuiInputBase-root": { height: "60px" } }}
                    // We add * at the label if mandatory
                    label={label ? <>
                        {label}
                        <span style={{color: 'red', fontSize: 22}}>
                            {((controllerProps as any)?.rules?.required?.value
                                || (controllerProps as any)?.rules?.validate) && ' *'}
                        </span>
                    </> : undefined}
                    {...fieldProps}
                    {...field}
                />
            }}
        />
    </div>
}

export default TextFieldRHF