import cheerio from 'cheerio';
import fetch from 'node-fetch';
import iconv from 'iconv-lite';

const MAX_PARALLEL_REQUESTS = 20;
let parallelRequests = 0;

export function getSubjectWithTextContent(subject: Subject): SubjectWithTextContent {
    const $ = cheerio.load(subject.rawHtml);
    //Copy the subject object
    let withText = Object.assign({}, subject) as SubjectWithTextContent;
    //Remove multiple newlines
    withText.textContent = ($('.subject_datafields').text() ?? '').replace(/\\n/g, '\n').replace(/^\s*[\r\n]/gm, '\n');
    return withText;
}

/**
 * Scrape a given subject from the website
 * @param url The url to scrape from
 */
export async function scrapeSubject(url: string): Promise<Subject> {
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
    let code = $('#main > table:nth-child(8) > tbody > tr:nth-child(2) > td:nth-child(1)').text();
    if (!code) code = url.split('/').reverse()[0]; //Fallback to the last part of the url
    const name = $('#main > p.title').text();
    return {
        url,
        name,
        code,
        rawHtml: htmlContent,
        createdAt: new Date(),
    };
}

/**
 * Scrape all the subjects from the website
 * Only makes requests in parallel if there are less than MAX_PARALLEL_REQUESTS
 * @param siteUrl The base url of the website
 * @param codes The subject codes to scrape
 */
export async function scrapeSubjects(siteUrl: string, codes: string[]): Promise<Subject[]> {
    return await Promise.all(
        codes.map(async (code) => {
            while (parallelRequests >= MAX_PARALLEL_REQUESTS) {
                //Wait until a request is finished
                await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
            }
            parallelRequests++;
            const subject = await scrapeSubject(siteUrl + code);
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
    rawHtml: string;
    createdAt: Date;
};

export type SubjectWithTextContent = Subject & {
    textContent: string;
};
