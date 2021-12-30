import fetch from 'node-fetch';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { getSubjectFileNames } from './subjectState';

/**
 * Scrape all the TAD's (Subject Data Sheets) URLs from a given URL.
 * @param baseURL The URL to scrape from
 */
export async function scrapeUrls(baseURL: string): Promise<SubjectURL[]> {
    const htmlBuffer = await fetch(baseURL).then((res) => res.buffer());
    //Convert to UTF-8
    const htmlContent = iconv.decode(htmlBuffer, 'ISO-8859-2');
    const website = cheerio.load(htmlContent);

    let urls = website('#main > table > tbody > tr').map((index, element) => {
        if (website(element).hasClass('header')) return null;
        const code = website(element).find('td:nth-child(1)').children().first().text();
        return {
            code,
            name: website(element).find('td:nth-child(2)').children().first().text(),
            department: website(element).find('td:nth-child(3)').children().first().text(),
            credits: Number.parseInt(website(element).find('td:nth-child(4)').first().text()),
            stateCount: getSubjectFileNames(code).length,
        };
    });
    return urls.get().filter((url) => url);
}

export type SubjectURL = {
    code: string;
    name: string;
    department: string;
    credits: number;
    stateCount: number;
};
