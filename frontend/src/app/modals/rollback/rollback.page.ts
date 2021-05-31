import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rollback',
  templateUrl: './rollback.page.html',
  styleUrls: ['./rollback.page.scss'],
})
export class RollbackPage implements OnInit {

  state: string = 'Staging';
  tag: string = '';
  tags: any;
  mode: string = 'Staging';

  @Input() project: any;

  constructor(private api: ApiService, private alertController: AlertController, private modalController: ModalController) { }

  async ngOnInit() {
    this.tags = await this.getTags();
  }

  async segmentChange(event: string) {
    this.tag = '';
    this.mode = event;
  }

  async getTags() {
    const response = await this.api.getTags(this.project.key.toLowerCase( ), this.project.repository.split(/['/', '.']/)[7]);

    let tags = new Array();

    response.forEach(element => {
      tags.push(element.displayId);
    });

    return tags;
  }

  async startRollback(): Promise<any> {
    const rollback = true;
    await this.api.startRollback(this.project, this.mode, this.tag, rollback);
    const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Production',
        subHeader: this.project.name,
        message: 'The rollback started!',
        buttons: ['OK'],
        mode: 'md'
      });
      alert.onDidDismiss().then(() => this.modalController.dismiss());
      await alert.present();
    }


}
