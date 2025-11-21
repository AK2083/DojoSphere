import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TranslatePipe } from '@ngx-translate/core';
import { SupabaseService } from '@features/register/services/supabase';

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
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
})
export class Register {
  formbuilder = inject(FormBuilder);
  supabaseService = inject(SupabaseService);

  isFormLoading = false;
  formSubmitted = false;
  minPwdLength = 8;

  registerForm = this.formbuilder.group({
    mail: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(this.minPwdLength)]),
  });

  onSubmit(): void {
    this.isFormLoading = true;
    this.formSubmitted = true;

    this.supabaseService.signUpNewUser(this.mail?.value, this.pwd?.value);

    this.isFormLoading = false;
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.registerForm?.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  getPasswordRules(): { hasUpperCase: boolean; hasNumber: boolean; hasSpecialChar: boolean; hasMinLength: boolean } {
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
