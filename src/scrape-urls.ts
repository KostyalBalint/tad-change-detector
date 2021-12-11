import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function scrapeUrls(baseURL: string) {
    const websiteText = await (await fetch(baseURL)).text();
    const website = cheerio.load(websiteText);
    let urls = website('#main > table > tbody > tr').map((index, element) => {
        if (website(element).hasClass('header')) return null;
        return website(element).children().children().first().attr('href');
    });
    return urls.get().filter((url) => url);
}
