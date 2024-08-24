#!/bin/bash

# Inputs 
read -p "Enter your Project ID: " PROJECT_ID
read -p "Enter your Google Cloud Email ID: " USER_EMAIL
read -p "Enter username for database user: " DATABASE_USERNAME
read -p "Enter password for database password: " DATABASE_PASSWORD

# Variables 
LOCATION="us-central1"
SERVICE_ACCOUNT_NAME="yu-start-service-acc"
SERVICE_ACCOUNT_EMAIL="yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com"
SQL_INSTANCE_NAME="yu-start-instance"
DATABASE_NAME="default-db"

# Set shell config
echo "Configuring shell"
gcloud config set project $PROJECT_ID

# Enabling APIs 
echo "Enabling APIs"
gcloud services enable cloudbuild.googleapis.com \
run.googleapis.com \
artifactregistry.googleapis.com \
aiplatform.googleapis.com \
sql-component.googleapis.com \
sqladmin.googleapis.com 

# Creating Service Account
echo "Creating Service Account"
gcloud iam service-accounts create yu-start-service-acc 

gcloud projects add-iam-policy-binding $PROJECT_ID \
--member="serviceAccount:yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/iam.serviceAccountTokenCreator"

gcloud projects add-iam-policy-binding $PROJECT_ID \
--member="serviceAccount:yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
--member="serviceAccount:yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
--member="serviceAccount:yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/aiplatform.user"

gcloud iam service-accounts add-iam-policy-binding \
yu-start-service-acc@$PROJECT_ID.iam.gserviceaccount.com \
--member="user:$USER_EMAIL" \
--role="roles/iam.serviceAccountUser"

# Create Cloud SQL Instance
echo "Creating Cloud SQL Instance"
gcloud sql instances create $SQL_INSTANCE_NAME --edition="enterprise" --database-version="POSTGRES_15"  --region=$LOCATION --tier="db-f1-micro"

gcloud sql users create $DATABASE_USERNAME --instance=$SQL_INSTANCE_NAME --password=$DATABASE_PASSWORD 
gcloud sql databases create $DATABASE_NAME --instance=$SQL_INSTANCE_NAME

# Migration 
echo "Running Migration"
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.12.0/cloud-sql-proxy.linux.amd64

chmod +x cloud-sql-proxy

./cloud-sql-proxy --port 2229 $PROJECT_ID:$LOCATION:$SQL_INSTANCE_NAME & disown

export DATABASE_URL="postgresql://$DATABASE_USERNAME:$DATABASE_PASSWORD@127.0.0.1:2229/$DATABASE_NAME?schema=public"

npm i prisma -y

npx prisma migrate dev --name init

fuser -k 2229/tcp
# Creating ENV file
touch .env

cat > .env <<EOF
PROJECT_ID="$PROJECT_ID"
LOCATION="$LOCATION"
DATABASE_USERNAME="$DATABASE_USERNAME"
DATABASE_PASSWORD="$DATABASE_PASSWORD"
DATABASE_NAME="$DATABASE_NAME"
DATABASE_INSTANCE_NAME="$PROJECT_ID:$LOCATION:$SQL_INSTANCE_NAME"
EOF

# Create Artifact Resgistry
echo "Creating Artifact Registry"
gcloud artifacts repositories create yu-start-repo --repository-format=docker --location=$LOCATION

DOCKER_URL=$LOCATION-docker.pkg.dev/$PROJECT_ID/yu-start-repo/yu-start-image

docker build . -t $DOCKER_URL --build-arg MY_VAR=$(grep MY_VAR .env | cut -d '=' -f2)

docker push $DOCKER_URL

# Deploy to Cloud Run 
echo "Deploying to Cloud Run"
gcloud run deploy yu-start --allow-unauthenticated --platform=managed --region=$LOCATION --image=$DOCKER_URL --port=3000 --service-account=$SERVICE_ACCOUNT_EMAIL --set-env-vars PROJECT_ID="$PROJECT_ID",LOCATION="$LOCATION",DATABASE_USERNAME="$DATABASE_USERNAME",DATABASE_PASSWORD="$DATABASE_PASSWORD",DATABASE_NAME="$DATABASE_NAME",DATABASE_INSTANCE_NAME="$PROJECT_ID:$LOCATION:$SQL_INSTANCE_NAME"