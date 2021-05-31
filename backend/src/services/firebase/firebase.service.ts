import { Injectable } from '@nestjs/common';
import { response } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {

  async getUsers(): Promise<string> {
    const data = await admin.auth().listUsers(100);
    return JSON.stringify(data);
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await admin.auth().deleteUser(id);
      console.log(`User with ${id} id was deleted.`);
      admin.firestore().collection('Logs').doc().set({ type: 'general', value: `User with ${id} id was deleted.`, date: new Date() })
      return true;
    } catch {
      return false;
    }
  }

  async getProjects(): Promise<any[]> {
    const snap = await admin.firestore().collection('IntegratedProjects').get()
    const res = new Array();
    snap.forEach(doc => {
      res.push(doc.data());
    });
    return res;
  }

  async uploadProjectData(body) {
    const response = await admin.firestore().collection('IntegratedProjects').doc(body.name).set(body);
    return response;

    
  }
}
