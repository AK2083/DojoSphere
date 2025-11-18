import { Component } from '@angular/core';
import { Drawer } from './core/components/drawer/drawer';
import { Menubar } from './core/components/menubar/menubar';

@Component({
  selector: 'app-root',
  imports: [
    Drawer,
    Menubar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
