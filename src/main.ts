import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { MailService } from "../src/mail/mail.service";
import { scrapeJobListing, scrapeJobDescription } from "../src/scrapers/scrapeJob";
import { deleteUsersWithoutEmailAndOldCreatedDate } from "../src/maintenance/cleanDB";
import mongoose from 'mongoose';

const interval = 5 * 60 * 1000; // 5 minutes in milliseconds
let isRunning = false;


const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LinkedIn_Notifyer";

const connectToMongo = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    const dbName = db.connections[0].name;
    console.log(`Connected To Mongo! Database Name: ${dbName}`);
  } catch (err) {
    console.error("Error connecting to mongo: ", err);
  }
};

const disconnectFromMongo = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error disconnecting from mongo: ", err);
  }
};

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Allow your React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials if needed
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  // Get MailService instance from NestJS container
  const mailService = app.get(MailService);

  // Pass the instance to `serverJobs`
  serverJobs(mailService);
  // setInterval(() => serverJobs(mailService), interval);
}

async function serverJobs(mailService: MailService) {
  if (isRunning) {
    console.log("Scraping tasks are already running. Skipping this interval.");
    return;
  }
  isRunning = true;

  try {
    console.log("Starting scraping tasks...");
    connectToMongo();
    await scrapeJobListing();
    await scrapeJobDescription();
    await mailService.sendJobsMail();
    await deleteUsersWithoutEmailAndOldCreatedDate();
    disconnectFromMongo();
    console.log("Scraping tasks completed.");
  } catch (error) {
    console.error("An error occurred during scraping tasks:", error);
  } finally {
    isRunning = false;
  }
}

bootstrap();