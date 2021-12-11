import { scrapeUrls } from './scrape-urls';

const SITE_URL = 'https://portal.vik.bme.hu';
const ALL_COURSES_URL = `${SITE_URL}/kepzes/targyak/`;

main();

async function main(): Promise<void> {
    const urls = await scrapeUrls(ALL_COURSES_URL);
    console.log(urls[0]);
}
