// app/lib/scrapingTaskSingleton.ts

import { scrapeJobListing, scrapeJobDescription } from "../scrapers/scrapeJob";
import { sendJobsMail } from "../mailer/mailerJob";
import { deleteUsersWithoutEmailAndOldCreatedDate } from "../utils/cleanDB";

class ScrapingTask {
    private static instance: ScrapingTask;
    private isRunning = false;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): ScrapingTask {
        if (!ScrapingTask.instance) {
            ScrapingTask.instance = new ScrapingTask();
        }
        return ScrapingTask.instance;
    }

    public async run() {
        if (this.isRunning) {
            console.log("Scraping tasks are already running. Skipping this interval.");
            return;
        }

        this.isRunning = true;
        try {
            console.log("Starting scraping tasks...");
            await scrapeJobListing();
            await scrapeJobDescription();
            await sendJobsMail();
            await deleteUsersWithoutEmailAndOldCreatedDate();
            console.log("Scraping tasks completed.");
        } catch (error) {
            console.error("An error occurred during scraping tasks:", error);
        } finally {
            this.isRunning = false;
        }
    }
}

// Export a singleton instance of ScrapingTask
export const scrapingTask = ScrapingTask.getInstance();
