import cheerio from 'cheerio';
import fetch from 'node-fetch';
import iconv from 'iconv-lite';

const MAX_PARALLEL_REQUESTS = 50;
let parallelRequests = 0;

/**
 * Scrape a given subject from the website
 * @param url The url to scrape from
 */
async function scrapeSubject(url: string): Promise<Subject> {
    const htmlBuffer = await fetch(url).then((res) => res.buffer());
    //Convert to UTF-8
    const htmlContent = iconv.decode(htmlBuffer, 'ISO-8859-2');

    const $ = cheerio.load(htmlContent);
    //Remove all the comments from the html
    $.root()
        .find('*')
        .contents()
        .filter(function () {
            return this.type === 'comment' || this.type === 'style' || this.type === 'script';
        })
        .remove();
    const code = $('#main > table:nth-child(8) > tbody > tr:nth-child(2) > td:nth-child(1)').text();
    const name = $('#main > p.title').text();
    const htmlDataFields = ($('.subject_datafields').text() ?? '').replace(/\\n/g, '\n').replace(/^\s*[\r\n]/gm, '\n'); //Remove multiple newlines
    return {
        url,
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
    //The url of the subject in https://portal.vik.bme.hu/ website
    url: string;
    htmlDataFields: string;
};
