require("dotenv").config();
const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');

const delay = async (min = 3000, max = 4000, randomIncrease = 0) => {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise(async (resolve) => setTimeout(resolve, time));
};

const getPublicIP = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log('Your public IP address is:', response.data.ip);
    } catch (error) {
        console.error('Error fetching public IP:', error);
    }
}

const initializeBrowserAndPage = async () => {

    try {
        puppeteer.use(stealthPlugin());
        const browser = await puppeteer.launch({
            headless: false, // Set to false to see the browser in action
            args: [
                `--window-size=430,932`,
                `--window-position=1025,0`,
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                `--proxy-server=${process.env.PROXY1}`,
                // `--auto-open-devtools-for-tabs`
            ],
            defaultViewport: {
                width: 430,
                height: 932,
                deviceScaleFactor: 1,
            }
        });

        const pages = await browser.pages();
        const page = pages[0];
        await page.setJavaScriptEnabled(true);
        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });

        await page.authenticate({
            username: process.env.PROXYUSER,
            password: process.env.PROXYPASS,
        });

        getPublicIP();

        return { page, browser };
    } catch (error) {

        console.error('Error Initializing Browser And Page:', error);
        throw new Error('Error Initializing Browser And Page:', error);
    }
}

const goToURL = async (page, url) => {
    console.log('Navigating To URL:', url);
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await page.goto(url, {
                waitUntil: 'networkidle2', // Wait until the network is idle
            });
            await delay(5000, 8000);

            const currentURL = await page.url();

            if (currentURL.includes(url)) {
                console.log('URL Loaded');
                return false;
            } else {
                console.log('Failed To Load URL, Retrying...');
            }

            retries++;
        } catch (error) {
            console.log('Error Navigating To URL, Retrying...', error);
            retries++;
            await delay(5000, 8000);
        }
    }

    console.log('Failed To Load URL After 3 Attempts');
    return true;
};


const acceptCookies = async (page) => {
    console.log('Checking for Cookie Button:');

    await delay();
    const cookieButton = await page.$('button.artdeco-global-alert-action');
    if (!cookieButton) {
        console.log('No Cookie Button Found');
        return;
    }

    console.log('Accepting Cookies');
    await cookieButton.click();
};

