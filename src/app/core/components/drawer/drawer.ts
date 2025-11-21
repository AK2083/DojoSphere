import { Component } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '@features/settings/components/settings/settings';

@Component({
  selector: 'app-drawer',
  imports: [TranslatePipe, Settings, DrawerModule],
  templateUrl: './drawer.html',
})
export class Drawer {
  visible = false;
  openDrawer = (): boolean => (this.visible = true);
}
