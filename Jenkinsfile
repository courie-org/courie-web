pipeline {
  agent {
        kubernetes {
            cloud 'openshift'
            defaultContainer 'jnlp'
            label 'node-builder'
            serviceAccount 'jenkins'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: image-registry.openshift-image-registry.svc:5000/courie-pipeline/jenkins-nodejs-agent:latest
    imagePullPolicy: Always
    resources:
        limits:
          cpu: 2
          memory: 2Gi
        requests:
          cpu: 1
          memory: 1Gi
"""
    }
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
          env.IMAGE_TAG = env.GIT_BRANCH.replaceAll("/", "-")
          echo 'Branch tag - ' + env.IMAGE_TAG
          podman --version
        }

        sh 'echo $env.IMAGE_TAG'
        sh 'echo $IMAGE_TAG'
        sh 'podman --version'
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