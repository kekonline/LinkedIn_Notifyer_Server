import dotenv from 'dotenv';
import axios from 'axios';
import { URL } from 'url';
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { JobListing } from '../job-listing/schemas/job-listing.schema';
import { SearchTerm } from '../search-term/schemas/search-term.schema';
import { Page } from 'puppeteer';
import { Types } from 'mongoose';

dotenv.config();

interface ProtoJobListing {
    title: string | null;
    company: string | null;
    location: string | null;
    datePosted: string | null;
    jobURL: string | null;
    companyLogo: string | null;
}

interface ProtoDescription {
    _id: Types.ObjectId;
    description: string | null;
    scrapeRetries: number;
}

const delay = async (min = 3000, max = 4000, randomIncrease = 0) => {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise(async (resolve) => setTimeout(resolve, time));
};

// const getPublicIP = async () => {
//     try {
//         const response = await axios.get('https://api.ipify.org?format=json',);

//         console.log('Your public IP address is:', response.data.ip);
//     } catch (error) {
//         console.error('Error fetching public IP:', error);
//     }
// }

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
            delete (navigator as any).__proto__.webdriver;
        });

        await page.authenticate({
            username: process.env.PROXYUSER as string,
            password: process.env.PROXYPASS as string,
        });

        // getPublicIP();

        return { page, browser };
    } catch (error) {

        console.error('Error Initializing Browser And Page:', error);
        throw new Error(`Error Initializing Browser And Page: ${error}`);
    }
}

const goToURL = async (page: Page, url: string): Promise<boolean> => {
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


const acceptCookies = async (page: Page): Promise<boolean> => {
    console.log('Checking for Cookie Button:');

    await delay();
    const cookieButton = await page.$('button.artdeco-global-alert-action');
    if (!cookieButton) {
        console.log('No Cookie Button Found');
        return true;
    }

    console.log('Accepting Cookies');
    await cookieButton.click();
    return false

    // console.log('Checking for Cookie Button:');
    // try {
    //     await delay();
    //     const cookieButton = await page.$('button.artdeco-global-alert-action');
    //     if (!cookieButton) {
    //         console.log('No Cookie Button Found');
    //         return false;
    //     }

    //     console.log('Accepting Cookies');
    //     await cookieButton.click();
    //     return true
    // } catch (error) {
    //     throw new Error(`Error Accepting Cookies: ${error}`);
    // }


};

const insertJob = async (page: Page, jobDescription: string): Promise<boolean> => {
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
        throw new Error(`Error Inserting Job: ${error}`);
    }
}

const insertCountry = async (page: Page, country: string): Promise<boolean> => {
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
        throw new Error(`Error Inserting Country: ${error}`);
    }


}

const setWorkType = async (page: Page, jobType: string): Promise<[boolean, boolean]> => {
    try {

        let jobcode = '';
        switch (jobType) {
            case "remote":
                jobcode = "f_WT-2"
                break;
            case "hybrid":
                jobcode = "f_WT-1"
                break;
            case "on-site":
                jobcode = "f_WT-0"
                break;
        }

        console.log(`Set ${jobType} Work`);
        await delay(4000, 5000);
        if (!(await page.$('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]'))) {
            console.log('No Work Type Button Found');
            return [true, false]
        }
        await page.locator('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]').click();
        await delay();
        if (await !page.$(`input#${jobcode}`)) {
            console.log(`No ${jobType} Work Found`);
            return [false, false]
        }
        await page.locator(`input#${jobcode}`).click();
        await delay();
        await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_WT"]').click();
        return [false, true]
    } catch (error) {
        throw new Error(`Error Setting ${jobType} Work: ${error}`);
    }
}

const setJobsLast24Hours = async (page: Page) => {
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
        throw new Error(`Error Setting Last 24 Hour Jobs: ${error}`);
    }
}

