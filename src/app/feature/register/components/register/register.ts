import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-register',
  imports: [
    DividerModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    IftaLabelModule,
    PasswordModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './register.html'
})
export class Register {
  value: string | undefined;
}
