import { Component } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../feature/settings/components/settings/settings';

@Component({
  selector: 'app-drawer',
  imports: [
    TranslatePipe,
    Settings,
    DrawerModule
  ],
  templateUrl: './drawer.html',
})
export class Drawer {
  visible: boolean = false;

  openDrawer = () => 
    this.visible = true;
}
