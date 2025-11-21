import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  templateUrl: './register.html'
})
export class Register {
  registerForm: FormGroup;
  isFormLoading = false;
  formSubmitted: boolean = false;
  minPwdLength = 8;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      mail: new FormControl('', [
        Validators.required, 
        Validators.email]),
      pwd: new FormControl('', [
        Validators.required, 
        Validators.minLength(this.minPwdLength)])
    });
  }

  onSubmit() {
    this.isFormLoading = true;
    this.formSubmitted = true;
    this.isFormLoading = false;
  }

  isInvalid(controlName: string) {
    const control = this.registerForm?.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  getPasswordRules() {
    const pwd: string = this.pwd?.value ?? '';
  
    return {
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[^A-Za-z0-9]/.test(pwd),
      hasMinLength: pwd.length >= this.minPwdLength
    };
  }

  get mail() {
    return this.registerForm.get('mail');
  }

  get pwd() {
    return this.registerForm.get('pwd');
  }
}
