import { Controller, Post, Body } from '@nestjs/common';
import { JenkinsService } from '../../services/jenkins/jenkins.service';
import { FirebaseService } from './../../services/firebase/firebase.service';


@Controller('jenkins')
export class JenkinsController {

  constructor(private jenkins: JenkinsService, private firebaseAPI: FirebaseService) {}

  @Post('/deploy')
  async deploy(@Body() body): Promise<any> {
    const response = await this.jenkins.startDeploy(body);
    return true;
  }

  @Post('/deploy/staging')
  async deployStaging(@Body() body): Promise<any> {
    const response = await this.jenkins.startDeployStaging(body);
    return true;
  }

  @Post('/deploy/production')
  async deployProduction(@Body() body): Promise<any> {
    const response = await this.jenkins.startDeployProduction(body);
    return true;
  }

  @Post('/deploy/rollback')
  async deployRollback(@Body() body): Promise<any> {
    const response = await this.jenkins.startRollback(body);
    return true;
  }

  @Post('/project/create')
  async projectCreate(@Body() body): Promise<any> {
    const vr = await this.jenkins.createView(body);
    const cj = await this.jenkins.createJob(body);
    const jr = await this.jenkins.addJobToView(body);
    const data = await this.firebaseAPI.uploadProjectData(body);
    return true;
  }

  @Post('/project/recreate')
  async projectRecreate(@Body() body): Promise<any> {
    const dj = await this.jenkins.deleteJob(body);
    const vr = await this.jenkins.createView(body);
    const cj = await this.jenkins.createJob(body);
    const jr = await this.jenkins.addJobToView(body);
    const data = await this.firebaseAPI.uploadProjectData(body);
    return true;
  }

}
