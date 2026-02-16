import Button from "@mui/material/Button";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import CustomButtonGroupField from "@shared/components/custom-button-group-field";
import CustomSelectField from "@shared/components/custom-select-field";
import CustomTextField from "@shared/components/custom-text-field";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    CustomTextField,
    CustomSelectField,
    CustomButtonGroupField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export { useFieldContext };
