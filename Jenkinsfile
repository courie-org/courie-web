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
    CLUSTER_APPS_BASE_URL = "<REPLACE ME>"
  }

  stages {
    stage("Building Application Image") {
      steps {

        script {
          def friendlyBranchName = env.GIT_BRANCH.replaceAll("/", "-")
          def imgNameAndTag = env.IMAGE + ":" + ${env.VERSION}
          if (!"master".equals(friendlyBranchName)) {
            imgNameAndTag = env.IMAGE + ":" + friendlyBranchName
          } 

          sh "podman --storage-driver=vfs build -t ${imgNameAndTag} ."
          sh 'podman login -u $REGISTRY_CREDS_USR -p $REGISTRY_CREDS_PSW quay.io'
          sh "podman push ${imgNameAndTag}"
        }
      }
    }

    stage("Dark Release") {
      when {
        expression {
          BRANCH_NAME != 'master'
        }
      }
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject("courie") {
              echo "Using project ${openshift.project()}"

              // Create a new VirtualService and DestinationRule for the branch
              openshift.apply(openshift.process(readFile(".openshift/new-dark-workload.yaml"), "-p", "BRANCH=${friendlyBranchName}", "-p", "CLUSTER_APPS_BASE_URL=${env.CLUSTER_APPS_BASE_URL}"))

            }
          }
        }
      }
    }
    stage("Official Release") {
      when {
        expression {
          BRANCH_NAME == 'master'
        }
      }
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject("courie") {

            }
          }
        }
      }
    }
  }
}