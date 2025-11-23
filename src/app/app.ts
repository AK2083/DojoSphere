import { Component, inject } from '@angular/core';
import { Drawer } from '@core/components/drawer/drawer';
import { Menubar } from '@core/components/menubar/menubar';
import { Translation } from '@core/service/translation/Translation';
import { Register } from '@features/register/components/register/register';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-root',
  imports: [Drawer, Menubar, Register, PanelModule],
  templateUrl: './app.html',
})
export class App {
  private readonly translation = inject(Translation);
  translations = this.translation.getTranslations();
}
