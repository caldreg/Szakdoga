node {
    
    stage('Deploy to the Firebase') {
        sh 'printenv'
        def envs = ' -e project=' + params.project
        envs += ' -e repository=' + params.repository
        envs += ' -e branch=' + params.branch
        envs += ' -e ticket=' + params.ticket
        envs += ' -e firebase_site=' + params.firebase_site
        envs += ' -e folder=' + params.folder
        envs += ' -e token="firebase_token"'
        envs += ' -e slack_channel=' + slack_channel
        try {
            sh 'docker run --name ' + params.firebase_site + ' ' + envs + ' -v /home/admin0/deploy-logs:/opt/logs/ ionic-ps'
        } catch (err) {
            echo "Container failed"
            currentBuild.result = "FAILED"
        }
    }
    
    stage('Cleaning up in the server') {
        sh 'docker rm -f ' + params.firebase_site
    }
    
}