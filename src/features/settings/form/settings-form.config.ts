import Button from "@mui/material/Button";
import { createFormHook } from "@tanstack/react-form";

import CustomButtonGroupField from "@shared/components/custom-button-group-field";
import CustomSelectField from "@shared/components/custom-select-field";
import { fieldContext, formContext } from "@shared/lib/form-context";

const { useAppForm } = createFormHook({
  fieldComponents: {
    CustomSelectField,
    CustomButtonGroupField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export const useSettingsForm = useAppForm;
