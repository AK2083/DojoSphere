import TextField, { type TextFieldProps } from "@mui/material/TextField";

import { useFieldContext } from "@shared/lib/form-context";

type CustomTextFieldProps = TextFieldProps & {
  errorMessages?: Record<string, string>;
};

export default function CustomTextField({ errorMessages, ...props }: CustomTextFieldProps) {
  const field = useFieldContext<string>();
  const errorCode = field.state.meta.errors[0];
  const translatedError = errorCode && errorMessages ? errorMessages[errorCode] : undefined;
  const hasError = field.state.meta.isTouched && !!translatedError;

  return (
    <TextField
      {...props}
      name={field.name}
      error={field.state.meta.errors.length > 0}
      helperText={hasError ? translatedError : " "}
      size="small"
      slotProps={{
        formHelperText: {
          sx: { minHeight: 10 },
        },
      }}
      sx={{ pb: 2 }}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    />
  );
}
