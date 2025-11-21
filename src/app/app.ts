import { Component } from '@angular/core';
import { Drawer } from '@core/components/drawer/drawer';
import { Menubar } from '@core/components/menubar/menubar';
import { Register } from '@features/register/components/register/register';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-root',
  imports: [Drawer, Menubar, Register, PanelModule],
  templateUrl: './app.html',
})
export class App {}
