import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private database: AngularFirestore) { }

  // Basic user management
  async getFirebaseUsers(): Promise<any> {
    return await this.http.get(environment.backend + '/firebase/users').toPromise();
  }

  async deleteFirebaseUser(id: string): Promise<any> {
    return await this.http.delete(environment.backend + '/firebase/user/' + id).toPromise();
  }

  async getProjects(): Promise<any> {
    return await this.http.get(environment.backend + '/firestore/projects/').toPromise();
  }

  // Stash API
  async getTags(key: string, project: string): Promise<any> {
    return await this.http.get(environment.backend + '/stash/tags/' + key + '/' + project).toPromise();
  }

  async getBranches(key: string, project: string): Promise<any> {
    return await this.http.get(environment.backend + '/stash/branches/' + key + '/' + project).toPromise();
  }

  // Start deployments
  async startDeployment(project: any, state: string): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/deploy', { project, state }).toPromise();
  }

  async startDeploymentStaging(project: any, state: string, version: string): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/deploy/staging', { project, state, version }).toPromise();
  }

  async startDeploymentProduction(project: any, state: string, version: string): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/deploy/production', { project, state, version }).toPromise();
  }

  async startRollback(project: any, state: string, version: string, rollback: boolean): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/deploy/rollback', { project, state, version, rollback }).toPromise();
  }

  // Project generate
  async generateProject(project: any): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/project/create', project).toPromise();
  }

  // Project recreate
  async recreateProject(project: any): Promise<any> {
    return await this.http.post(environment.backend + '/jenkins/project/recreate', project).toPromise();
  }

  // Get users and collections
  async getProjectCollections(project: string): Promise<any> {
    return await this.http.get(environment.backend + '/firestore/projects/' + project + '/collections/').toPromise();
  }
  async getProjectUsers(project: string): Promise<any> {
    return await this.http.get(environment.backend + '/firestore/users/' + project).toPromise();
  }

  // Migration API
  async migrateCollections(requestBody: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.http.post(environment.backend + '/migrate/collections', requestBody).toPromise();
      resolve(response);
    });
  }

  async migrateUsers(requestBody: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      const response = await this.http.post(environment.backend + '/migrate/users', requestBody).toPromise();
      resolve(response);
    });
  }

}

