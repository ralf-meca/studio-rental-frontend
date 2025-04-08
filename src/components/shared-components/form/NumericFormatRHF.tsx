import * as React from 'react'
import {useState} from 'react'
import {Controller, UseControllerProps} from "react-hook-form";
import {TextField, useTheme} from "@mui/material";
import {NumericFormat} from "react-number-format";
import {TextFieldProps} from "@mui/material/TextField/TextField";

interface INumberFormatRHFProps {
    controllerProps: UseControllerProps<any>
    disabled?: boolean
    allowNegative?: boolean
    addEuroSymbol?: boolean
    isPercentageInput?: boolean
    label?: string
    prefix?: string
    decimalScale?: number
    decimalSeparator?: string
    thousandSeparator?: string
    showMandatorySymbolWhenDisabled?: boolean
}

export const NumericFormatRHF: React.FC<INumberFormatRHFProps> = ({
                                                                      controllerProps,
                                                                      disabled = false,
                                                                      allowNegative = false,
                                                                      addEuroSymbol = false,
                                                                      isPercentageInput = false,
                                                                      label = '',
                                                                      decimalScale = 2,
                                                                      decimalSeparator = ',',
                                                                      thousandSeparator = '.',
                                                                      showMandatorySymbolWhenDisabled = false
                                                                  }) => {

    const theme = useTheme()
    const [isFixedDecimalScale, setIsFixedDecimalScale] = useState(true)

    return <Controller
        {...controllerProps}
        render={({field, fieldState}) => <>
            <NumericFormat
                isAllowed={(values) => isPercentageInput && values?.floatValue ? values?.floatValue <= 100 : true}
                allowNegative={allowNegative} // Allow negative values
                disabled={disabled}
                fullWidth
                decimalSeparator={decimalSeparator}
                thousandSeparator={thousandSeparator}
                decimalScale={decimalScale}
                fixedDecimalScale={isFixedDecimalScale}
                customInput={(props: TextFieldProps) => <TextField
                    label={label ? <>
                        {label}
                        <span style={{color: theme.palette.error.main, fontSize: 22}}>
                                {(controllerProps as any)?.rules?.required?.value && (!disabled || showMandatorySymbolWhenDisabled) ? ' *' : ''}
                        </span>
                    </> : undefined}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoFocus={!isFixedDecimalScale}
                    {...props}
                    onFocus={e => {
                        props?.onFocus && props?.onFocus(e)
                        setIsFixedDecimalScale(false)
                    }}
                    onBlur={() => setIsFixedDecimalScale(true)}
                    sx={{input: {textAlign: 'right'}}}
                    slotProps={{
                        input: {
                            endAdornment: addEuroSymbol ? ' €' : isPercentageInput ? '%' : ''
                        }
                    }}
                />}
                value={field?.value ?? ''}
                onValueChange={(value) => {
                    field?.onChange(value?.floatValue ?? '')
                }}
            />
        </>
        }
    />
}