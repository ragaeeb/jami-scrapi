export type Transcript = {
    content?: string;
    file: string;
};

export type Page = {
    audioFile?: string;
    content: string;
    title: string;
    transcript?: Transcript;
};
