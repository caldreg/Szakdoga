import { RollbackPage } from './../../modals/rollback/rollback.page';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController } from '@ionic/angular';
import { DeployPage } from '../../modals/deploy/deploy.page';
import { EditProjectPage } from '../../modals/edit-project/edit-project.page';

import * as moment from 'moment';
import { AddProjectPage } from '../../modals/add-project/add-project.page';
import { from } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  displayedColumns: string[] = ['name', 'lastStatus', 'lastDeploy', 'development', 'staging', 'production', 'actions'];
  dataSource = [];
  filteredProjects = [];

  constructor(private database: FirestoreService, private modalController: ModalController) { }

  async ngOnInit() { }

  async ngAfterViewInit() {
    const projects = await this.database.getProjectsLive();
    projects.subscribe(data => this.dataSource = data);
    projects.subscribe(data => this.filteredProjects = data);
    
  }

  async openDeployPanel(project: any): Promise<any> {
    const modal = await this.modalController.create({
      component: DeployPage,
      cssClass: 'deploy-modal',
      swipeToClose: true,
      mode: 'ios',
      componentProps: { project }
    });
    return await modal.present();
  }

  async openRollBackPanel(project: any): Promise<any> {
    const modal = await this.modalController.create({
      component: RollbackPage,
      cssClass: 'rollback-modal',
      swipeToClose: true,
      mode: 'ios',
      componentProps: { project }
    });
    return await modal.present();
  }

  async openEditProject(project: any): Promise<any> {
    const modal = await this.modalController.create({
      component: EditProjectPage,
      cssClass: 'edit-modal',
      swipeToClose: true,
      mode: 'ios',
      componentProps: { project }
    });
    return await modal.present();
  }

  getLastDeployString(timestamp: any): string {
    if (timestamp === '') {
      return '-';
    }
    return moment(timestamp, 'YYYY-MM-DD hh:mm:ss').fromNow();
  }

  async openProjectAddPanel(): Promise<any> {
    const modal = await this.modalController.create({
      component: AddProjectPage,
      cssClass: ''
    });
    return await modal.present();
  }

  filterList(event: any): void {
    if (event.target.value === 'undefined' || event.target.value === '') {
      this.filteredProjects = this.dataSource;
    } else {
      this.filteredProjects = this.dataSource.filter(pipeline => pipeline.name.toLowerCase().includes(event.target.value.toLowerCase()));
    }
  }
}
