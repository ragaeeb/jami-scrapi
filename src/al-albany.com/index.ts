import { CheerioAPI } from 'cheerio';
import { URL, URLSearchParams } from 'url';

import { getDOM } from '../utils/network';
import { timeToSeconds } from '../utils/textUtils';
import { Audio, Content, SpeakerId } from './types';

const collectContent = ($: CheerioAPI) => {
    const content: Content[] = [];
    $('#contentText span').each((i, span) => {
        const speakerClass = $(span).attr('class');

        if (speakerClass) {
            const texts: string[] = [];

            // Traverse through the parent and subsequent siblings
            $(span)
                .parent()
                .contents()
                .each((_, elem) => {
                    // Skip the current span (speaker)
                    if ($(elem).is('span')) {
                        return;
                    }

                    const line = $(elem).text().trim();

                    if (line) {
                        texts.push($(elem).text().trim());
                    }
                });

            // Push the content into the array if there is text
            if (texts.length) {
                content.push({
                    speaker: { id: speakerClass as SpeakerId, name: $(span).text() },
                    text: texts.join(' '),
                });
            }
        }
    });

    return content;
};

const parseTimestamp = (file: string): number => {
    const { hash } = new URL(file);
    const formattedTimestamp = new URLSearchParams(hash.slice(1)).get('t') as string;

    return timeToSeconds(formattedTimestamp);
};

export const getAudio = async (id: number): Promise<Audio> => {
    const $ = await getDOM(`https://www.al-albany.com/audios/content/${id}/1`);
    const title = $('meta[property="og:title"]').attr('content')?.trim() as string;
    const file = $('audio').attr('src') as string;
    const tape = $('.content-details a:nth-of-type(1)').text().trim();
    const tapeNumber = $('.content-details li:contains("شريط") a[href*="tape"]').text().trim();

    if (!title && !file && !tape && !tapeNumber) {
        throw new Error(`Audio ${id} not found`);
    }

    return {
        content: collectContent($),
        file,
        tape,
        tapeNumber,
        timestamp: parseTimestamp(file),
        title,
    };
};

export * from './types';
