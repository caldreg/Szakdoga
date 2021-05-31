import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {

  users: Array<any>;
  loaded: boolean = false;

  constructor(private api: ApiService, private toastController: ToastController) {
    this.users = new Array();
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.initializeData();
  }

  async initializeData(): Promise<any> {
    const data = await this.api.getFirebaseUsers();
    this.users = data.users;
    this.loaded = true;
  }

  async deleteUser(id: string): Promise<any> {
    const response = await this.api.deleteFirebaseUser(id);
    if (response.status) {
      this.loaded = false;
      this.initializeData();
    } else {
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Failed to delete user!',
      duration: 2000
    });
    toast.present();
  }

}
