import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { MenuPage } from 'src/app/modals/menu/menu.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  logs = {
    data: new Array(),
    loaded: false
  };

  constructor(private modalController: ModalController, private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.initLogs();
  }

  async openMenu() {
    const modal = await this.modalController.create({
      component: MenuPage,
      cssClass: 'menu-modal',
    });
    return await modal.present();
  }

  async initLogs(): Promise<void> {
    const data = await this.firestore.collection('Logs').get()
      .subscribe(snapshot => {
        snapshot.forEach(logDoc => {
          if (this.logs.data.length < 5) {
            this.logs.data.push(logDoc.data());
          }
        });
        this.logs.loaded = true;
      });
  }

  logout(): void {
    this.afAuth.auth.signOut().then(() => {
      console.log('Signed out!');
    });
  }

}
