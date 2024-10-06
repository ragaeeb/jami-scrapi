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
