import cheerio from 'cheerio';
import fetch from 'node-fetch';

const MAX_PARALLEL_REQUESTS = 50;
let parallelRequests = 0;

/**
 * Scrape a given subject from the website
 * @param url The url to scrape from
 */
async function scrapeSubject(url: string): Promise<Subject> {
    const htmlContent = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(htmlContent);
    //Remove all the comments from the html
    $.root()
        .find('*')
        .contents()
        .filter(function () {
            return this.type === 'comment';
        })
        .remove();
    const code = $('#main > table:nth-child(8) > tbody > tr:nth-child(2) > td:nth-child(1)').text();
    const name = $('#main > p.title').text();
    const htmlDataFields = $('.subject_datafields').html() ?? '';
    return {
        name,
        code,
        htmlDataFields,
    };
}

/**
 * Scrape all the subjects from the website
 * Only makes requests in parallel if there are less than MAX_PARALLEL_REQUESTS
 * @param siteUrl The base url of the website
 * @param urls The url list
 */
export async function scrapeSubjects(siteUrl: string, urls: string[]): Promise<Subject[]> {
    return await Promise.all(
        urls.map(async (url) => {
            while (parallelRequests >= MAX_PARALLEL_REQUESTS) {
                //Wait until a request is finished
                await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
            }
            parallelRequests++;
            const subject = await scrapeSubject(siteUrl + url);
            parallelRequests--;
            return subject;
        }),
    );
}

export type Subject = {
    name: string;
    code: string;
    htmlDataFields: string;
};
