import { Injectable } from '@nestjs/common';

@Injectable()
export class JenkinsConstantsService {

    getBasicJobXML(repositoryName, stashUrl, projectName, jiraKey, repositorySlug, branch, firebaseSite, stage, folder): string {
        return `
            <flow-definition plugin="workflow-job@2.40">
            <actions>
            <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
            <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
            <jobProperties/>
            <triggers/>
            <parameters/>
            <options/>
            </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
            </actions>
            <description/>
            <keepDependencies>false</keepDependencies>
            <properties>
            <jenkins.model.BuildDiscarderProperty>
            <strategy class="hudson.tasks.LogRotator">
            <daysToKeep>-1</daysToKeep>
            <numToKeep>10</numToKeep>
            <artifactDaysToKeep>-1</artifactDaysToKeep>
            <artifactNumToKeep>-1</artifactNumToKeep>
            </strategy>
            </jenkins.model.BuildDiscarderProperty>
            <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
            <hudson.model.ParametersDefinitionProperty>
            <parameterDefinitions>
            <hudson.model.BooleanParameterDefinition>
            <name>manualSite</name>
            <description>Deploys to the website without commit.</description>
            <defaultValue>false</defaultValue>
            </hudson.model.BooleanParameterDefinition>
            <hudson.model.BooleanParameterDefinition>
            <name>manualNodeCf</name>
            <description>Deploys Node cloud functions without commit.</description>
            <defaultValue>false</defaultValue>
            </hudson.model.BooleanParameterDefinition>
            <hudson.model.BooleanParameterDefinition>
            <name>manualPythonCf</name>
            <description>Deploys Python cloud functions without commit.</description>
            <defaultValue>false</defaultValue>
            </hudson.model.BooleanParameterDefinition>
            </parameterDefinitions>
            </hudson.model.ParametersDefinitionProperty>
            <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
            <triggers>
            <hudson.triggers.SCMTrigger>
            <spec>H/3 * * * *</spec>
            <ignorePostCommitHooks>false</ignorePostCommitHooks>
            </hudson.triggers.SCMTrigger>
            </triggers>
            </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
            </properties>
            <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.85">
            <script>
def changedFiles = []
def gitAuthor = ''
def commitMsg = ''
def version = ''

def manualSite = params.manualSite
def manualNodeCf = params.manualNodeCf
def manualPythonCf = params.manualPythonCf

node {
    
    stage('Check the repositories') {
        dir('${repositoryName}') {
            git branch: '${branch}', credentialsId: 'stash_devops', url: '${stashUrl}'
            gitAuthor= sh( script: "git log --pretty='%H %an' | head -1 | cut -c 42-" , returnStdout: true).trim()
            commitMsg = sh (script: 'git log -1 --pretty=%B ` + "${GIT_COMMIT}" + `', returnStdout: true).trim()
            version = sh (script: 'git log --pretty="%H" |head -1| cut -c -11', returnStdout: true).trim()
        }
        for (changeLogSet in currentBuild.changeSets) { 
          for (entry in changeLogSet.getItems()) { // for each commit in the detected changes
            for (file in entry.getAffectedFiles()) {
              changedFiles.add(file.getPath()) // add changed file to list
            }
          }
        }
        print "Changed Files\\n" + changedFiles
    }
    
    stage('Site deployment') {
        def value = changedFiles.toString()
        if(value.contains('${folder}/') || manualSite){
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + '${branch}'
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e VERSION=' + version
            envs += ' -e FOLDER=' + '${folder}'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'pre'
            envs += ' -e TASK_DISPLAY=' + 'site_deployment_to_development_site'
            envs += ' -e TASK=' + 'site-deploy'
            try {
                sh "docker rm -f ${projectName}-Site-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Site-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-development-site"
            sh "docker rm -f ${projectName}-Site-${stage}"
            
        }
    }
    
    stage('Node Cloud Function deployment') {
        def value = changedFiles.toString()
        if(value.contains('cloud-functions/') || manualNodeCf){
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + '${branch}'
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e FOLDER=' + 'cloud-function'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'pre'
            envs += ' -e TASK_DISPLAY=' + 'Node_cloud_function_to_development_site'
            envs += ' -e TASK=' + 'site-deploy'
            try {
                sh "docker rm -f ${projectName}-Node-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Node-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-development-cf"
            sh "docker rm -f ${projectName}-Node-${stage}"
        }
    }

    stage('Python Cloud Function deployment') {
        def value = changedFiles.toString()
        if(value.contains('python-cloud-functions/') || manualPythonCf){
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + '${branch}'
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e FOLDER=' + 'python-cloud-function'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'pre'
            envs += ' -e TASK_DISPLAY=' + 'Python_cloud_function_to_development_site'
            envs += ' -e TASK=' + 'site-deploy'
            try {
                sh "docker rm -f ${projectName}-Py-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Py-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-development-pycf"
            sh "docker rm -f ${projectName}-Py-${stage}"
        }
    }
}
            </script>
            <sandbox>true</sandbox>
            </definition>
            <triggers/>
            <disabled>false</disabled>
            </flow-definition>
        `;
    }

