import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-drawer',
  imports: [DrawerModule, NgTemplateOutlet],
  templateUrl: './drawer.html',
})
export class Drawer {
  readonly customTemplate = input<TemplateRef<unknown> | null>(null);
  readonly header = input<string>();
  
  visible = false;
  
  openDrawer = (): boolean => (this.visible = true);
}
