import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";

const https = require('https');

const config = {
  stash: {
    host: 'stash.sed.hu',
    port: 443,
    path: null,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('username' + ':' + 'password').toString('base64')
    }
  },
  jira: {
    host: 'jira.sed.hu',
    port: 443,
    path: null,
    headers: {
      'Authorization': 'Basic ' + Buffer.from('username' + ':' + 'password').toString('base64')
    }
  }
};

async function fetchPullRequests() {
  console.log(new Date().toISOString() + ': Fetch pull requests');

  const pythonArgument = { 'create': new Array(), 'delete': new Array() };
  const db = admin.firestore();

  const projects = (await db.collection('Projects').get()).docs;

  for (const snap of projects) {
    const project = snap.data();
    const new_ps = await new Promise<Array<any>>(resolve => {
      let endpoint = config.stash;
      endpoint.path = `/rest/api/1.0/projects/${project.jiraKey}/repos/${project.repository.split('/')[5].replace('.git', '')}/pull-requests`;

      https.get(endpoint, response => {
        let result = '';
        response.on('data', data => result += data);
        response.on('end', () => {
          const toUpload = new Array();
          const pullRequests = JSON.parse(result).values;
          const opened = pullRequests.filter(ps => ps.state === 'OPEN');
          if (opened.length > 0) {
            opened.forEach(ps => {
              toUpload.push({ source: ps.fromRef.displayId, author: ps.author.user.displayName });
            });
          }
          resolve(toUpload);
        });
      });
    });

    if (new_ps.length > 0) {
      let fs_cur_snap = undefined;
      try {
        fs_cur_snap = await (await db.collection('Pull-Requests').doc(project.name).get()).data().values;
        fs_cur_snap.forEach(ex_ps => {
          const con_test_id = new_ps.findIndex(ne_ps => ne_ps.source === ex_ps.source);
          if (con_test_id === -1) {
            // Mark for delete
            pythonArgument.delete.push({
              project_id: project['pre-id'],
              site: ex_ps.source.replace('/', '-').toLowerCase(),
              author: ex_ps.author,
              source: ex_ps.source,
              projectName: project.name
            });
          } else {
            if (ex_ps['deployed'] === undefined) {
              // Mark for deploy
              pythonArgument.create.push({
                project_id: project['pre-id'],
                site: ex_ps.source.replace('/', '-').toLowerCase(),
                author: ex_ps.author,
                source: ex_ps.source,
                projectName: project.name
              });
            } else {
              // Already deployed
            }
          }
        });
      } catch {
        new_ps.forEach(ps => {
          pythonArgument.create.push({
            project_id: project['pre-id'],
            site: ps.source.replace('/', '-').toLowerCase(),
            author: ps.author,
            source: ps.source,
            projectName: project.name
          });
        });
      }
    }
  }

  // Check the delete fields
  // Delete ticket sites only with "done" JIRA status
  if (pythonArgument.delete.length > 0) {
    const dataToDelete = new Array();
    for (const data of pythonArgument.delete) {
      const ticketId = data.source.split('/')[1];
      const status = await new Promise<string>(resolve => {
        const endpoint = config.jira;
        endpoint.path = `https://jira.sed.hu/rest/api/latest/issue/${ticketId}`;
        https.get(endpoint, response => {
          let result = '';
          response.on('data', data => result += data);
          response.on('end', () => {
            resolve(JSON.parse(result).fields.status.name);
          });
        });
      });
      if (status !== 'Done' && status !== 'Resolved') {
        // console.log(data.source, status);
        const index = pythonArgument.delete.findIndex(te => te.source == data.source);
        dataToDelete.push(data);
      }
    }
    dataToDelete.forEach(data => {
      pythonArgument.delete = pythonArgument.delete.filter(te => te != data);
    });
  }

  // Run the Selenium script to create & delete sites
  // TODO: Copy to it from mock at the work
  console.log(pythonArgument);

}

async function deployPullRequests() {
  
  const db = admin.firestore();
  const pss = (await db.collection('Pull-Requests').get()).docs;

  for (const data of pss) {
    const ps = data.data();

    ps.values.forEach(pSite => {
      // Check if already deployed
      if (pSite['deployed'] !== true) {
        // Check status
        if (pSite['status'] !== 'In progress') {
          // Start the deploy
          // TODO: Write the Jenkins HTTP call
          console.log('Start deploying ' + pSite.source);
        }
      }
    });

  }

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize Firebase Admin SDK
  const adminConfig: ServiceAccount = {
    "projectId": "inclouded-project-monitoring",
    "privateKey": "-----BEGIN PRIVATE KEY-----\\n-----END PRIVATE KEY-----\n",
    "clientEmail": "firebase-adminsdk",
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://inclouded-project-monitoring.firebaseio.com'
  });

  // Cors options
  const corsOrigins = ['http://localhost:8100', 'https://inclouded-monitoring.firebaseapp.com', 'https://inclouded-monitoring.web.app'];
  const corsOptions = {
    origin: function (origin, callback) {
      var isWhitelisted = corsOrigins.indexOf(origin) !== -1;
      callback(null, isWhitelisted);
    },
  };
  app.enableCors(corsOptions);

  // fetchPullRequests();
  // deployPullRequests();

  await app.listen(3000);
}
bootstrap();
