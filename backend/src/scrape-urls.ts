import fetch from 'node-fetch';
import cheerio from 'cheerio';

/**
 * Scrape all the TAD's (Subject Data Sheets) URLs from a given URL.
 * @param baseURL The URL to scrape from
 */
export async function scrapeUrls(baseURL: string): Promise<string[]> {
    const websiteText = await (await fetch(baseURL)).text();
    const website = cheerio.load(websiteText);
    let urls = website('#main > table > tbody > tr').map((index, element) => {
        if (website(element).hasClass('header')) return null;
        return website(element).children().children().first().attr('href');
    });
    return urls.get().filter((url) => url);
}
