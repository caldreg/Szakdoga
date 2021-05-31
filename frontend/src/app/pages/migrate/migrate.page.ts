import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Animation, AnimationController, IonButton, IonSelect } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-migrate',
  templateUrl: './migrate.page.html',
  styleUrls: ['./migrate.page.scss'],
})
export class MigratePage implements OnInit {

  @ViewChild('fromStageSelector', { static: false }) fromStageSelector: IonSelect;
  @ViewChild('startButton', { static: true }) startButton: IonButton;
  @ViewChild('startUserButton', { static: true }) startUserButton: IonButton;
  @ViewChild('toStageSelector', { static: false }) toStageSelector: IonSelect;
  @ViewChild('fromUserStageSelector', { static: false }) fromUserStageSelector: IonSelect;
  @ViewChild('toUserStageSelector', { static: false }) toUserStageSelector: IonSelect;
  @ViewChild('fromIndexStageSelector', { static: false }) fromIndexStageSelector: IonSelect;
  @ViewChild('toIndexStageSelector', { static: false }) toIndexStageSelector: IonSelect;
  @ViewChild('startIndexButton', { static: true }) startIndexButton: IonButton;

  mode: string;
  startDisabled: boolean = false;
  startUserDisabled: boolean = false;
  startIndexDisabled: boolean = false;

  ionViewWillEnter() {
    this.mode = 'collections';
  }

  modeChanged(event: any): void {
    const mode = event.detail.value;
    switch (mode) {
      case 'collections':
        this.mode = mode;
        this.userRequest.users = [];
        break;
      case 'users':
        this.mode = mode;
        this.collectionRequest.collections = [];
        break;
      case 'indexes':
        this.mode = mode;
        break;
    }
  }

  allSelected = false;
  collectionRequest = {
    from: '',
    to: '',
    fromStage: 'development',
    toStage: '',
    collections: []
  };

  projects: Array<any> = [];

  buttonDisabled: boolean = true;
  collectionsExpanded: boolean = false;
  usersExpanded: boolean = false;
  indexesExpanded: boolean = false;


  migrating: boolean = false;
  usermigrating: boolean = false;
  indexmigrating: boolean = false;


  constructor(
    private api: ApiService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController
  ) { }

  async ngOnInit() {
    this.startDisabled = true;
    window.addEventListener('click', (event) => {
      if (this.collectionRequest.collections.filter(c => c.checked === true).length > 0) {
        this.startDisabled = false;
      } else {
        this.startDisabled = true;
      }
      if (this.userRequest.users.filter(user => user.checked === true).length > 0) {
        this.startUserDisabled = false;
      } else {
        this.startUserDisabled = true;
      }
      if (this.indexRequest.indexes.filter(index => index.checked === true).length > 0) {
        this.startIndexDisabled = false;
      } else {
        this.startIndexDisabled = true;
      }
    });
    this.getProjects();
  }

  async getProjects(): Promise<void> {
    this.projects = await this.api.getProjects();
  }

  async getCollections(): Promise<void> {
    if (this.collectionRequest.fromStage == undefined) {
      this.collectionRequest.collections = [];
      return;
    };
    const strings = await this.api.getProjectCollections(this.collectionRequest.from + '-' + this.collectionRequest.fromStage.toLocaleLowerCase());
    this.collectionRequest.collections = [];
    strings.forEach(string => {
      this.collectionRequest.collections.push({ name: string, checked: false });
    });
  }

  getFromStages(): Array<any> {
    if (this.collectionRequest.from === '') return [];
    return this.projects.filter(p => p.name === this.collectionRequest.from)[0].stages;
  }

  getToStages(): Array<any> {
    if (this.collectionRequest.to === '') return [];
    return this.projects.filter(p => p.name === this.collectionRequest.to)[0].stages;
  }



  async getFromProject(event: any): Promise<void> {
    this.collectionRequest.fromStage = '';
    this.fromStageSelector.value = undefined;
    this.collectionRequest.from = event.target.value;
    await this.getCollections();
  }

  getToProject(event: any): void {
    this.collectionRequest.toStage = '';
    this.toStageSelector.value = undefined;
    this.collectionRequest.to = event.target.value;
  }

  async setFromStage(event: any): Promise<void> {
    this.collectionRequest.fromStage = event.target.value;
    await this.getCollections();
  }

  getToStage(event: any): void {
    this.collectionRequest.toStage = event.target.value;
  }




