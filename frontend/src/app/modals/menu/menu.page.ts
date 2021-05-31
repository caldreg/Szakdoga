import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() { }

  closeMenu(): void {
    this.modalController.dismiss();
  }

  goTo(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }

}
