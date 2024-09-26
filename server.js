const app = require("./config/app");
const interval = 5 * 60 * 1000; // 5 minutes in milliseconds

const { scrapeJobListing, scrapeJobDescription } = require("./scrapers/scrapeJob");
const { sendMails } = require("./mailer/mailerJob");
const { deleteUsersWithoutEmailAndOldCreatedDate } = require("./maintenance/cleanDB");
let isRunning = false;

// ℹ️ Set the PORT and start the server
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(
        `\nLinkedIn_Notifyer Server Listening On: \x1b[1m\x1b[36mhttp://localhost:${PORT}/api\x1b[0m\n`
    );
});

async function runScrapingTasks() {
    if (isRunning) {
        console.log("Scraping tasks are already running. Skipping this interval.");
        return;
    }
    isRunning = true;

    try {
        console.log("Starting scraping tasks...");
        await scrapeJobListing();
        await scrapeJobDescription();
        await sendMails();
        await deleteUsersWithoutEmailAndOldCreatedDate();
        console.log("Scraping tasks completed.");
    } catch (error) {
        console.error("An error occurred during scraping tasks:", error);
    } finally {
        isRunning = false;
    }
}

// setInterval(runScrapingTasks, interval);

// runScrapingTasks();
