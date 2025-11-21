import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menubar',
  imports: [MenubarModule, ButtonModule],
  templateUrl: './menubar.html',
})
export class Menubar {
  visible = false;
  readonly open = output();

  openDrawer = (): void => this.open.emit();
}
