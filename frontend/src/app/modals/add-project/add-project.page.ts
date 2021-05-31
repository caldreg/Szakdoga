import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { element } from 'protractor';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.page.html',
  styleUrls: ['./add-project.page.scss'],
})
export class AddProjectPage implements OnInit {

  panel: string = 'web';
  emptyStages = false;
  stageEmpty: boolean = true;

  project = {
    name: '',
    description: '',
    repository: '',
    key: '',
    status: '',
    lastDeploy: '',
    stages: []
  };

  constructor(
    public modalCtrl: ModalController,
    private api: ApiService,
    private alertController: AlertController,
    private modalController: ModalController) { }

  ngOnInit() { }

  removeLast(): void {
    this.project.stages = this.project.stages.splice(0, this.project.stages.length - 1);
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

  get isEmpty() {
    const urlRegex = /https:\/\/stash.sed.hu\/scm\/\w+\/.+.git/;
    return this.project.name && this.project.description && this.project.key && this.project.repository.match(urlRegex);
  }

  get isStageEmpty() {
    this.stageEmpty = true;
    if(this.project.stages.length !== 0) {
      this.stageEmpty = false;
    }
    const urlRegex = /https:\/\/stash.sed.hu\/scm\/\w+\/.+.git/;
    return this.project.name && this.project.description && this.project.key && this.project.repository.match(urlRegex), !this.stageEmpty;
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
      header: 'Generate project',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
        }, {
          text: 'Create',
          handler: async  () => {
            this.project.key = this.project.key.toUpperCase();
            await this.api.generateProject(this.project);
            this.modalController.dismiss();
          
          }
        }
      ]
    });
    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
