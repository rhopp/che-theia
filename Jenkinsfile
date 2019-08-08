pipeline {
    agent { label 'codenvy-slave9' }

    options {
        timestamps()
        timeout(time: 40, unit: 'MINUTES')
        buildDiscarder(logRotator(artifactDaysToKeepStr: '',
                artifactNumToKeepStr: '', daysToKeepStr: '60', numToKeepStr: '100'))
    }

    environment {
        OC_BINARY_DOWNLOAD_UR = "https://github.com/openshift/origin/releases/download/v3.11.0/openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit.tar.gz"
        JENKINS_BUILD = "true"

        DEVFILE_URL = "${WORKSPACE}/e2e/files/happy-path/happy-path-workspace.yaml"
        SUCCESS_THRESHOLD = 5

        CHE_IMAGE_REPO = "maxura/che-server"
        CHE_IMAGE_TAG = "${ghprbPullId}"
    }

    stages {
        stage("Prepare to start Che on OKD") {
            failFast true


                stage("Download oc client") {
                    steps {
                        script {
                            sh """
  wget --no-verbose https://github.com/che-incubator/chectl/releases/latest/download/chectl-linux -O ${WORKSPACE}/chectl
  sudo chmod +x ${WORKSPACE}/chectl
"""
                        }
                    }
                }

        }
    }
}
                /*stage("Start Kubernetes") {
                    steps {
                        script {
                            sh """
  /usr/local/bin/minikube start \\
    --vm-driver=none \\
    --cpus 4 \\
    --memory 12288 \\
    --logtostderr
  sudo chmod g+r -R /home/codenvy/.minikube
  sudo chmod g+r -R /home/codenvy/.kube
  sudo chmod g+r /var/lib/kubeadm.yaml
"""
                        }
                    }
                }

                stage("Build Che") {
                    steps {
                        script {
                            sh "mvn clean install -f ${WORKSPACE}/pom.xml"
                        }
                    }
                }
            }
        }

        stage("Push Che artifacts to docker.io") {
            steps {
                withCredentials([string(credentialsId: 'ed71c034-60bc-4fb1-bfdf-9570209076b5', variable: 'maxura_docker_password')]) {
                    script {
                        sh """
  ${WORKSPACE}/dockerfiles/che/build.sh --organization:maxura --tag:${CHE_IMAGE_TAG} --dockerfile:Dockerfile
  docker tag ${CHE_IMAGE_REPO}:${CHE_IMAGE_TAG} docker.io/${CHE_IMAGE_REPO}:${CHE_IMAGE_TAG}
  docker login -u maxura -p ${maxura_docker_password}
  docker push docker.io/${CHE_IMAGE_REPO}:${CHE_IMAGE_TAG}
"""
                    }

                }
            }
        }

        stage("Start Single Che") {
            steps {
                script {
                    sh """
  ${WORKSPACE}/chectl server:start \\
    --k8spodreadytimeout=180000 \\
    -t=${WORKSPACE}/deploy/ \\
    --listr-renderer=verbose \\
    --cheimage=${CHE_IMAGE_REPO}:${CHE_IMAGE_TAG}
"""

                    // wait che-server to be available
                    sh """
     CHE_URL=\$(kubectl get ingress che-ingress -n=che -o=jsonpath={'.spec.rules[0].host'})
     
     COUNTER=0;
     SUCCESS_RATE_COUNTER=0;
     while true; do
      if [ \$COUNTER -gt 180 ]; then
      echo "Unable to get stable route. Exiting"
        exit 1
      fi
      
      ((COUNTER+=1))
      
      
      STATUS_CODE=\$(curl -sL -w "%{http_code}" -I \${CHE_URL} -o /dev/null; true) || true # added true to not fail the script completely.
      
      echo "Try \${COUNTER}. Status code: \${STATUS_CODE}"
      if [ "\$STATUS_CODE" == "200" ]; then 
        ((SUCCESS_RATE_COUNTER+=1))
      fi
      sleep 1;
    
      if [ \$SUCCESS_RATE_COUNTER == \$SUCCESS_THRESHOLD ]; then 
        echo "Route is stable enough. Continuing running tests"
        break
      fi
     done
"""
                }
            }
        }

        stage("Create test workspace") {
            steps {
                script {
                    sh "/usr/local/bin/chectl workspace:start --devfile=$DEVFILE_URL"
                }
            }
        }

        stage("Run E2E Happy path tests") {
            steps {
                script {
                    // TODO switch to eclipse/che-e2e image
//                    sh """
// CHE_HOST=\$(kubectl get ingress che-ingress -n=che -o=jsonpath={'.spec.rules[0].host'})
// CHE_URL=http://\${CHE_HOST}
// docker run --shm-size=256m --net=host --ipc=host \\
//   -e TS_SELENIUM_HEADLESS='true' \\
//   -e TS_SELENIUM_DEFAULT_TIMEOUT=300000 \\
//   -e TS_SELENIUM_LOAD_PAGE_TIMEOUT=240000 \\
//   -e TS_SELENIUM_WORKSPACE_STATUS_POLLING=20000 \\
//   -e TS_SELENIUM_BASE_URL=\${CHE_URL} \\
//   -v ${WORKSPACE}/e2e:/root/local_tests:Z \\
//   eclipse/che-e2e:nightly
//"""

                    sh """
 CHE_HOST=\$(kubectl get ingress che-ingress -n=che -o=jsonpath={'.spec.rules[0].host'})
 CHE_URL=http://\${CHE_HOST}
 docker run --net=host --ipc=host \\
     -e TS_SELENIUM_HEADLESS='true' \\
     -e TS_SELENIUM_DEFAULT_TIMEOUT=300000 \\
     -e TS_SELENIUM_LOAD_PAGE_TIMEOUT=240000 \\
     -e TS_SELENIUM_BASE_URL=\${CHE_URL} \\
     -e TS_SELENIUM_WORKSPACE_STATUS_POLLING=20000 \\
     -w /home/e2e \\
     -v $WORKSPACE:/home:Z \\
     cypress/browsers:node8.9.3-chrome73 bash -c "npm install &&  npm run test-happy-path"
"""
                }
            }
        }
    }

    post {
        always {
            script {
                sh """
  kubectl get configmaps --namespace=che che -o yaml || true
  
  /usr/local/bin/minikube stop || true
  sudo umount \$(mount | grep "kubelet" | awk '{if(NR>0) print \$3}') || true
  sudo rm -rf `sudo find /tmp -name 'hostpath-provisioner' 2>/dev/null` || true
  docker volume rm \$(docker volume ls -q -f dangling=true) || true
"""
            }

            archiveArtifacts allowEmptyArchive: true, artifacts: "${WORKSPACE}/e2e/report/**"
            cleanWs notFailBuild: true, disableDeferredWipeout: true, deleteDirs: true
        }

    }

}*/