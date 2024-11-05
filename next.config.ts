import type { NextConfig } from "next";
import { scrapeJobListing, scrapeJobDescription } from "./app/scrapers/scrapeJob";
import { sendJobsMail } from "./app/mailer/mailerJob";
import { deleteUsersWithoutEmailAndOldCreatedDate } from "./app/utils/cleanDB";
import { connectToMongo } from './app/utils/dbConfig';

let isRunning = false;

const nextConfig: NextConfig = {
  /* config options here */
};


(async () => {
  await connectToMongo();
})();

async function runScrapingTasks() {
  if (isRunning) {
    console.log("Scraping tasks are already running. Skipping this interval.");
    return;
  }
  isRunning = true;

  try {
    console.log("Starting scraping tasks...");
    // await scrapeJobListing();
    await scrapeJobDescription();
    await sendJobsMail();
    await deleteUsersWithoutEmailAndOldCreatedDate();
    console.log("Scraping tasks completed.");
  } catch (error) {
    console.error("An error occurred during scraping tasks:", error);
  } finally {
    isRunning = false;
  }
}

// setInterval(runScrapingTasks, interval);

runScrapingTasks();

export default nextConfig;
