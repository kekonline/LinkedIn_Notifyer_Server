const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

const delay = async (min = 1000, max = 2000, randomIncrease = 0) => {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, time));
};

(async () => {

    puppeteer.use(stealthPlugin());
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see the browser in action
        args: [
            `--no-sandbox`,
            `--disable-setuid-sandbox`,
            `--proxy-server=http://uk.proxymesh.com:31280`,
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

    await page.goto('https://www.linkedin.com/jobs/search', {
        waitUntil: 'networkidle2', // Wait until the network is idle
    });

    await delay(2000, 3000);
    await page.locator('button.artdeco-button.artdeco-button--inverse.artdeco-button--2.artdeco-button--primary[data-tracking-control-name="ga-cookie.consent.accept.v4"]').click();

    await delay(2000, 3000);
    await page.locator('button.search-bar__placeholder').click();

    await delay(2000, 3000);
    await page.locator('input#job-search-bar-location').click();

    await delay(1000, 2000);

    for (let i = 0; i < 18; i++) {

        await page.keyboard.down('Backspace');

        // Type 'a' while holding down the Shift key
        await delay(200, 500);

        // Release the Shift key







    }


    const text = 'mumbai';
    for (const char of text) {
        await page.type('input#job-search-bar-location', char); // No delay here, we handle it ourselves
        await delay(200, 500, 500); // Variable delay between characters
    }
    await delay(1000, 2000);
    await page.keyboard.press('Enter');

    // await page.type('input#job-search-bar-location', 'mumbai', { delay: 100 });



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



    await delay(100000, 200000); // Random delay between 1-2 seconds


    // await page.goto('https://www.linkedin.com/jobs/search', {
    //     waitUntil: 'networkidle2', // Wait until the network is idle
    // });




    // await browser.close();

    // console.log('Screenshot taken and browser closed');
})();


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