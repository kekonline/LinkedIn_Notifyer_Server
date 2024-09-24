const app = require("./config/app");
const { scrapeJobListing, scrapeJobDescription } = require("./scrapers/scrapeJob");
const { sendMails } = require("./mailer/mailerJob");

// ℹ️ Set the PORT and start the server
const PORT = process.env.PORT || 5005;

const startScraping = async () => {

    console.log("start scraping");
    await scrapeJobListing()
    await scrapeJobDescription()

}

app.listen(PORT, () => {
    console.log(
        `\nLinkedIn_Notifyer Server Listening On: \x1b[1m\x1b[36mhttp://localhost:${PORT}/api\x1b[0m\n`
    );
});

// setInterval(startScraping, 60000);

// sendMails()

// startScraping()

//check erorr in next and middleware
