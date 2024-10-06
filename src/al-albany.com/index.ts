import { URL, URLSearchParams } from 'url';

import { getDOM } from '../utils/network';
import { timeToSeconds } from '../utils/textUtils';

export enum SpeakerId {
    AbuLayla = 'abulaila',
    Halabi = 'halabi',
    Questioner = 'questioner',
    Shaykh = 'sheikh',
    Student = 'student',
}

export type Speaker = {
    id: SpeakerId;
    name: string;
};

export type Content = {
    speaker: Speaker;
    text: string;
};

export type Audio = {
    content: Content[];
    file: string;
    tape: string;
    tapeNumber: string;
    timestamp: number;
    title: string;
};

export const getAudio = async (id: number): Promise<Audio> => {
    const $ = await getDOM(`https://www.al-albany.com/audios/content/${id}/1`);
    const title = $('meta[property="og:title"]').attr('content')?.trim() as string;
    const file = $('audio').attr('src') as string;
    const { hash } = new URL(file);
    const formattedTimestamp = new URLSearchParams(hash.slice(1)).get('t') as string;
    const tape = $('.content-details a:nth-of-type(1)').text().trim();
    const tapeNumber = $('.content-details li:contains("شريط") a[href*="tape"]').text().trim();

    const content: Content[] = [];
    $('#contentText span').each((i, span) => {
        const speakerClass = $(span).attr('class')?.trim();

        if (speakerClass) {
            const speaker: SpeakerId = speakerClass as SpeakerId;
            const speakerName = $(span).text();
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
                    speaker: { id: speaker, name: speakerName },
                    text: texts.join(' '),
                });
            }
        }
    });

    return {
        content,
        file,
        tape,
        tapeNumber,
        timestamp: timeToSeconds(formattedTimestamp),
        title,
    };
};
