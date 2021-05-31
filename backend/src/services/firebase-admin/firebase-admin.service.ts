//import { async } from '@angular/core/testing';
//import { element } from 'protractor';
import { Test } from '@nestjs/testing';
import { Injectable, Get, Body } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { response } from 'express';
import { write } from 'fs';

@Injectable()
export class FirebaseAdminService {

    async getProejctIndexes(project: string): Promise<any> {
        let result = new Array<string>();
        try {
            const key = await require('fs').readFileSync('./src/keys/' + project + '.json', "utf8");

            if (admin.apps.filter(app => app.name === project).length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(key))
                }, project);
            }

            const currentApp = admin.apps.filter(app => app.name === project)[0];

            const db = await admin.instanceId(currentApp).app.firestore().listCollections()
            db.forEach(element => {
                console.log(element)
            });
        } catch (err) {
            console.log(err);
            result = [];
        }
        return result;

    }


    async getProjectCollections(project: string): Promise<Array<string>> {

        let result = new Array<string>();

        try {
            const key = await require('fs').readFileSync('./src/keys/' + project + '.json', "utf8");

            if (admin.apps.filter(app => app.name === project).length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(key))
                }, project);
            }

            const currentApp = admin.apps.filter(app => app.name === project)[0];
            const db = await admin.instanceId(currentApp).app.firestore();

            const collectionRefs = await db.listCollections();


            collectionRefs.forEach(collection => {
                result.push(collection["_queryOptions"].collectionId);
            });
        } catch (err) {
            console.log(err);
            result = [];
        }
        return result;
    }

    async getProjectUsers(project: string): Promise<any[]> {
        let result = new Array();
        try {
            const key = await require('fs').readFileSync('./src/keys/' + project + '.json', "utf8");
            if (admin.apps.filter(app => app.name === project).length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(key))
                }, project);
            }
            const currentApp = admin.apps.filter(app => app.name === project)[0];
            const dbUsers = await currentApp.auth().listUsers(1000);
            dbUsers.users.forEach(userData => {
                if (userData.email !== undefined) {
                    result.push(userData.email);
                }
            });
        } catch (err) {
            console.log(err);
            result = [];
        }
        return result;
    }

    async migrateCollections(body: any): Promise<any> {
        return await new Promise(async (resolve, reject) => {
            const sourceCollectionData = {};

            body.fromStage = body.fromStage.toLowerCase();
            body.toStage = body.toStage.toLowerCase();
            console.log(body);

            // Getting the data
            try {
                const key = await require('fs').readFileSync('./src/keys/' + body.from + '-' + body.fromStage + '.json', "utf8");

                if (admin.apps.filter(app => app.name === body.from + '-' + body.fromStage).length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(key))
                    }, body.from + '-' + body.fromStage);
                }

                const currentApp = admin.apps.filter(app => app.name === body.from + '-' + body.fromStage)[0];
                const db = await admin.instanceId(currentApp).app.firestore();

                for (let collection of body.collections) {
                    sourceCollectionData[collection.name] = {};
                    const cRef = await db.collection(collection.name).get();
                    cRef.forEach(col => {
                        sourceCollectionData[collection.name][col.id] = col.data();
                    })
                }

            } catch (err) {
                console.log(err);
                resolve(false)
            }


            // Write the data
            try {
                const key = await require('fs').readFileSync('./src/keys/' + body.to + '-' + body.toStage + '.json', "utf8");

                if (admin.apps.filter(app => app.name === body.to + '-' + body.toStage).length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(key))
                    }, body.to + '-' + body.toStage);
                }

                const currentApp = admin.apps.filter(app => app.name === body.to + '-' + body.toStage)[0];
                const db = await admin.instanceId(currentApp).app.firestore();

                for (let collection in sourceCollectionData) {
                    for (let document in sourceCollectionData[collection]) {
                        await db.collection(collection).doc(document).set(sourceCollectionData[collection][document]);
                    }
                }
            } catch (err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    }

    async migrateUsers(body: any): Promise<any> {
        let userImportRecords = [];
        return await new Promise(async (resolve, reject) => {

            body.fromStage = body.fromStage.toLowerCase();
            body.toStage = body.toStage.toLowerCase();

            // Getting the data
            try {
                const key = await require('fs').readFileSync('./src/keys/' + body.from + '-' + body.fromStage + '.json', "utf8");

                if (admin.apps.filter(app => app.name === body.from + '-' + body.fromStage).length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(key))
                    }, body.from + '-' + body.fromStage);
                }

                const currentApp = admin.apps.filter(app => app.name === body.from + '-' + body.fromStage)[0];
                const dbUsers = await currentApp.auth().listUsers();
                // console.log(JSON.parse(key).auth_key);
                
                for (let user of body.users) {
                    dbUsers.users.forEach(element => {
                        if (element.email === user.name) {
                            const tmp = {
                                uid: element.uid,
                                email: element.email,
                                passwordHash: Buffer.from(element.passwordHash, 'base64'),
                                passwordSalt: Buffer.from(element.passwordSalt, 'base64')
                            }
                            userImportRecords.push(tmp);
                        }
                    });
                }
                resolve(true)
            } catch (err) {
                console.log(err);
                resolve(false)
            }
            try {
                const key = await require('fs').readFileSync('./src/keys/' + body.to + '-' + body.toStage + '.json', "utf8");

                if (admin.apps.filter(app => app.name === body.to + '-' + body.toStage).length === 0) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(key))
                    }, body.to + '-' + body.toStage);
                }

                const currentApp = admin.apps.filter(app => app.name === body.to + '-' + body.toStage)[0];
                const db = await admin.instanceId(currentApp).app

                const response = await db.auth().importUsers(userImportRecords, {
                hash: {
                    algorithm: 'SCRYPT',
                    key: Buffer.from(key, 'base64'),
                    saltSeparator: Buffer.from('Bw==', 'base64'),
                    rounds: 8,
                    memoryCost: 14,
                },
              });
              console.log(response)
            } catch (err) {
                console.log(err);
                resolve(false)
            }
            resolve(true);
        });
    }
}