const getJobListingData = async (page: Page) => {
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
                const anchorElement = card?.querySelector('a.base-card__full-link') as HTMLAnchorElement | null;
                const imgElement = card?.querySelector('img.artdeco-entity-image') as HTMLImageElement | null;

                return {
                    title: card?.querySelector('h3.base-search-card__title')?.textContent?.trim() || null,
                    company: card?.querySelector('h4.base-search-card__subtitle a')?.textContent?.trim() || null,
                    location: card?.querySelector('span.job-search-card__location')?.textContent?.trim() || null,
                    datePosted: card?.querySelector('time.job-search-card__listdate--new')?.getAttribute('datetime') || null,
                    jobURL: anchorElement?.href || null,
                    companyLogo: imgElement?.src || null
                };
            });

            return result;
        });
        console.log('Scraping Job Listing Done Got: ', gotData && gotData.length ? gotData.length : 0);
        return gotData;
    } catch (error) {
        throw new Error(`Error Getting Data: ${error}`);
    }
}

const getJobDescriptionData = async (page: Page): Promise<[boolean, { description: string | null } | null]> => {
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
        throw new Error(`Error Getting Data: ${error}`);
    }
}

const saveToDBJobListing = async (scrapedJobListings: ProtoJobListing[], searchTermId: Types.ObjectId) => {
    const joblListingsForDB = scrapedJobListings.filter(jobListing => jobListing.jobURL).map(jobListing => {
        const { title, company,/* location,*/ jobURL } = jobListing;

        if (!jobURL) return;

        const simplifiedURL = (jobURL.split('?')[0] + '/').replace(/https:\/\/[^/]+/, 'https://www.linkedin.com');
        return {
            updateOne: {
                filter: { jobURL: simplifiedURL },
                update: {
                    $set: {
                        title: title ? Buffer.from(title, 'utf-8').toString('utf-8') : null,
                        company: company ? Buffer.from(company, 'utf-8').toString('utf-8') : null,
                        // location: location ? Buffer.from(location, 'utf-8').toString('utf-8') : null,
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
    })

    // .filter((operation): operation is { updateOne: { filter: { jobURL: string }; update: any; upsert: boolean } } => operation !== undefined); // Filter out undefined


    const result = await JobListing.bulkWrite(joblListingsForDB as any);
    console.log(`Saved To DB Job Listing: ${result}`);
    return result;
}

interface ScrapedJobListingsResult {
    upsertedIds: { [key: string]: string }; // or more specific if you know the structure
}
const updateJobSearchTermsToScrape = async (
    scrapedJobListings: ScrapedJobListingsResult | undefined, // Change the type here
    searchTermId: Types.ObjectId,
    url: string
) => {
    let jobListingIds: string[] = [];

    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);

    params.delete('geoId');

    const updatedUrl = `${parsedUrl.origin}${parsedUrl.pathname}?${params.toString()}`;

    // Access upsertedIds directly from the result
    if (scrapedJobListings && scrapedJobListings.upsertedIds) {
        jobListingIds = Object.values(scrapedJobListings.upsertedIds);
    }

    try {
        await SearchTerm.updateOne(
            { _id: searchTermId },
            {
                $addToSet: { jobListings: { $each: jobListingIds } }, // Add job listing IDs to the array, ensuring no duplicates
                $set: { lastScraped: new Date(), URL: updatedUrl }
            }
        );
        console.log(`Updated Job Search Terms To Scrape: ${jobListingIds.length}`);
    } catch (error) {
        console.error("Error updating search terms: ", error);
        throw error;
    }
};



const saveToDBJobDescription = async (data: ProtoDescription[]) => {
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
    const result = await JobListing.bulkWrite(dataForDB);
}

const getJobListingsWithNoDescription = async () => {
    try {
        const jobListings = await JobListing.find({
            $or: [
                { description: { $exists: false } },
                { description: null }
            ],
            scrapeRetries: { $lt: 3 }
        }).limit(10);
        return jobListings;
    } catch (error) {
        console.error("Error fetching job listings with no description:", error);
        throw error;
    }
};

const getJobSearchTermsToScrape = async () => {
    console.log('Fetching Job Search Terms To Scrape');
    try {
        const timeAgo = new Date(Date.now() - Number(process.env.TIME_AGO) * 60 * 1000);

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

    } catch (error) {
        console.error("Error fetching job listings: ", error);
        throw error;
    }
};


export const scrapeJobListing = async () => {
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
                let page, browser;
                try {

                    const { page: initializedPage, browser: initializedBrowser } = await initializeBrowserAndPage();
                    page = initializedPage;
                    browser = initializedBrowser;

                    scraperFailed = await goToURL(page, searchTermsToScrape[0].URL ? searchTermsToScrape[0].URL : 'https://www.linkedin.com/jobs/search');
                    if (!searchTermsToScrape[0].URL) {
                        if (!scraperFailed) scraperFailed = await acceptCookies(page);
                        if (!scraperFailed) scraperFailed = await insertJob(page, term);
                        if (!scraperFailed) scraperFailed = await insertCountry(page, location);
                        if (!scraperFailed) [scraperFailed, dataAvailable] = await setWorkType(page, jobType as string);
                        if (!scraperFailed && dataAvailable) [scraperFailed, dataAvailable] = await setJobsLast24Hours(page);
                    }
                    if (dataAvailable && !scraperFailed) {
                        const scrapedJobListings: ProtoJobListing[] = await getJobListingData(page);
                        if (scrapedJobListings) {
                            const savedJobListings = await saveToDBJobListing(scrapedJobListings, searchTermId);
                            await updateJobSearchTermsToScrape(savedJobListings, searchTermId, page.url());
                        } else {
                            scraperFailed = true;
                        }
                    } else if (!dataAvailable && !scraperFailed) {
                        await updateJobSearchTermsToScrape(undefined, searchTermId, page.url());
                    }
                    if (browser) await browser.close();
                } catch (innerError) {
                    console.error('Inner error during scraping: ', innerError);
                    if (page) await page.close();
                    if (browser) await browser.close();
                    scraperFailed = true;
                }

                retries++;
                await delay(10000, 20000); // Random delay between retries
            } while (retries < 3 && scraperFailed);

            // Fetch new search terms for the next iteration
            searchTermsToScrape = await getJobSearchTermsToScrape();
        }

    } catch (error) {
        console.error('Error Scraping Listing: ', error);
    }
};

