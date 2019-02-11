export interface History {
    push(path: string): void;
    goBack(): void;
    location: {
        pathname: string;
    }
}

export interface Location {
    search: string;
}

export interface Match {
    url: string;
    path: string;
}