    getStagingJobXML(repositoryName, stashUrl, projectName, jiraKey, repositorySlug, branch, firebaseSite, stage, folder): string {
        return `
        <flow-definition plugin="workflow-job@2.40">
        <actions>
        <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
        <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
        <jobProperties/>
        <triggers/>
        <parameters/>
        <options/>
        </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
        </actions>
        <description/>
        <keepDependencies>false</keepDependencies>
        <properties>
        <jenkins.model.BuildDiscarderProperty>
        <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>-1</daysToKeep>
        <numToKeep>10</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
        </strategy>
        </jenkins.model.BuildDiscarderProperty>
        <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
        <hudson.model.ParametersDefinitionProperty>
        <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
        <name>version</name>
        <description/>
        <defaultValue/>
        <trim>false</trim>
        </hudson.model.StringParameterDefinition>
        <hudson.model.BooleanParameterDefinition>
        <name>isRollback</name>
        <description>Start rollback if true.</description>
        <defaultValue>false</defaultValue>
        </hudson.model.BooleanParameterDefinition>
        </parameterDefinitions>
        </hudson.model.ParametersDefinitionProperty>
        <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
        <triggers/>
        </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
        </properties>
        <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.85">
        <script>
def gitAuthor = ''
def commitMsg = ''
def version = params.version
def rollback = params.isRollback

node {
    stage('Check the repositories') {
        dir('${repositoryName}') {
            git branch: '${branch}', credentialsId: 'stash_devops', url: '${stashUrl}'
            gitAuthor= sh( script: "git log --pretty='%H %an' | head -1 | cut -c 42-" , returnStdout: true).trim()
            commitMsg = sh (script: 'git log -1 --pretty=%B ` + "${GIT_COMMIT}" + `', returnStdout: true).trim()
        }
    }
    
    stage('Site deployment') {
        if (rollback == false) {
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + '${branch}'
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e VERSION=' + version
            envs += ' -e FOLDER=' + '${folder}'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'staging'
            envs += ' -e TASK_DISPLAY=' + 'site_deployment_to_staging_site'
            envs += ' -e TASK=' + 'site-deploy'
            try {
            sh "docker rm -f ${projectName}-Site-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Site-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-staging"
            sh "docker rm -f ${projectName}-Site-${stage}"
        }
    }
    
    stage('Rollback') {
        if (rollback == true) {
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + version
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e VERSION=' + version
            envs += ' -e FOLDER=' + '${folder}'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'staging'
            envs += ' -e TASK_DISPLAY=' + 'site_rollback_to_staging_site'
            envs += ' -e TASK=' + 'site-rollback'
            try {
            sh "docker rm -f ${projectName}-Site-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Site-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-rollback"
            sh "docker rm -f ${projectName}-Site-${stage}"
        }
    }
}
        </script>
        <sandbox>true</sandbox>
        </definition>
        <triggers/>
        <disabled>false</disabled>
        </flow-definition>
        `;
    }
    
