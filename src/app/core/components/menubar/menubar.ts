import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-menubar',
  imports: [MenubarModule, ButtonModule],
  templateUrl: './menubar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menubar {
  visible = false;
  readonly open = output();

  openDrawer = (): void => this.open.emit();
}
