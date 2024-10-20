import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { scrapeJobListing, scrapeJobDescription } from "../src/scrapers/scrapeJob";
import { MailService } from "../src/mail/mail.service";
import { deleteUsersWithoutEmailAndOldCreatedDate } from "../src/maintenance/cleanDB";

const interval = 5 * 60 * 1000; // 5 minutes in milliseconds
let isRunning = false;


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);


  // setInterval(serverJobs, interval);
  // serverJobs();
}

async function serverJobs() {
  const mailService = new MailService();
  if (isRunning) {
    console.log("Scraping tasks are already running. Skipping this interval.");
    return;
  }
  isRunning = true;

  try {
    console.log("Starting scraping tasks...");
    await scrapeJobListing();
    await scrapeJobDescription();
    await mailService.sendJobsMail();
    await deleteUsersWithoutEmailAndOldCreatedDate();
    console.log("Scraping tasks completed.");
  } catch (error) {
    console.error("An error occurred during scraping tasks:", error);
  } finally {
    isRunning = false;
  }

}


bootstrap();
