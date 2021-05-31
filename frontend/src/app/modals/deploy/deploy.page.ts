import { newArray } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.page.html',
  styleUrls: ['./deploy.page.scss'],
})
export class DeployPage implements OnInit {

  state: string = 'Development';
  versionStaging: string = '';
  versionProduction: string = '';
  branches: any;
  tags = new Array();
  contains: boolean = true;

  @Input() project: any;

  constructor(private api: ApiService, private alertController: AlertController, private modalController: ModalController) { }

  async ngOnInit() { }

   async ngAfterViewInit() {
    this.tags = await this.getTags();
  }

  async getTags() {
    const response = await this.api.getTags(this.project.key.toLowerCase( ), this.project.repository.split(/['/', '.']/)[7]);

    let tags = new Array();

    response.forEach(element => {
      tags.push(element.displayId);
    });

    return tags;
  }
   
  async getBranches() {
    const branches = await this.api.getBranches(this.project.key.toLowerCase( ), this.project.repository.split(/['/', '.']/)[7]);

    let branchesId = new Array();

    branches.forEach(element => {
      branchesId.push(element.displayId);
    });
    return branchesId;
  }

  async startDevelopment(): Promise<any> {
    await this.api.startDeployment(this.project, 'Development');
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Development',
      subHeader: this.project.name,
      message: 'The deployment started!',
      buttons: ['OK'],
      mode: 'md'
    });
    alert.onDidDismiss().then(() => this.modalController.dismiss());
    await alert.present();
  }

  async startStagingDeploy(): Promise<any> {
    await this.api.startDeploymentStaging(this.project, 'Staging', this.versionStaging);
    const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Staging',
        subHeader: this.project.name,
        message: 'The deployment started!',
        buttons: ['OK'],
        mode: 'md'
      });
      alert.onDidDismiss().then(() => this.modalController.dismiss());
      await alert.present();
    }

  async startProductionDeploy(): Promise<any> {
    console.log(this.versionProduction)
    await this.api.startDeploymentStaging(this.project, 'Production', this.versionProduction);
    const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Production',
        subHeader: this.project.name,
        message: 'The deployment started!',
        buttons: ['OK'],
        mode: 'md'
      });
      alert.onDidDismiss().then(() => this.modalController.dismiss());
      await alert.present();
    }

  async onChangeTime(event){
    if (this.tags.includes(event)) {
      this.contains = true;
    } 
    else {
      this.contains = false;
    }

  }
}
