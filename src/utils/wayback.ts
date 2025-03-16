import { getJSON } from 'bimbimba';
import { URL, URLSearchParams } from 'node:url';

type OriginalUrl = string;
type Snapshot = [Timestamp, OriginalUrl, StatusCode];
type StatusCode = string;
type Timestamp = string;

export const fetchSnapshots = async (query: string) => {
    const url = new URL('https://web.archive.org/cdx/search/cdx');
    const searchParams = new URLSearchParams();
    searchParams.set('url', query);
    searchParams.set('output', 'json');
    searchParams.set('fl', 'timestamp,original,statuscode');
    searchParams.set('filter', 'statuscode:200');
    url.search = searchParams.toString();

    const results: Snapshot[] = await getJSON(url.toString());
    const urls = results.slice(1).map((snapshot) => snapshot[1]);

    return new Set(urls);
};
