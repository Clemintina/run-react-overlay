export interface NameHistory {
    name: string;
    changedToAt?: number;
}

export interface PlayerDB {
    code: string;
    message: string;
    data: {
        player: {
            meta: {
                name_history: NameHistory[];
            };
            username: string;
            id: string;
            raw_id: string;
            avatar: string;
        };
    };
    success: boolean;
}
