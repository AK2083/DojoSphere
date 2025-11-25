import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupabaseManager } from '@features/register/services/supabasemanager/supabase-manager';
import { TranslationManager } from '@features/register/services/translation/translation-manager';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    DividerModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    IftaLabelModule,
    PasswordModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
})
export class Register {
  private readonly formbuilder = inject(FormBuilder);
  private readonly supabaseManager = inject(SupabaseManager);
  private readonly translation = inject(TranslationManager);

  isFormLoading = false;
  formSubmitted = false;
  minPwdLength = 8;

  translations = this.translation.getTranslations(this.minPwdLength);

  registerForm = this.formbuilder.group({
    mail: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(this.minPwdLength)]),
  });

  onSubmit(): void {
    this.isFormLoading = true;
    this.formSubmitted = true;

    this.supabaseManager.signUpNewUser(this.mail?.value, this.pwd?.value);

    this.isFormLoading = false;
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.registerForm?.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  getPasswordRules(): {
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasMinLength: boolean;
  } {
    const pwd: string = this.pwd?.value ?? '';

    return {
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[^A-Za-z0-9]/.test(pwd),
      hasMinLength: pwd.length >= this.minPwdLength,
    };
  }

  get mail(): AbstractControl | null {
    return this.registerForm.get('mail');
  }

  get pwd(): AbstractControl | null {
    return this.registerForm.get('pwd');
  }
}