export const scrapeJobDescription = async () => {
    try {
        let jobsToScrapeDescription = await getJobListingsWithNoDescription();

        if (!jobsToScrapeDescription || jobsToScrapeDescription.length === 0) {
            console.log('No Job Descriptions To Scrape');
            return;
        }

        while (jobsToScrapeDescription.length > 0) {
            let allDescriptions: ProtoDescription[] = [];
            for await (const jobListing of jobsToScrapeDescription) {
                let browser;
                try {
                    const { page, browser: initializedBrowser } = await initializeBrowserAndPage();
                    browser = initializedBrowser;
                    let scraperFailed = await goToURL(page, jobListing.jobURL);
                    if (!scraperFailed) scraperFailed = await acceptCookies(page);
                    if (!scraperFailed) {
                        const [error, gotDescription] = await getJobDescriptionData(page);
                        scraperFailed = error ? true : false;
                        if (!scraperFailed) {
                            allDescriptions.push({ _id: jobListing._id, description: gotDescription && gotDescription.description ? gotDescription.description : null, scrapeRetries: jobListing.scrapeRetries });
                        } else {
                            allDescriptions.push({ _id: jobListing._id, description: null, scrapeRetries: jobListing.scrapeRetries });
                        }
                    }
                    await browser.close();
                    await delay(10000, 20000);
                } catch (innerError) {
                    console.error(`Inner error during scraping job description ${jobListing._id}: `, innerError);
                    if (browser) {
                        await browser.close();
                    }
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




exports = {
    scrapeJobListing, scrapeJobDescription
};
