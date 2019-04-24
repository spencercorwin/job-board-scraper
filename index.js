const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const prompt = require('prompt');
const utils = require('./utils');

const url = 'https://www.builtinla.com/jobs?f[0]=job-category_developer-engineer-front-end&f[1]=job-category_developer-engineer-javascript&page=';
const baseUrl = 'https://www.builtinla.com';

const builtInLaSearch = async () => {
    try {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        const fourMinInMS = 4*60*100;
        let pageNumber = 0;
        await page.goto(url + page, {timeout: fourMinInMS});
        const html = await page.content();

        const $ = cheerio.load(html);
        const numResults = $('.total_rows').text();
        // Print the number of results for sanity check (for example, should be 183)
        console.log(numResults.substring(0, numResults.length/2));

        // Initiate array of results to eventually filter through
        const resultsArray = [];

        // Get all listings on a page
        while (true) {
            const titles = await page.$$eval('.original .title, .volume .title', titleNodes => {
                const titles = titleNodes.map(title => title.innerText);
                return titles;
            });
            const ids = await page.$$eval('.data-info', idNodes => {
                const ids = idNodes.map(id => id.getAttribute('data-nid'));
                return ids;
            });
            const links = await page.$$eval('.wrap-view-page > a', linkNodes => {
                const links = linkNodes.map(link => link.getAttribute('href'));
                return links;
            });
            if (ids.length === 0) {
                break;
            }
            for (let i = 0; i < ids.length; i++) {
                let newObject = {};
                newObject.title = titles[i];
                newObject.id = ids[i];
                newObject.link = baseUrl + links[i];
                resultsArray.push(newObject);
            };
            pageNumber++;
            await page.goto(url + pageNumber);
        }

        const filteredByTitle = resultsArray.filter(obj => utils.filterByTitle(obj));
        console.log(resultsArray.length);
        console.log(filteredByTitle.length);

        // Copy results to clipboard for copy/paste
        utils.copyToClipboard(JSON.stringify(filteredByTitle));

        // Check URL in DB/text file
        // https://www.builtinla.com/job/engineer/software-engineer/42176
        // If both pass then save title, URL, date accessed in array
        // Press next (wait) and repeat until next button doesn't exist
        // console.log number in array
        // Run links in array through above function

        await browser.close();
    } catch (err) {
        // Need to handle closing browser/Node process if this is ever run without human watching
        console.log(err);
    }
}

builtInLaSearch();