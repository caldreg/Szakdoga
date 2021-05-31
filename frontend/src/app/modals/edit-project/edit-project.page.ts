import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage implements OnInit {

  @Input() project: any;
  length: number;
  emptyStages = false;
  stageEmpty: boolean = true;
  originalStages;
  constructor(public modalCtrl: ModalController, private api: ApiService, private alertController: AlertController) { }

  ngOnInit() {
    this.length = this.project.stages.length;
    this.originalStages = [...this.project.stages];
  }

  get isEmpty() {
    const urlRegex = /https:\/\/stash.sed.hu\/scm\/\w+\/.+.git/;
    return this.project.name && this.project.description && this.project.key && this.project.repository.match(urlRegex);
  }

  get isStageEmpty() {
    this.stageEmpty = true;
    if(this.project.stages.length !== this.length) {
      this.stageEmpty = false;
    }
    const urlRegex = /https:\/\/stash.sed.hu\/scm\/\w+\/.+.git/;
    return this.project.name && this.project.description && this.project.key && this.project.repository.match(urlRegex), !this.stageEmpty;
  }

  removeLast(): void {
    if (this.project.stages.length === this.length ){
      console.log('nah')
    }else {
      this.project.stages = this.project.stages.splice(0, this.project.stages.length -1);
    }
  }

  addStage(): void {
    this.emptyStages = true;
    this.project.stages.push({
      name: '',
      site: '',
      alias: '',
      branch: '',
      version: '',
      folders: '',
    });
  }

  dismiss() {
    this.project.stages = this.originalStages;
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  checkStages() {
    this.project.stages.forEach(element => {
      this.emptyStages = true;
      if (element.name && element.site && element.alias && element.branch && element.folders) {
        this.emptyStages = false;
      }
    });
  }

  async generate(): Promise<any> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Recreate project',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
        }, {
          text: 'Recreate',
          handler: async  () => {
            this.project.key = this.project.key.toUpperCase();
            await this.api.recreateProject(this.project);
            this.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}
