"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
require("dotenv").config();
const axios = require('axios');
const { URL } = require('url');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');
const delay = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (min = 3000, max = 4000, randomIncrease = 0) {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () { return setTimeout(resolve, time); }));
});
const getPublicIP = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get('https://api.ipify.org?format=json');
        console.log('Your public IP address is:', response.data.ip);
    }
    catch (error) {
        console.error('Error fetching public IP:', error);
    }
});
const initializeBrowserAndPage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        puppeteer.use(stealthPlugin());
        const browser = yield puppeteer.launch({
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
        const pages = yield browser.pages();
        const page = pages[0];
        yield page.setJavaScriptEnabled(true);
        yield page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });
        yield page.authenticate({
            username: process.env.PROXYUSER,
            password: process.env.PROXYPASS,
        });
        // getPublicIP();
        return { page, browser };
    }
    catch (error) {
        console.error('Error Initializing Browser And Page:', error);
        throw new Error('Error Initializing Browser And Page:', error);
    }
});
const goToURL = (page, url) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Navigating To URL:', url);
    const maxRetries = 3;
    let retries = 0;
    while (retries < maxRetries) {
        try {
            yield page.goto(url, {
                waitUntil: 'networkidle2', // Wait until the network is idle
            });
            yield delay(5000, 8000);
            const currentURL = yield page.url();
            if (currentURL.includes(url)) {
                console.log('URL Loaded');
                return false;
            }
            else {
                console.log('Failed To Load URL, Retrying...');
            }
            retries++;
        }
        catch (error) {
            console.log('Error Navigating To URL, Retrying...', error);
            retries++;
            yield delay(5000, 8000);
        }
    }
    console.log('Failed To Load URL After 3 Attempts');
    return true;
});
const acceptCookies = (page) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Checking for Cookie Button:');
    yield delay();
    const cookieButton = yield page.$('button.artdeco-global-alert-action');
    if (!cookieButton) {
        console.log('No Cookie Button Found');
        return;
    }
    console.log('Accepting Cookies');
    yield cookieButton.click();
});
const insertJob = (page, jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Set Job');
        yield delay(4000, 5000);
        if (!(yield page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener'))) {
            console.log('No Job Button Found');
            return true;
        }
        yield page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();
        yield delay();
        for (const char of jobDescription) {
            yield page.type('input[aria-controls="job-search-bar-keywords-typeahead-list"]', char); // No delay here, we handle it ourselves
            yield delay(200, 500, 500); // Variable delay between characters
        }
        yield delay();
        yield page.keyboard.press('Enter');
        return false;
    }
    catch (error) {
        throw new Error('Error Inserting Job:', error);
    }
});
const insertCountry = (page, country) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Set Country');
        yield delay(4000, 5000);
        if (!(yield page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener"]'))) {
            console.log('No Country Button Found');
            return true;
        }
        yield page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();
        yield delay();
        yield page.locator('input[aria-controls="job-search-bar-location-typeahead-list"]').click();
        yield delay();
        for (let i = 0; i < 18; i++) {
            yield page.keyboard.down('Backspace');
            yield delay(200, 500);
        }
        for (const char of country) {
            yield page.type('input[aria-controls="job-search-bar-location-typeahead-list"]', char);
            yield delay(200, 500, 500);
        }
        yield delay();
        yield page.keyboard.press('Enter');
        return false;
    }
    catch (error) {
        throw new Error('Error Inserting Country:', error);
    }
});
const setWorkType = (page, jobType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let jobcode = '';
        switch (jobType) {
            case "remote":
                jobcode = "f_WT-2";
                break;
            case "hybrid":
                jobcode = "f_WT-1";
                break;
            case "on-site":
                jobcode = "f_WT-0";
                break;
        }
        console.log(`Set ${jobType} Work`);
        yield delay(4000, 5000);
        if (!(yield page.$('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]'))) {
            console.log('No Work Type Button Found');
            return [true, null];
        }
        yield page.locator('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]').click();
        yield delay();
        if (yield !page.$(`input#${jobcode}`)) {
            console.log(`No ${jobType} Work Found`);
            return [false, false];
        }
        yield page.locator(`input#${jobcode}`).click();
        yield delay();
        yield page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_WT"]').click();
        return [false, true];
    }
    catch (error) {
        throw new Error(`Error Setting ${jobType} Work:`, error);
    }
});
const setJobsLast24Hours = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Set Last 24 Hour Jobs');
        yield delay(4000, 5000);
        if (!(yield page.$('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]'))) {
            console.log('No Time Frame Button Found');
            return [false, false];
        }
        yield page.locator('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]').click();
        yield delay();
        if (yield !page.$('input#f_TPR-3')) {
            console.log('Jobs In Last 24 Hours Found');
            return [false, false];
        }
        yield page.locator('#f_TPR-3').click();
        yield delay();
        yield page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_TPR"]').click();
        return [false, true];
    }
    catch (error) {
        throw new Error('Error Setting Last 24 Hour Jobs:', error);
    }
});
const getJobListingData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Scraping Job Listing');
    try {
        yield delay(4000, 5000);
        if (!(yield page.$('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li'))) {
            console.log('No Search Results Found');
            return [];
        }
        const gotData = yield page.evaluate(() => {
            const liElements = document.querySelectorAll('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li');
            const result = Array.from(liElements).map(li => {
                var _a, _b, _c, _d, _e, _f;
                const card = li.querySelector('div.base-card');
                return {
                    title: ((_a = card === null || card === void 0 ? void 0 : card.querySelector('h3.base-search-card__title')) === null || _a === void 0 ? void 0 : _a.textContent.trim()) || null,
                    company: ((_b = card === null || card === void 0 ? void 0 : card.querySelector('h4.base-search-card__subtitle a')) === null || _b === void 0 ? void 0 : _b.textContent.trim()) || null,
                    location: ((_c = card === null || card === void 0 ? void 0 : card.querySelector('span.job-search-card__location')) === null || _c === void 0 ? void 0 : _c.textContent.trim()) || null,
                    datePosted: ((_d = card === null || card === void 0 ? void 0 : card.querySelector('time.job-search-card__listdate--new')) === null || _d === void 0 ? void 0 : _d.getAttribute('datetime')) || null,
                    jobURL: ((_e = card === null || card === void 0 ? void 0 : card.querySelector('a.base-card__full-link')) === null || _e === void 0 ? void 0 : _e.href) || null,
                    companyLogo: ((_f = card === null || card === void 0 ? void 0 : card.querySelector('img.artdeco-entity-image')) === null || _f === void 0 ? void 0 : _f.src) || null
                };
            });
            return result;
        });
        console.log('Scraping Job Listing Done Got: ', gotData && gotData.length ? gotData.length : 0);
        return gotData;
    }
    catch (error) {
        throw new Error('Error Getting Data:', error);
    }
});
const getJobDescriptionData = (page) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Scraping Description');
    try {
        yield delay(4000, 5000);
        if (!(yield page.$('div.show-more-less-html__markup'))) {
            console.log('No Description Results Found');
            return [true, null];
        }
        const gotData = yield page.evaluate(() => {
            var _a;
            return {
                description: ((_a = document === null || document === void 0 ? void 0 : document.querySelector('div.show-more-less-html__markup')) === null || _a === void 0 ? void 0 : _a.innerHTML.trim()) || null,
            };
        });
        return [false, gotData];
    }
    catch (error) {
        throw new Error('Error Getting Data:', error);
    }
});
const saveToDBJobListing = (scrapedJobListings, searchTermId) => __awaiter(void 0, void 0, void 0, function* () {
    const joblListingsForDB = scrapedJobListings.filter(jobListing => jobListing.jobURL).map(jobListing => {
        const { title, company, location, jobURL } = jobListing;
        if (!jobURL)
            return;
        const simplifiedURL = (jobURL.split('?')[0] + '/').replace(/https:\/\/[^/]+/, 'https://www.linkedin.com');
        return {
            updateOne: {
                filter: { jobURL: simplifiedURL },
                update: {
                    $set: {
                        title: title ? Buffer.from(title, 'utf-8').toString('utf-8') : null,
                        company: company ? Buffer.from(company, 'utf-8').toString('utf-8') : null,
                        location: location ? Buffer.from(location, 'utf-8').toString('utf-8') : null,
                        jobURL: simplifiedURL,
                        scrapeRetries: 0
                    },
                    $addToSet: {
                        searchTerms: searchTermId
                    }
                },
                upsert: true
            }
        };
    });
    const result = yield JobListing.bulkWrite(joblListingsForDB);
    console.log(`Saved To DB Job Listing: ${result}`);
    return result;
});
const updateJobSearchTermsToScrape = (scrapedJobListings, searchTermId, url) => __awaiter(void 0, void 0, void 0, function* () {
    let jobListingIds = [];
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    params.delete('geoId');
    const updatedUrl = `${parsedUrl.origin}${parsedUrl.pathname}?${params.toString()}`;
    if (scrapedJobListings && scrapedJobListings.upsertedIds) {
        jobListingIds = Object.values(scrapedJobListings.upsertedIds);
    }
    try {
        yield SearchTerm.updateOne({ _id: searchTermId }, {
            $addToSet: { jobListings: { $each: jobListingIds } }, // Add job listing IDs to the array, ensuring no duplicates
            $set: { lastScraped: new Date(), URL: updatedUrl }
        });
        console.log(`Updated Job Search Terms To Scrape: ${jobListingIds.length}`);
    }
    catch (error) {
        console.error("Error updating search terms: ", error);
        throw error;
    }
});
const saveToDBJobDescription = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const dataForDB = data.map(jobListing => {
        const { _id, description, scrapeRetries } = jobListing;
        return {
            updateOne: {
                filter: { _id: _id },
                update: {
                    $set: {
                        description: description ? Buffer.from(description, 'utf-8').toString('utf-8') : null,
                        scrapeRetries: scrapeRetries + 1
                    }
                },
                upsert: true
            }
        };
    });
    const result = yield JobListing.bulkWrite(dataForDB);
});
const getJobListingsWithNoDescription = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobListings = yield JobListing.find({
            $or: [
                { description: { $exists: false } },
                { description: null }
            ],
            scrapeRetries: { $lt: 3 }
        }).limit(10);
        return jobListings;
    }
    catch (error) {
        console.error("Error fetching job listings with no description:", error);
        throw error;
    }
});
const getJobSearchTermsToScrape = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Fetching Job Search Terms To Scrape');
    try {
        const timeAgo = new Date(Date.now() - process.env.TIME_AGO * 60 * 1000);
        return SearchTerm.find({
            $and: [
                {
                    $or: [
                        { lastScraped: { $exists: false } },
                        { lastScraped: { $lte: timeAgo } }
                    ]
                },
                {
                    users: { $exists: true, $ne: [] }
                }
            ]
        })
            .sort({ lastScraped: 1 })
            .limit(1);
    }
    catch (error) {
        console.error("Error fetching job listings: ", error);
        throw error;
    }
});
const scrapeJobListing = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let searchTermsToScrape = yield getJobSearchTermsToScrape();
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
                let page, browser;
                try {
                    const { page: initializedPage, browser: initializedBrowser } = yield initializeBrowserAndPage();
                    page = initializedPage;
                    browser = initializedBrowser;
                    scraperFailed = yield goToURL(page, searchTermsToScrape[0].URL ? searchTermsToScrape[0].URL : 'https://www.linkedin.com/jobs/search');
                    if (!searchTermsToScrape[0].URL) {
                        if (!scraperFailed)
                            scraperFailed = yield acceptCookies(page);
                        if (!scraperFailed)
                            scraperFailed = yield insertJob(page, term);
                        if (!scraperFailed)
                            scraperFailed = yield insertCountry(page, location);
                        if (!scraperFailed)
                            [scraperFailed, dataAvailable] = yield setWorkType(page, jobType);
                        if (!scraperFailed && dataAvailable)
                            [scraperFailed, dataAvailable] = yield setJobsLast24Hours(page);
                    }
                    if (dataAvailable && !scraperFailed) {
                        const scrapedJobListings = yield getJobListingData(page);
                        if (scrapedJobListings) {
                            const savedJobListings = yield saveToDBJobListing(scrapedJobListings, searchTermId);
                            yield updateJobSearchTermsToScrape(savedJobListings, searchTermId, page.url());
                        }
                        else {
                            scraperFailed = true;
                        }
                    }
                    else if (!dataAvailable && !scraperFailed) {
                        yield updateJobSearchTermsToScrape([], searchTermId, page.url());
                    }
                    if (browser)
                        yield browser.close();
                }
                catch (innerError) {
                    console.error('Inner error during scraping: ', innerError);
                    if (page)
                        yield page.close();
                    if (browser)
                        yield browser.close();
                    scraperFailed = true;
                }
                retries++;
                yield delay(10000, 20000); // Random delay between retries
            } while (retries < 3 && scraperFailed);
            // Fetch new search terms for the next iteration
            searchTermsToScrape = yield getJobSearchTermsToScrape();
        }
    }
    catch (error) {
        console.error('Error Scraping Listing: ', error);
    }
});
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
const scrapeJobDescription = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let jobsToScrapeDescription = yield getJobListingsWithNoDescription();
        if (!jobsToScrapeDescription || jobsToScrapeDescription.length === 0) {
            console.log('No Job Descriptions To Scrape');
            return;
        }
        while (jobsToScrapeDescription.length > 0) {
            let allDescriptions = [];
            try {
                for (var _d = true, jobsToScrapeDescription_1 = (e_1 = void 0, __asyncValues(jobsToScrapeDescription)), jobsToScrapeDescription_1_1; jobsToScrapeDescription_1_1 = yield jobsToScrapeDescription_1.next(), _a = jobsToScrapeDescription_1_1.done, !_a; _d = true) {
                    _c = jobsToScrapeDescription_1_1.value;
                    _d = false;
                    const jobListing = _c;
                    let browser;
                    try {
                        const { page, browser: initializedBrowser } = yield initializeBrowserAndPage();
                        browser = initializedBrowser;
                        let scraperFailed = yield goToURL(page, jobListing.jobURL);
                        if (!scraperFailed)
                            scraperFailed = yield acceptCookies(page);
                        if (!scraperFailed) {
                            const [error, gotDescription] = yield getJobDescriptionData(page);
                            scraperFailed = error;
                            if (!scraperFailed) {
                                allDescriptions.push({ _id: jobListing._id, description: gotDescription.description, scrapeRetries: jobListing.scrapeRetries });
                            }
                            else {
                                allDescriptions.push({ _id: jobListing._id, description: null, scrapeRetries: jobListing.scrapeRetries });
                            }
                        }
                        yield browser.close();
                        yield delay(10000, 20000);
                    }
                    catch (innerError) {
                        console.error(`Inner error during scraping job description ${jobListing._id}: `, innerError);
                        if (browser) {
                            yield browser.close();
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = jobsToScrapeDescription_1.return)) yield _b.call(jobsToScrapeDescription_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                yield saveToDBJobDescription(allDescriptions);
                jobsToScrapeDescription = yield getJobListingsWithNoDescription();
            }
            catch (saveError) {
                console.error('Error saving job descriptions: ', saveError);
            }
        }
    }
    catch (error) {
        console.error('Error Scraping Description: ', error);
    }
});
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
