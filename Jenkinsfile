pipeline {
  agent {

    // Use the agent with podman and maven
    label "node-builder"
  }
  environment {

    // Define a credential for pushing to the image registry.
    REGISTRY_CREDS = credentials('registry-creds')
    IMAGE = "quay.io/jamjones/courie-web"
    NAMESPACE = "courie"
  }

  stages {
    stage("Building Application Image") {
      steps {

        script {
          def branchTag = env.GIT_BRANCH.replaceAll("/", "-")
          echo 'Branch tag - ' + branchTag
        }

        sh 'echo $branchTag'
        sh 'echo branchTag'
        //sh 'podman --storage-driver=vfs build -t $IMAGE:$BUILD_NUMBER .'
      }
    }

    stage("Deploying Image") {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject("courie") {
              echo "Using project ${openshift.project()}"
            }
          }
        }
      }
    }
  }
}