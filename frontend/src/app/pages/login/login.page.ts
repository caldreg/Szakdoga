import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = { email: '', password: '' };

  constructor(private fireAuth: AngularFireAuth, private router: Router, private toastController: ToastController ) { }

  ngOnInit() { }

  getEmail(event: any): void {
    this.credentials.email = event.target.value;
  }

  getPassword(event: any): void {
    this.credentials.password = event.target.value;
  }

  async login(): Promise<any> {
    this.fireAuth.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
      .then(() => this.router.navigate(['/home']))
      .catch(err => {
        this.presentToast(err.message);
      });
  }

  async presentToast(message: string): Promise<any> {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  eventHandler(keyCode){
    if (keyCode === 13) {
      this.login()
    }
  }
}
