import { Transcript } from './types';
import log from './utils/logger.js';
import { parsePlaylistPage, parseSpeakerPage } from './utils/parser';
import { loadProgress, saveProgress } from './utils/progressTracking';
import { crawlAndCollectUrls, getTranscriptForMedia } from './utils/scraping';

export const getAllMediaUrlsForPlaylist = async (url: string): Promise<string[]> => {
    return crawlAndCollectUrls(url, parsePlaylistPage);
};

/**
 * Gets all the playlists for a speaker.
 * @param url The url to the speaker's page
 * @example https://baheth.ieasybooks.com/en/speakers/mansur
 * @returns A map of URLs to the name of the playlist.
 */
export const getAllPlaylistUrlsForSpeaker = async (url: string): Promise<string[]> => {
    let result: string[] | undefined;

    try {
        const cached = await loadProgress(`playlists/${url}`);

        if (cached) {
            return cached as string[];
        }

        result = await crawlAndCollectUrls(url, parseSpeakerPage);
        return result;
    } catch (err: any) {
        result = err.progressData;
        throw err;
    } finally {
        if (result) {
            await saveProgress(`playlists/${url}`, result);
        }
    }
};

export const getAllMediaUrlsForSpeaker = async (url: string): Promise<string[]> => {
    const playlistUrls = await getAllPlaylistUrlsForSpeaker(url);

    log.info(`${playlistUrls.length} playlists collected`);

    const result: string[] = [];

    for (const playlistUrl of playlistUrls) {
        const mediaUrls = await getAllMediaUrlsForPlaylist(playlistUrl);
        result.push(...mediaUrls);

        log.info(`${mediaUrls.length} media urls found for ${playlistUrl}`);
    }

    return result;
};

export const getMediaTranscript = async (url: string): Promise<Transcript> => {
    return getTranscriptForMedia(url);
};
