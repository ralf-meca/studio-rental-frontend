import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormControlProps, FormHelperText} from '@mui/material'
import * as React from 'react'
import {Controller, UseControllerProps} from 'react-hook-form'
import {OverridableStringUnion} from '@mui/types'
import {CheckboxPropsSizeOverrides} from '@mui/material/Checkbox/Checkbox'

interface ICheckboxRHFProps extends CheckboxProps {
    label: string
    placeHolder?: string
    formControlProps?: FormControlProps
    controllerProps: UseControllerProps<any>
    size?: OverridableStringUnion<'small' | 'medium', CheckboxPropsSizeOverrides>
}

const CheckboxRHF: React.FC<ICheckboxRHFProps> = (props) => {
    const {controllerProps, formControlProps, label, disabled, size = 'medium'} = props

    return (
        <Controller {...controllerProps}
                    render={({field, fieldState}) => (
                        <FormControl error={!!fieldState.error} {...formControlProps} sx={{width: 'fit-content'}}>
                            <FormControlLabel
                                label={<>
                                    <span style={{fontSize: 16}}>{label}</span>
                                    <span style={{color: 'red', fontSize: 22}}>
                                        {/*@ts-ignore*/}
                                        {controllerProps?.rules?.required?.value && !disabled ? ' *' : ''}
                                    </span>
                                </>}
                                control={<Checkbox size={size} checked={field?.value || false}
                                                   color="secondary" {...field}
                                                   disabled={disabled}/>}
                            />
                            {fieldState?.error?.message &&
                                <FormHelperText>{fieldState?.error?.message}</FormHelperText>}
                        </FormControl>
                    )}
        />
    )
}

export default CheckboxRHF