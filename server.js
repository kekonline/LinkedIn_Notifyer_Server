const app = require("./config/app");
const { scrapeJobListing, scrapeJobDescription } = require("./scrapers/job");

// ℹ️ Set the PORT and start the server
const PORT = process.env.PORT || 5005;


app.listen(PORT, () => {
    console.log(
        `\nLinkedIn_Notifyer Server Listening On: \x1b[1m\x1b[36mhttp://localhost:${PORT}/api\x1b[0m\n`
    );


    // console.log("start scraping");

    scrapeJobListing()

    // scrapeJobDescription()

});





//check erorr in next and middleware
