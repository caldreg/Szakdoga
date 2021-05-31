import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private database: AngularFirestore) { }

  async getProjectsLive(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const projects = await this.database.collection('IntegratedProjects').valueChanges();
      resolve(projects);
    });
  }

}
