// ==========================================================
// TicketCharge Hub - Jenkins CI/CD Pipeline
// GitHub → Build → Docker → Deploy
// ==========================================================

pipeline {

    agent any

    // ---- Environment Variables ----
    environment {
        // Docker Hub ya private registry
        DOCKER_HUB_USER    = credentials('docker-hub-username')   // Jenkins credential
        DOCKER_HUB_PASS    = credentials('docker-hub-password')   // Jenkins credential

        // Image names
        FRONTEND_IMAGE     = "ticketcharge-frontend"
        BACKEND_IMAGE      = "ticketcharge-backend"
        IMAGE_TAG          = "${BUILD_NUMBER}"                     // Har build ka alag tag

        // GitHub repo
        GITHUB_REPO        = "https://github.com/YOUR_GITHUB_USERNAME/ticketcharge-hub.git"
        BRANCH             = "main"
    }

    // ---- Options ----
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))   // Sirf 10 builds rakhega
        timeout(time: 30, unit: 'MINUTES')               // 30 min baad timeout
        timestamps()
    }

    // ---- Stages ----
    stages {

        // --------------------------------------------------
        // Stage 1: Code Checkout from GitHub
        // --------------------------------------------------
        stage('📥 Checkout Code') {
            steps {
                echo '=== GitHub se code pull kar raha hoon ==='
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${BRANCH}"]],
                    userRemoteConfigs: [[
                        url: "${GITHUB_REPO}",
                        credentialsId: 'github-credentials'    // Jenkins mein add karo
                    ]]
                ])
                echo "✅ Code checkout complete - Branch: ${BRANCH}"
            }
        }

        // --------------------------------------------------
        // Stage 2: Read Version from pom.xml
        // --------------------------------------------------
        stage('📋 Read Version') {
            steps {
                script {
                    // Maven se version read karo
                    def pomVersion = sh(
                        script: "mvn help:evaluate -Dexpression=project.version -q -DforceStdout",
                        returnStdout: true
                    ).trim()
                    env.APP_VERSION = pomVersion
                    echo "✅ App Version: ${env.APP_VERSION}"
                }
            }
        }

        // --------------------------------------------------
        // Stage 3: Install Frontend Dependencies
        // --------------------------------------------------
        stage('📦 Frontend - npm install') {
            steps {
                echo '=== Frontend dependencies install kar raha hoon ==='
                sh '''
                    node --version
                    npm --version
                    npm install --legacy-peer-deps
                '''
                echo "✅ Frontend npm install complete"
            }
        }

        // --------------------------------------------------
        // Stage 4: Build Frontend (React + Vite)
        // --------------------------------------------------
        stage('🏗️ Frontend - Build') {
            steps {
                echo '=== React app build kar raha hoon ==='
                sh 'npm run build'
                echo "✅ Frontend build complete - dist/ folder ready"
            }
            post {
                success {
                    echo "✅ dist/ folder size:"
                    sh 'du -sh dist/'
                }
            }
        }

        // --------------------------------------------------
        // Stage 5: Install Backend Dependencies
        // --------------------------------------------------
        stage('📦 Backend - npm install') {
            steps {
                echo '=== Backend dependencies install kar raha hoon ==='
                sh '''
                    cd backend
                    npm install --omit=dev
                '''
                echo "✅ Backend npm install complete"
            }
        }

        // --------------------------------------------------
        // Stage 6: Build Docker Images
        // --------------------------------------------------
        stage('🐳 Docker Build') {
            parallel {

                stage('Frontend Docker Image') {
                    steps {
                        echo '=== Frontend Docker image build kar raha hoon ==='
                        sh """
                            docker build \
                                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                -t ${FRONTEND_IMAGE}:latest \
                                -f Dockerfile \
                                .
                        """
                        echo "✅ Frontend image ready: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    }
                }

                stage('Backend Docker Image') {
                    steps {
                        echo '=== Backend Docker image build kar raha hoon ==='
                        sh """
                            docker build \
                                -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                -t ${BACKEND_IMAGE}:latest \
                                -f backend/Dockerfile \
                                backend/
                        """
                        echo "✅ Backend image ready: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    }
                }

            }
        }

        // --------------------------------------------------
        // Stage 7: Push to Docker Hub
        // --------------------------------------------------
        stage('📤 Docker Push') {
            steps {
                echo '=== Docker Hub pe push kar raha hoon ==='
                sh """
                    echo "${DOCKER_HUB_PASS}" | docker login -u "${DOCKER_HUB_USER}" --password-stdin

                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker tag ${FRONTEND_IMAGE}:latest       ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest

                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG}  ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker tag ${BACKEND_IMAGE}:latest        ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                    docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest

                    docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_HUB_USER}/${BACKEND_IMAGE}:latest

                    docker logout
                """
                echo "✅ Docker Hub push complete"
            }
        }

        // --------------------------------------------------
        // Stage 8: Deploy with Docker Compose
        // --------------------------------------------------
        stage('🚀 Deploy') {
            steps {
                echo '=== Docker Compose se deploy kar raha hoon ==='
                sh '''
                    # Purani containers band karo
                    docker-compose down || true

                    # .env file copy karo (server pe pehle se honi chahiye)
                    cp .env.docker .env 2>/dev/null || true

                    # Nayi images se start karo
                    docker-compose up -d --remove-orphans

                    # Wait and check health
                    sleep 15
                    docker-compose ps
                '''
                echo "✅ Deploy complete! App chal raha hai."
            }
        }

        // --------------------------------------------------
        // Stage 9: Health Check
        // --------------------------------------------------
        stage('🏥 Health Check') {
            steps {
                echo '=== App ka health check kar raha hoon ==='
                sh '''
                    sleep 10
                    curl -f http://localhost/       || exit 1
                    curl -f http://localhost:5050/api/health || exit 1
                    echo "✅ Frontend aur Backend dono healthy hain!"
                '''
            }
        }

        // --------------------------------------------------
        // Stage 10: Cleanup old Docker images
        // --------------------------------------------------
        stage('🧹 Cleanup') {
            steps {
                echo '=== Purani Docker images clean kar raha hoon ==='
                sh '''
                    docker image prune -f
                    echo "✅ Cleanup done"
                '''
            }
        }

    }

    // ---- Post actions (success/failure ke baad) ----
    post {

        success {
            echo """
            ╔══════════════════════════════════════╗
            ║  ✅ BUILD SUCCESSFUL                 ║
            ║  Build #${BUILD_NUMBER}              ║
            ║  Branch: ${BRANCH}                   ║
            ╚══════════════════════════════════════╝
            """
        }

        failure {
            echo """
            ╔══════════════════════════════════════╗
            ║  ❌ BUILD FAILED                     ║
            ║  Build #${BUILD_NUMBER}              ║
            ║  Check logs above for errors         ║
            ╚══════════════════════════════════════╝
            """
        }

        always {
            // Workspace clean karo
            cleanWs()
        }
    }

}
