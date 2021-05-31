import { JenkinsConstantsService } from './../jenkins-constants/jenkins-constants.service';
import { Injectable, Body } from '@nestjs/common';

const CONFIG = {
  baseUrl: 'http://user_password@10.6.14.73:8080',
  crumbIssuer: true
}

const jenkins = require('jenkins')(CONFIG);

@Injectable()
export class JenkinsService {

  constructor(private jenkinsConstants: JenkinsConstantsService) { }

  async startDeploy(body: any): Promise<any> {
    const buildData = {
      name: body.project.name + '-' + body.state,
      parameters: {
        manualSite: true,
        manualNodeCf: false,
        manualPythonCf: false
      }
    };
    console.log(buildData);
    jenkins.job.build(buildData, (data, err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  }

  async startDeployStaging(body: any): Promise<any> {
    console.log(body)
    const buildData = {
      name: body.project.name + '-' + body.state,
      parameters: {
        version: body.version
      }
    };
    console.log(buildData);
    jenkins.job.build(buildData, (data, err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  }

  async startDeployProduction(body: any): Promise<any> {
    const buildData = {
      name: body.project.name + '-' + body.state,
      parameters: {
        version: body.version
      }
    };
    console.log(buildData);
    jenkins.job.build(buildData, (data, err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  }

  async startRollback(body: any): Promise<any> {
    console.log('ez rollabck')
    console.log(body)
    const buildData = {
      name: body.project.name + '-' + body.state,
      parameters: {
        version: body.version,
        isRollback: body.rollback
      }
    };
    console.log(buildData);
    jenkins.job.build(buildData, (data, err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  }

  async createView(body: any): Promise<any> {
    return await new Promise((resolve, reject) => {
      jenkins.view.create(body.key, 'list', (data, err) => {
        if (err) {
          console.log('Error in createView ' + err);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  async deleteJob(body: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      for (let stages of body.stages) {
        await jenkins.job.destroy(body.name + '-' + stages.name, (data, err) => {
          if (err) {
            console.log('Error in delete job: ' + err)
            resolve(false);
          }
          resolve(true);
        });
      }
    });
  }

  async createJob(body: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      let repositoryName = body.repository.split('/')[5].split('.')[0];
      let stashUrl = body.repository;
      let projectName = body.name;
      let jiraKey = body.key;
      let repositorySlug = body.repository.split('/')[5];

      for (let stages of body.stages) {
        let branch = stages.branch;
        let firebaseSite = stages.site;
        let stage = stages.name;
        let folder = stages.folders;
        let alias = stages.alias
        if (alias === 'default') {

          let xml = await this.jenkinsConstants.getBasicJobXML(repositoryName, stashUrl, projectName, jiraKey.toLowerCase(), repositorySlug, branch, firebaseSite, stage, folder);

          jenkins.job.create(body.name + '-' + stages.name, xml, (data, err) => {
            if (err) {
              console.log('Error in createjob: ' + err)
              resolve(false);
            }
            resolve(true);
          });
        }
        if (alias === 'staging') {

          let xml = await this.jenkinsConstants.getStagingJobXML(repositoryName, stashUrl, projectName, jiraKey.toLowerCase(), repositorySlug, branch, firebaseSite, stage, folder);

          jenkins.job.create(body.name + '-' + stages.name, xml, (data, err) => {
            if (err) {
              console.log('Error in createjob: ' + err)
              resolve(false);
            }
            resolve(true);
          });
        }
        if (alias === 'production') {

          let xml = await this.jenkinsConstants.getProductionJobXML(repositoryName, stashUrl, projectName, jiraKey.toLowerCase(), repositorySlug, branch, firebaseSite, stage, folder);

          jenkins.job.create(body.name + '-' + stages.name, xml, (data, err) => {
            if (err) {
              console.log('Error in createjob: ' + err)
              resolve(false);
            }
            resolve(true);
          });
        }
       }
    });
  }

  async addJobToView(body: any): Promise<any> {
    return await new Promise((resolve, reject) => {
      for (let index in body.stages) {
        console.log(body.name + '-' + body.stages[index].name)
        jenkins.view.add(body.key, body.name + '-' + body.stages[index].name, (data, err) => {
          if (err) {
            console.log('Error in addJobToView: ' + err);
            resolve(false);
          }
        });
      }
      resolve(true);
    });
  }
}

