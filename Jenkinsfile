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
    VERSION = "1.0.0-test"
  }

  stages {
    stage("Building Application Image") {
      steps {

        script {
          def imageTag = env.GIT_BRANCH.replaceAll("/", "-")
          if ("master".equals(imageTag)) {
            sh "podman --storage-driver=vfs build -t ${env.IMAGE}:${env.VERSION} ."
          } else {
            sh "podman --storage-driver=vfs build -t ${env.IMAGE}:${imageTag} ."
          }
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