const insertJob = async (page, jobDescription) => {
    try {
        console.log('Set Job');
        await delay(4000, 5000);
        if (!(await page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener'))) {
            console.log('No Job Button Found');
            return true
        }
        await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();
        await delay();
        for (const char of jobDescription) {
            await page.type('input[aria-controls="job-search-bar-keywords-typeahead-list"]', char); // No delay here, we handle it ourselves
            await delay(200, 500, 500); // Variable delay between characters
        }
        await delay();
        await page.keyboard.press('Enter');
        return false
    } catch (error) {
        throw new Error('Error Inserting Job:', error);
    }
}

const insertCountry = async (page, country) => {
    try {
        console.log('Set Country');
        await delay(4000, 5000);
        if (!(await page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener"]'))) {
            console.log('No Country Button Found');
            return true
        }
        await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();

        await delay();
        await page.locator('input[aria-controls="job-search-bar-location-typeahead-list"]').click();

        await delay();

        for (let i = 0; i < 18; i++) {
            await page.keyboard.down('Backspace');
            await delay(200, 500);
        }

        for (const char of country) {
            await page.type('input[aria-controls="job-search-bar-location-typeahead-list"]', char);
            await delay(200, 500, 500);
        }
        await delay();
        await page.keyboard.press('Enter');

        return false
    } catch (error) {
        throw new Error('Error Inserting Country:', error);
    }


}

const setRemoteWork = async (page, jobType) => {
    try {
        console.log(`Set ${jobType} Work`);
        await delay(4000, 5000);
        if (!(await page.$('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]'))) {
            console.log('No Work Type Button Found');
            return [true, null]
        }
        await page.locator('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]').click();
        await delay();
        if (await !page.$('input#f_WT-2')) {
            console.log('No Remote Work Found');
            return [false, false]
        }
        await page.locator('#f_WT-2').click();
        await delay();
        await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_WT"]').click();
        return [false, true]
    } catch (error) {
        throw new Error(`Error Setting ${jobType} Work:`, error);
    }
}

const setJobsLast24Hours = async (page) => {
    try {
        console.log('Set Last 24 Hour Jobs');
        await delay(4000, 5000);
        if (!(await page.$('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]'))) {
            console.log('No Time Frame Button Found');
            return [false, false]
        }
        await page.locator('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]').click();
        await delay();
        if (await !page.$('input#f_TPR-3')) {
            console.log('Jobs In Last 24 Hours Found');
            return [false, false]
        }
        await page.locator('#f_TPR-3').click();
        await delay();
        await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_TPR"]').click();
        return [false, true]
    } catch (error) {
        throw new Error('Error Setting Last 24 Hour Jobs:', error);
    }
}

const getJobListingData = async (page) => {
    console.log('Scraping Job Listing');
    try {
        await delay(4000, 5000);
        if (!(await page.$('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li'))) {
            console.log('No Search Results Found');
            return []
        }
        const gotData = await page.evaluate(() => {
            const liElements = document.querySelectorAll('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li');
            const result = Array.from(liElements).map(li => {
                const card = li.querySelector('div.base-card');
                return {
                    title: card?.querySelector('h3.base-search-card__title')?.textContent.trim() || null,
                    company: card?.querySelector('h4.base-search-card__subtitle a')?.textContent.trim() || null,
                    location: card?.querySelector('span.job-search-card__location')?.textContent.trim() || null,
                    datePosted: card?.querySelector('time.job-search-card__listdate--new')?.getAttribute('datetime') || null,
                    jobURL: card?.querySelector('a.base-card__full-link')?.href || null,
                    companyLogo: card?.querySelector('img.artdeco-entity-image')?.src || null
                };
            });
            return result;
        });
        console.log('Scraping Job Listing Done Got: ', gotData && gotData.length ? gotData.length : 0);
        return gotData;
    } catch (error) {
        throw new Error('Error Getting Data:', error);
    }
}

const getJobDescriptionData = async (page) => {
    console.log('Scraping Description');
    try {
        await delay(4000, 5000);
        if (!(await page.$('div.show-more-less-html__markup'))) {
            console.log('No Description Results Found');
            return [true, null]
        }
        const gotData = await page.evaluate(() => {

            return {
                description: document?.querySelector('div.show-more-less-html__markup')?.innerHTML.trim() || null,
            };

        });
        return [false, gotData];
    } catch (error) {
        throw new Error('Error Getting Data:', error);
    }
}

const saveToDBJobListing = async (scrapedJobListings, searchTermId) => {
    const joblListingsForDB = scrapedJobListings.map(jobListing => {
        const { title, company, location, jobURL } = jobListing;

        if (!jobURL) return;

        const simplifiedURL = jobURL.split('?')[0] + '/';
        return {
            updateOne: {
                filter: { jobURL: simplifiedURL },
                update: {
                    $set: {
                        title,
                        company,
                        location,
                        jobURL: simplifiedURL
                    },
                    $addToSet: {
                        searchTerms: searchTermId
                    }
                },
                upsert: true
            }
        };
    });
    const result = await JobListing.bulkWrite(joblListingsForDB);
    console.log(`Saved To DB Job Listing: ${result}`);
    return result;
}

const updateJobSearchTermsToScrape = async (scrapedJobListings, searchTermId) => {
    let jobListingIds = []

    if (scrapedJobListings && scrapedJobListings.length > 0) {
        jobListingIds = Object.values(scrapedJobListings.upsertedIds);
    }

    try {
        await SearchTerm.updateOne(
            { _id: searchTermId }, // Filter by _id
            {
                $addToSet: { jobListings: { $each: jobListingIds } }, // Add job listing IDs to the array, ensuring no duplicates
                $set: { lastScraped: new Date() }
            }
        );
        console.log(`Updated Job Search Terms To Scrape: ${jobListingIds.length}`);

    } catch (error) {
        console.error("Error updating search terms: ", error);
        throw error;
    }


}


const saveToDBJobDescription = async (data) => {
    const dataForDB = data.map(jobListing => {
        const { _id, description } = jobListing;
        return {
            updateOne: {
                filter: { _id: _id },
                update: {
                    $set: {
                        description: Buffer.from(description, 'utf-8').toString('utf-8')
                    }
                },
                upsert: true
            }
        };
    });
    const result = await JobListing.bulkWrite(dataForDB);
}

const getJobListingsWithNoDescription = async () => {
    try {
        const jobListings = await JobListing.find({
            $or: [
                { description: { $exists: false } },

            ]
        })
            .limit(10);
        return jobListings;
    } catch (error) {
        console.error("Error fetching job listings with no description:", error);
        throw error;
    }
};

const getJobSearchTermsToScrape = async () => {
    console.log('Fetching Job Search Terms To Scrape');
    try {
        const timeAgo = new Date(Date.now() - process.env.TIME_AGO * 60 * 1000);

        return SearchTerm.find({
            $or: [
                { lastScraped: { $exists: false } },
                { lastScraped: { $lte: timeAgo } }
            ]
        })
            .sort({ lastScraped: 1 })
            .limit(1);
    } catch (error) {
        console.error("Error fetching job listings: ", error);
        throw error;
    }
};


const scrapeJobListing = async () => {
    try {
        let searchTermsToScrape = await getJobSearchTermsToScrape();
        if (!searchTermsToScrape || searchTermsToScrape.length === 0) {
            console.log('No Job Search Terms To Scrape');
            return;
        }

        while (searchTermsToScrape && searchTermsToScrape.length > 0) {
            let retries = 0;
            let scraperFailed = false;
            let dataAvailable = true;
            let { _id: searchTermId, term, location, jobType } = searchTermsToScrape[0];

            do {
                try {
                    const { page, browser } = await initializeBrowserAndPage();
                    scraperFailed = await goToURL(page, 'https://www.linkedin.com/jobs/search');
                    if (!scraperFailed) scraperFailed = await acceptCookies(page);
                    if (!scraperFailed) scraperFailed = await insertJob(page, term);
                    if (!scraperFailed) scraperFailed = await insertCountry(page, location);
                    if (!scraperFailed) [scraperFailed, dataAvailable] = await setRemoteWork(page, jobType);
                    if (!scraperFailed && dataAvailable) [scraperFailed, dataAvailable] = await setJobsLast24Hours(page);

                    if (dataAvailable && !scraperFailed) {
                        const scrapedJobListings = await getJobListingData(page);
                        if (scrapedJobListings) {
                            const savedJobListings = await saveToDBJobListing(scrapedJobListings, searchTermId);
                            await updateJobSearchTermsToScrape(savedJobListings, searchTermId);
                        } else {
                            scraperFailed = true;
                        }
                    } else if (!dataAvailable && !scraperFailed) {
                        await updateJobSearchTermsToScrape([], searchTermId);
                    }

                    await browser.close();
                } catch (innerError) {
                    console.error('Inner error during scraping: ', innerError);
                    scraperFailed = true;
                }

                retries++;
                await delay(10000, 20000);
            } while (retries < 3 && scraperFailed);

            searchTermsToScrape = await getJobSearchTermsToScrape();
        }

    } catch (error) {
        console.error('Error Scraping Listing: ', error);
    }
};

// const scrapeJobDescription = async () => {

//     try {
//         const { page, browser } = await initializeBrowserAndPage();
//         let jobsToScrapeDescription = await getJobListingsWithNoDescription();

//         if (!jobsToScrapeDescription || jobsToScrapeDescription.length === 0) {
//             console.log('No Job Descriptions To Scrape');
//             await browser.close();
//             return;
//         }

//         let allDescriptions = [];

//         do {
//             for await (const jobListing of jobsToScrapeDescription) {

//                 await goToURL(page, jobListing.jobURL);
//                 await acceptCookies(page);
//                 const gotDescription = await getJobDescriptionData(page);
//                 allDescriptions.push({ _id: jobListing._id, description: gotDescription.description });

//                 await delay(10000, 20000);
//             }
//             await saveToDBJobDescription(allDescriptions);
//             jobsToScrapeDescription = await getJobListingsWithNoDescription();
//             allDescriptions = [];


//         } while (jobsToScrapeDescription);

//         await delay(10000, 20000);
//         await browser.close();
//     } catch (error) {
//         console.error('Error Scraping Description: ', error);
//     }
// };

const scrapeJobDescription = async () => {
    try {
        let jobsToScrapeDescription = await getJobListingsWithNoDescription();

        if (!jobsToScrapeDescription || jobsToScrapeDescription.length === 0) {
            console.log('No Job Descriptions To Scrape');
            return;
        }

        while (jobsToScrapeDescription.length > 0) {
            let allDescriptions = [];
            for await (const jobListing of jobsToScrapeDescription) {

                try {
                    const { page, browser } = await initializeBrowserAndPage();
                    let scraperFailed = await goToURL(page, jobListing.jobURL);
                    if (!scraperFailed) scraperFailed = await acceptCookies(page);
                    if (!scraperFailed) {
                        const [error, gotDescription] = await getJobDescriptionData(page);
                        scraperFailed = error;
                        if (!scraperFailed) {
                            allDescriptions.push({ _id: jobListing._id, description: gotDescription.description });
                        }
                    }
                    await browser.close();
                    await delay(10000, 20000);
                } catch (innerError) {
                    console.error(`Inner error during scraping job description ${jobListing._id}: `, innerError);
                    if (page) await page.close();
                    if (browser) await browser.close();
                }
            }

            try {
                await saveToDBJobDescription(allDescriptions);
                jobsToScrapeDescription = await getJobListingsWithNoDescription();
            } catch (saveError) {
                console.error('Error saving job descriptions: ', saveError);
            }
        }

    } catch (error) {
        console.error('Error Scraping Description: ', error);
    }
};



module.exports = {
    scrapeJobListing, scrapeJobDescription
};

//? Old stuff

// const divContent = await page.evaluate(() => {
//     const div = document.querySelector('#main-content');
//     return div ? div.innerHTML : 'Div not found';
// });

// fs.writeFile('divContent.html', divContent, 'utf8', (err) => {
//     if (err) {
//         console.error('Error writing file:', err);
//     } else {
//         console.log('File has been saved!');
//     }
// });


// try {
//     // Read the file content synchronously
//     const fileContent = fs.readFileSync('divContent.html', 'utf8');
//     // console.log('File content loaded into variable:', fileContent);
//     await page.setContent(fileContent);
//     // You can now use `fileContent` as needed
// } catch (err) {
//     console.error('Error reading file:', err);
// }



// const element = await page.locator('div.QS5gu.sy4vM').click();
// Target the div inside a button with specific text
// const element = await page.locator('//button//div[text()="Accept all"]').click();
// await page.locator('//button[.//div[contains(@class, "QS5gu") and contains(@class, "sy4vM")]]').click();

// await page.waitForSelector('input[value="Google Search"]');
// await page.click('input.lsb[value="I\'m Feeling Lucky"]');
// await delay(6000, 8000); // Random delay between 1-2 seconds

// await page.click('[aria-label="Stay signed out"]');

// const button = await page.$('button'); // Assuming buttons are in <button> tags
// if (button) {
//     const text = await page.evaluate(el => el.textContent.trim(), button);
//     if (text === 'Stay signed out') {
//         await button.click();
//     }
// }

// const button = await page.$('button'); // Assuming buttons are in <button> tags
// if (button) {
//     console.log('Button found');
//     const text = await page.evaluate(el => el.textContent.trim(), button);
//     console.log(text);
//     if (text === 'Stay signed out') {
//         await button.click();
//     }
// }



// await page.goto('https://www.linkedin.com/jobs/search', {
//     waitUntil: 'networkidle2', // Wait until the network is idle
// });





// console.log('Screenshot taken and browser closed');



// async isSelectorExists(selector: string) {
//     return await this._page.$(selector).catch(() => null) !== null;
//   }



//! Delay Methods

// await page.type('#input-field', 'Hello, world!', { delay: 100 }); // 100ms delay between keystrokes
// await page.keyboard.press('Enter', { delay: 50 }); // 50ms delay

// await page.mouse.click(100, 100, { delay: 100 });

// const moveMouseSmoothly = async (page, startX, startY, endX, endY, duration) => {
//     const steps = 50; // Number of intermediate steps
//     const delay = duration / steps; // Delay between each step
//     const xStep = (endX - startX) / steps;
//     const yStep = (endY - startY) / steps;

//     for (let i = 0; i < steps; i++) {
//         const x = startX + xStep * i;
//         const y = startY + yStep * i;
//         await page.mouse.move(x, y);
//         await new Promise(resolve => setTimeout(resolve, delay));
//     }

//     // Final move to ensure the cursor ends exactly at the destination
//     await page.mouse.move(endX, endY);
// };


// const simulateSmoothScroll = async (page, startY, endY, duration) => {
//     await page.evaluate((startY, endY, duration) => {
//         const start = startY;
//         const end = endY;
//         const startTime = Date.now();
//         const scroll = () => {
//             const currentTime = Date.now();
//             const elapsed = Math.min((currentTime - startTime) / duration, 1);
//             const currentY = start + (end - start) * elapsed;
//             window.scrollTo(0, currentY);
//             if (elapsed < 1) {
//                 requestAnimationFrame(scroll);
//             }
//         };
//         scroll();
//     }, startY, endY, duration);
// };

// await page.keyboard.type(char, { delay: randomDelay(50, 150) }); // Random delay between 50ms and 150ms
