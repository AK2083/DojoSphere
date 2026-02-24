import Button from "@mui/material/Button";
import { createFormHook } from "@tanstack/react-form";

import CustomTextField from "@shared/components/custom-text-field";
import { fieldContext, formContext } from "@shared/lib/form-context";

const { useAppForm } = createFormHook({
  fieldComponents: {
    CustomTextField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export const useRegistrationForm = useAppForm;
