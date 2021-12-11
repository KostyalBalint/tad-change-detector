import { scrapeUrls } from './scrape-urls';
import { scrapeSubjects } from './scrape-subject';

const SITE_URL = 'https://portal.vik.bme.hu';
const ALL_COURSES_URL = `${SITE_URL}/kepzes/targyak/`;

main();

async function main(): Promise<void> {
    const urls = await scrapeUrls(ALL_COURSES_URL);
    const subjects = await scrapeSubjects(SITE_URL, urls);
}
