import {
    CircularProgress,
    FormControl,
    FormControlProps,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material'
import * as React from 'react'
import {Controller, UseControllerProps} from 'react-hook-form'
import {ILabelValueOption} from "../../shared/types.ts";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useEffect} from "react";

interface ISelectRHFProps {
    label?: string
    options: ILabelValueOption<string | number>[]
    formControlProps?: FormControlProps
    disabled?: boolean
    showSpinner?: boolean
    includeEmptyOption?: boolean
    controllerProps: UseControllerProps<any>
    isTimeSelect?: boolean
    disabledOptions?: ILabelValueOption[]
    isAdmin?: boolean
}

/**
 * @description Generic Component SELECT that uses React Hook Form.
 * @param props
 * @constructor
 * @rete-vendita
 */
const SelectRHF: React.FC<ISelectRHFProps> = (props) => {
    // Props
    const {
        disabled = false,
        showSpinner = false,
        includeEmptyOption = false,
        formControlProps,
        label,
        options,
        controllerProps,
        isTimeSelect = false,
        disabledOptions,
        isAdmin= false
    } = props

    useEffect(() => {
        console.log('disabledOptions', disabledOptions)
        console.log('options', options)
    }, [disabledOptions])


    return (
        <Controller
            {...controllerProps}
            render={({field, fieldState}) => (
                <FormControl fullWidth variant="outlined" {...formControlProps}>
                    {!!label &&
                        <InputLabel id={`${controllerProps?.name}_input_id`} style={{background: "white"}}>
                            <span style={{padding: '0 5px'}}>
                                {label}
                                <span style={{color: 'red', fontSize: 22}}>
                                    {/*@ts-expect-error adapt */}
                                    {controllerProps?.rules?.required?.value && !disabled ? ' *' : ''}
                                </span>
                            </span>
                        </InputLabel>
                    }
                    <Select id={`${controllerProps?.name}_select_id`}
                            disabled={disabled || showSpinner}
                            error={!!fieldState.error}
                            startAdornment={showSpinner ?
                                <div><CircularProgress sx={{marginTop: 1, marginRight: 1}} color="inherit" size={18}/>
                                </div> : isTimeSelect ? <AccessTimeIcon fontSize={"small"}/> : undefined}
                            {...field}
                            value={field?.value || ''}
                            MenuProps={{
                                disableScrollLock: true, // Handles a bug that adds padding to the page's'body
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Set max height for the dropdown
                                        overflowY: 'auto', // Enable scrolling
                                    },
                                },
                            }}
                            onChange={(e: any) => {
                                field?.onChange && field?.onChange(e)
                            }}
                    >
                        {includeEmptyOption &&
                            <MenuItem style={{height: 34}} key="empty_option" value={""}/>}
                        {Array.isArray(options) && !!options?.length ? (
                            options?.map((option, index) => (
                                <MenuItem
                                    key={`${controllerProps?.name}_${index}`}
                                    value={option?.value}
                                    style={{
                                        width: "100%",
                                        textDecoration: !!disabledOptions?.filter(el => el?.value === option.value).length ? "line-through" : "none",
                                        background: !!disabledOptions?.filter(el => el?.value === option.value).length && isAdmin ? "rgba(253,92,99,0.13)" : undefined,
                                    }}
                                    disabled={!isAdmin && !!disabledOptions?.filter(el => el?.value === option.value).length}
                                >
                                    {option?.label}
                                </MenuItem>
                            ))
                        ) : (
                            <Typography className="p-2" variant="caption">
                                {"No available hours found for this date"}
                            </Typography>
                        )}
                    </Select>

                    {fieldState?.error && <FormHelperText error>{fieldState?.error?.message}</FormHelperText>}
                </FormControl>
            )}
        />
    )
}

export default SelectRHF