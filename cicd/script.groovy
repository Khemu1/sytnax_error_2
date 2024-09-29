def cleanUp() {
  // -f forces the prune without confirmation
   sh '''
  docker system df
  docker image prune -f
  docker system prune -f
  docker system df
  '''
}

def imageBuild() {
   // Build the backend and frontend images
  sh ''' 
      docker build -t omartamer12/syntaxerror . 
      docker images
    '''
}

def imageTest() {
  sh '''
    docker run -d --name=syntaxerror -p 3000:3000 omartamer12/syntaxerror
    docker ps -a
    docker stop syntaxerror && docker rm syntaxerror
  '''
}

def imagePush() {
   // Push the images to Docker Hub
  // Use withCredentials to securely handle credentials
    withCredentials([usernamePassword(credentialsId: '9', usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PSW')]) {
 sh '''
    echo $DOCKER_PSW | docker login -u $DOCKER_USR --password-stdin
    docker tag omartamer12/syntaxerror omartamer12/syntaxerror:${BUILD_NUMBER}
    docker push omartamer12/syntaxerror:${BUILD_NUMBER}
    '''
    }
}

def deploy() {
   // Deploy the backend and frontend services
    echo 'deploying the application...'
}

return this
