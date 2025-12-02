import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menubar',
  imports: [RouterLink, MenubarModule, ButtonModule],
  templateUrl: './menubar.html',
})
export class Menubar {
  readonly open = output();
  visible = false;

  openDrawer = (): void => this.open.emit();
}