    getProductionJobXML(repositoryName, stashUrl, projectName, jiraKey, repositorySlug, branch, firebaseSite, stage, folder): string {
        return `
        <flow-definition plugin="workflow-job@2.40">
        <actions>
        <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
        <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
        <jobProperties/>
        <triggers/>
        <parameters/>
        <options/>
        </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
        </actions>
        <description/>
        <keepDependencies>false</keepDependencies>
        <properties>
        <jenkins.model.BuildDiscarderProperty>
        <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>-1</daysToKeep>
        <numToKeep>10</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
        </strategy>
        </jenkins.model.BuildDiscarderProperty>
        <org.jenkinsci.plugins.workflow.job.properties.DisableConcurrentBuildsJobProperty/>
        <hudson.model.ParametersDefinitionProperty>
        <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
        <name>version</name>
        <description/>
        <defaultValue/>
        <trim>false</trim>
        </hudson.model.StringParameterDefinition>
        <hudson.model.BooleanParameterDefinition>
        <name>isRollback</name>
        <description>Start rollback if true.</description>
        <defaultValue>false</defaultValue>
        </hudson.model.BooleanParameterDefinition>
        </parameterDefinitions>
        </hudson.model.ParametersDefinitionProperty>
        <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
        <triggers/>
        </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
        </properties>
        <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.85">
        <script>
def gitAuthor = ''
def commitMsg = ''
def version = params.version
def rollback = params.isRollback

node {
    stage('Check the repositories') {
        dir('${repositoryName}') {
            git branch: '${branch}', credentialsId: 'stash_devops', url: '${stashUrl}'
            gitAuthor= sh( script: "git log --pretty='%H %an' | head -1 | cut -c 42-" , returnStdout: true).trim()
            commitMsg = sh (script: 'git log -1 --pretty=%B ` + "${GIT_COMMIT}" + `', returnStdout: true).trim()
        }
    }
    
    stage('Site deployment') {
        if (rollback == false) {
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + '${branch}'
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e VERSION=' + version
            envs += ' -e FOLDER=' + '${folder}'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'production'
            envs += ' -e TASK_DISPLAY=' + 'site_deployment_to_production_site'
            envs += ' -e TASK=' + 'site-deploy'
            try {
            sh "docker rm -f ${projectName}-Site-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Site-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-staging"
            sh "docker rm -f ${projectName}-Site-${stage}"
        }
    }
    
    stage('Rollback') {
        if (rollback == true) {
            envs = ''
            envs += ' -e PROJECT=' + '${projectName}'
            envs += ' -e REPOSITORY=' + 'https://username_password@stash.sed.hu/scm/${jiraKey}/${repositorySlug}'
            envs += ' -e BRANCH=' + version
            envs += ' -e FIREBASE_SITE=' + '${firebaseSite}'
            envs += ' -e AUTHOR=' + gitAuthor.replace(' ', '_')
            envs += ' -e COMMIT=' + commitMsg.replace(' ', '_')
            envs += ' -e VERSION=' + version
            envs += ' -e FOLDER=' + '${folder}'
            envs += ' -e SLACK_CHANNEL=' + "${jiraKey}-deploys"
            envs += ' -e TOKEN=' + 'firebase_token'
            envs += ' -e MODE=' + 'production'
            envs += ' -e TASK_DISPLAY=' + 'site_rollback_to_production_site'
            envs += ' -e TASK=' + 'site-rollback'
            try {
            sh "docker rm -f ${projectName}-Site-${stage}"
            } catch(err) {
                print 'No dangling container'
            }
            sh "docker run --name ${projectName}-Site-${stage} -v /home/admin0/Deployments/logs:/opt/logs" + envs +  " ionic-rollback"
            sh "docker rm -f ${projectName}-Site-${stage}"
        }
    }
}
        </script>
        <sandbox>true</sandbox>
        </definition>
        <triggers/>
        <disabled>false</disabled>
        </flow-definition>
        `;
    } 
}