  expandCollections(): void {
    if (!this.collectionsExpanded) {
      this.collectionLoading(300);
    }
    this.collectionsExpanded = !this.collectionsExpanded;
  }

  selectAll(event: any): void {
    if (event.detail.checked) {
      this.collectionRequest.collections.map(c => c.checked = true);
    } else {
      this.collectionRequest.collections.map(c => c.checked = false);
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'migrate-alert',
      header: 'Data migrations',
      message: this.createAlertMessage(),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Start migrate',
          handler: async () => {
            this.migrating = true;
            this.collectionRequest.collections = this.collectionRequest.collections.filter(col => col.checked === true);
            if (this.collectionRequest.from === '') {
              return;
            }
            if (this.collectionRequest.to === '') {
              return;
            }
            if (this.collectionRequest.collections.length == 0) {
              return;
            }
            await this.api.migrateCollections(this.collectionRequest).then(() => this.migrating = false);
            const toast = await this.toastController.create({
              message: 'Migration ended successfully',
              color: 'success',
              duration: 2000
            });
            await toast.present();
            this.fromStageSelector.value = undefined;
            this.toStageSelector.value = undefined;
            this.collectionRequest.collections = [];
          }
        }
      ]
    });
    await alert.present();
  }



  createAlertMessage(): string {
    let message = `<ion-list class="c-list" mode="md">`;

    // Project data
    message += `
    <ion-list-header>
      Project informations
    </ion-list-header>
    <ion-item>
      <ion-icon slot="start" name="ellipse-outline"></ion-icon>
      <ion-label>${this.collectionRequest.from} ${this.collectionRequest.fromStage}</ion-label>
    </ion-item>
    <ion-item>
      <ion-icon slot="start" name="arrow-forward-circle-outline"></ion-icon>
      <ion-label>${this.collectionRequest.to} ${this.collectionRequest.toStage}</ion-label>
    </ion-item>
    `;

    message += `<ion-list-header>
      Collections to migrate
    </ion-list-header>`;

    this.collectionRequest.collections.filter(col => col.checked === true)
      .forEach(c => {
        message += `<ion-item>${c.name}</ion-item>`;
      });

    return message + '</ion-list>';
  }

  async collectionLoading(ms: number) {
    const loading = await this.loadingController.create({
      cssClass: 'collection-loading',
      message: 'Collections loading...',
      duration: ms
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  // ---------------------Users---------------------

  userRequest = {
    from: '',
    to: '',
    fromStage: 'development',
    toStage: '',
    users: []
  };
  allSelectedUser = false;

  async getUsers(): Promise<void> {
    if (this.userRequest.fromStage == undefined) {
      this.userRequest.users = [];
      return;
    };
    const strings = await this.api.getProjectUsers(this.userRequest.from + '-' + this.userRequest.fromStage.toLocaleLowerCase());
    this.userRequest.users = [];
    strings.forEach(string => {
      this.userRequest.users.push({ name: string, checked: false });
    });
  }


  async getUserFromProject(event: any): Promise<void> {
    this.userRequest.fromStage = '';
    this.fromUserStageSelector.value = undefined;
    this.userRequest.from = event.target.value;
    await this.getUsers();
  }

  getUserToProject(event: any): void {
    this.userRequest.toStage = '';
    this.toUserStageSelector.value = undefined;
    this.userRequest.to = event.target.value;
  }
  async setUserFromStage(event: any): Promise<void> {
    this.userRequest.fromStage = event.target.value;
    await this.getUsers();
  }
  getUserFromStages(): Array<any> {
    if (this.userRequest.from === '') return [];
    return this.projects.filter(p => p.name === this.userRequest.from)[0].stages;
  }
  getUserToStage(event: any): void {
    this.userRequest.toStage = event.target.value;
  }

  getUserToStages(): Array<any> {
    if (this.userRequest.to === '') return [];
    return this.projects.filter(p => p.name === this.userRequest.to)[0].stages;
  }

  expandUsers(): void {
    if (!this.usersExpanded) {
      this.userLoading(300);
    }
    this.usersExpanded = !this.usersExpanded;
  }

  selectAllUser(event: any): void {
    if (event.detail.checked) {
      this.userRequest.users.map(c => c.checked = true);
    } else {
      this.userRequest.users.map(c => c.checked = false);
    }
  }



  async userAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'migrate-alert',
      header: 'Data migrations',
      message: this.createUserAlertMessage(),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Start migrate',
          handler: async () => {
            this.usermigrating = true;
            this.userRequest.users = this.userRequest.users.filter(user => user.checked === true);
            if (this.userRequest.from === '') {
              return;
            }
            if (this.userRequest.to === '') {
              return;
            }
            if (this.userRequest.users.length == 0) {
              return;
            }
            await this.api.migrateUsers(this.userRequest).then(() => this.usermigrating = false);
            const toast = await this.toastController.create({
              message: 'Migration ended successfully',
              color: 'success',
              duration: 2000
            });
            await toast.present();
            this.fromUserStageSelector.value = undefined;
            this.toUserStageSelector.value = undefined;
            this.userRequest.users = []
          }
        }
      ]
    });
    await alert.present();

  }


  createUserAlertMessage(): string {
    let message = `<ion-list class="u-list" mode="md">`;

    // Project data
    message += `
  <ion-list-header>
    Project informations
  </ion-list-header>
  <ion-item>
    <ion-icon slot="start" name="ellipse-outline"></ion-icon>
    <ion-label>${this.userRequest.from} ${this.userRequest.fromStage}</ion-label>
  </ion-item>
  <ion-item>
    <ion-icon slot="start" name="arrow-forward-circle-outline"></ion-icon>
    <ion-label>${this.userRequest.to} ${this.userRequest.toStage}</ion-label>
  </ion-item>
  `;

    message += `<ion-list-header>
    Users to migrate
  </ion-list-header>`;

    this.userRequest.users.filter(user => user.checked === true)
      .forEach(user => {
        message += `<ion-item>${user.name}</ion-item>`;
      });

    return message + '</ion-list>';
  }

  async userLoading(ms: number) {
    const loading = await this.loadingController.create({
      cssClass: 'user-loading',
      message: 'Users loading...',
      duration: ms
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }




  // ---------------------------------------Indexes -------------------------------------

  indexRequest = {
    from: '',
    to: '',
    fromStage: 'development',
    toStage: '',
    indexes: []
  };
  allSelectedindex = false;

  async getIndexFromProject(event: any): Promise<void> {
    this.indexRequest.fromStage = '';
    this.fromIndexStageSelector.value = undefined;
    this.indexRequest.from = event.target.value;
    //await this.getUsers();
  }

  getIndexToProject(event: any): void {
    this.indexRequest.toStage = '';
    this.toIndexStageSelector.value = undefined;
    this.indexRequest.to = event.target.value;
  }

  async setIndexFromStage(event: any): Promise<void> {
    this.indexRequest.fromStage = event.target.value;
    //await this.getUsers();
  }
  getIndexFromStages(): Array<any> {
    if (this.indexRequest.from === '') return [];
    return this.projects.filter(p => p.name === this.indexRequest.from)[0].stages;
  }
  getIndexToStage(event: any): void {
    this.indexRequest.toStage = event.target.value;
  }

  getIndexToStages(): Array<any> {
    if (this.indexRequest.to === '') return [];
    return this.projects.filter(p => p.name === this.indexRequest.to)[0].stages;
  }
  expandIndexes(): void {
    if (!this.indexesExpanded) {
      this.userLoading(300);
    }
    this.indexesExpanded = !this.indexesExpanded;
  }

  selectAllIndex(event: any): void {
    if (event.detail.checked) {
      this.indexRequest.indexes.map(c => c.checked = true);
    } else {
      this.indexRequest.indexes.map(c => c.checked = false);
    }
  }


  async indexAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'migrate-alert',
      header: 'Data migrations',
      message: this.createUserAlertMessage(),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Start migrate',
          handler: async () => {
            this.indexmigrating = true;
            this.indexRequest.indexes = this.indexRequest.indexes.filter(index => index.checked === true);
            if (this.indexRequest.from === '') {
              return;
            }
            if (this.indexRequest.to === '') {
              return;
            }
            if (this.indexRequest.indexes.length == 0) {
              return;
            }
            // await this.api.migrateUsers(this.userRequest).then(() => this.usermigrating = false);
            // const toast = await this.toastController.create({
            //   message: 'Migration ended successfully',
            //   color: 'success',
            //   duration: 2000
            //});
            //await toast.present();
            this.fromIndexStageSelector.value = undefined;
            this.toIndexStageSelector.value = undefined;
            this.indexRequest.indexes = []
          }
        }
      ]
    });
    //await alert.present();

  }

}



