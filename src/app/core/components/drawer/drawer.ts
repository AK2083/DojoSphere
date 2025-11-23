import { Component, input } from '@angular/core';
import { Settings } from '@features/settings/components/settings/settings';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-drawer',
  imports: [Settings, DrawerModule],
  templateUrl: './drawer.html',
})
export class Drawer {
  readonly settingsLabel = input<string>();
  visible = false;
  
  openDrawer = (): boolean => (this.visible = true);
}
