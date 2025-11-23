import { Component, computed, viewChild } from '@angular/core';
import { Drawer } from '@core/components/drawer/drawer';
import { Menubar } from '@core/components/menubar/menubar';
import { Register } from '@features/register/components/register/register';
import { Settings } from '@features/settings/components/settings/settings';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-root',
  imports: [Drawer, Menubar, Register, Settings, PanelModule],
  templateUrl: './app.html',
})
export class App {
  private readonly settingsChild = viewChild(Settings);

  readonly childTranslationsSignal = computed(() => {
    const child = this.settingsChild();

    if (child) {
      return child.translations.settingsLabel();
    }

    return 'Loading';
  });
}
