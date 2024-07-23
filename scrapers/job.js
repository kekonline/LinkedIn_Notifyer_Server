const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const { asyncDisposeSymbol } = require('puppeteer');


const delay = async (min = 2000, max = 3000, randomIncrease = 0) => {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, time));
};

const initializeBrowserAndPage = async () => {

    puppeteer.use(stealthPlugin());
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see the browser in action
        args: [
            `--no-sandbox`,
            `--disable-setuid-sandbox`,
            `--proxy-server=http://fr.proxymesh.com:31280`,
            `--auto-open-devtools-for-tabs`
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

    // If your proxy requires authentication, you can set it like this:
    // await page.authenticate({
    //     username: 'your-proxy-username', // Replace with your proxy username
    //     password: 'your-proxy-password', // Replace with your proxy password
    // });

    return { page };
}

const goToURL = async (page) => {
    await page.goto('https://www.linkedin.com/jobs/search', {
        waitUntil: 'networkidle2', // Wait until the network is idle
    });


    const currentURL = await page.url();
    console.log(`Current URL: ${currentURL}`);
    if (!currentURL.includes('jobs/search')) {
        await delay();
        await page.goto('https://www.linkedin.com/jobs/search', {
            waitUntil: 'networkidle2', // Wait until the network is idle
        });
    }

}


(async () => {

    const { page } = await initializeBrowserAndPage();
    goToURL(page);


    try {
        await delay();
        await page.locator('button.artdeco-global-alert-action').click();
    } catch (err) {
        console.log('No cookie');
    }

    await delay();
    await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();

    await delay();

    const jodDescription = 'nodejs';
    for (const char of jodDescription) {
        await page.type('input[aria-controls="job-search-bar-keywords-typeahead-list"]', char); // No delay here, we handle it ourselves
        await delay(200, 500, 500); // Variable delay between characters
    }
    await delay();
    await page.keyboard.press('Enter');

    await delay();
    await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();

    await delay();
    await page.locator('input[aria-controls="job-search-bar-location-typeahead-list"]').click();

    await delay();

    for (let i = 0; i < 18; i++) {
        await page.keyboard.down('Backspace');
        await delay(200, 500);
    }

    const text = 'new york';
    for (const char of text) {
        await page.type('input[aria-controls="job-search-bar-location-typeahead-list"]', char); // No delay here, we handle it ourselves
        await delay(200, 500, 500); // Variable delay between characters
    }
    await delay();
    await page.keyboard.press('Enter');




    console.log('remote');
    await delay();
    await page.locator('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]').click();
    await delay();
    await page.locator('#f_WT-2').click();
    await delay();
    await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_WT"]').click();


    console.log('date');
    await delay();
    await page.locator('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]').click();
    await delay();
    await page.locator('#f_TPR-3').click();
    await delay();
    await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_TPR"]').click();


    await delay(3000, 5000);

    console.log('scraping...');
    const items = await page.evaluate(() => {
        const liElements = document.querySelectorAll('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li');
        const result = Array.from(liElements).map(li => {
            const card = li.querySelector('div.base-card');

            return {
                title: card?.querySelector('h3.base-search-card__title')?.textContent.trim() || 'N/A',
                company: card?.querySelector('h4.base-search-card__subtitle a')?.textContent.trim() || 'N/A',
                location: card?.querySelector('span.job-search-card__location')?.textContent.trim() || 'N/A',
                datePosted: card?.querySelector('time.job-search-card__listdate--new')?.getAttribute('datetime') || 'N/A',
                jobLink: card?.querySelector('a.base-card__full-link')?.href || 'N/A',
                companyLogo: card?.querySelector('img.artdeco-entity-image')?.src || 'N/A'
            };
        });
        return result;
    });

    console.log(items);











    await delay(100000, 200000); // Random delay between 1-2 seconds


    // await browser.close();

})();

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