import { getURLs, refreshURLsCache, SubjectURL } from './scrape-urls';
import { getSubjectWithTextContent, scrapeSubjects, Subject, SubjectWithTextContent } from './scrape-subject';
import express from 'express';
import { getSubjectFileNames, getSubjectState, getSubjectStateFromFile, saveSubjectState } from './subjectState';
import { handleChanged } from './handleChanged';
const app = express();

const SITE_URL = 'https://portal.vik.bme.hu';
const COURSES_URL = `${SITE_URL}/kepzes/targyak/`;

main();

async function run() {
    await refreshURLsCache(COURSES_URL);

    console.log('Scraping subjects...');
    console.time('scrape-subjects');

    //Scrape all the subjects
    const digests = await getURLs(COURSES_URL);
    const subjects = await scrapeSubjects(COURSES_URL, digests.map((c) => c.code).slice(0, 10));

    //Check if any of them changed
    await Promise.all(
        subjects.map(async (subject) => {
            const currentState = await getSubjectState(subject.code);
            if (currentState) {
                if (currentState.rawHtml !== subject.rawHtml) {
                    //For the changed ones, send an email, and save the new state
                    await handleChanged(currentState, subject);
                } else {
                    //console.log(`(${subject.code}) not changed`);
                }
            } else {
                if (!subject.code) {
                    console.log(subject);
                }
                await saveSubjectState(subject);
                console.log(`(${subject.code}) newly added`);
            }
        }),
    );
    console.log('Scrape complete');
    console.timeEnd('scrape-subjects');
}

async function main(): Promise<void> {
    await run();
    //setInterval(run, 1000 * 60 * 60);
}

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.redirect('/subjects');
});

app.get('/subjects', async (req, res) => {
    res.json({
        data: await getURLs(COURSES_URL),
    } as SubjectsResponse);
});

export interface SubjectsResponse {
    data: SubjectURL[];
}

app.get('/subjects/:id', async (req, res) => {
    let oldCode = req.query.oldCode;
    let newCode = req.query.newCode;
    let code = req.params.id;
    console.log(`oldCode: ${oldCode} newCode: ${newCode} code: ${code}`);
    if (oldCode && newCode && typeof oldCode === 'string' && typeof newCode === 'string') {
        let oldSubject = await getSubjectStateFromFile(
            code,
            oldCode.replace(/\//g, '').replace(/\.\./g, '').toUpperCase(),
        );
        let newSubject = await getSubjectStateFromFile(
            code,
            newCode.replace(/\//g, '').replace(/\.\./g, '').toUpperCase(),
        );
        if (oldSubject && newSubject) {
            res.json({
                data: {
                    old: getSubjectWithTextContent(oldSubject),
                    new: getSubjectWithTextContent(newSubject),
                },
            } as SubjectResponse);
        } else {
            res.json({
                error: 'Old or new subject not found',
            } as SubjectResponse);
        }
    } else {
        res.json({
            error: 'Missing oldCode or newCode parameter',
        } as SubjectResponse);
    }
});

export interface SubjectResponse {
    data: {
        old?: SubjectWithTextContent;
        new?: SubjectWithTextContent;
    };
    error?: string;
}

app.get('/subjects/saves/:id', async (req, res) => {
    let code = req.params.id as string;
    let states = await getSubjectFileNames(code);
    if (states) {
        res.json({
            data: {
                states,
            },
        } as SubjectSavesResponse);
    } else {
        res.json({
            error: `No saved states found for subject ${code}`,
        } as SubjectSavesResponse);
    }
});

export interface SubjectSavesResponse {
    data: {
        states?: string[];
    };
    error?: string;
}
