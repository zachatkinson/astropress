// src/types.ts
export type DataItem = {
    id: string | number;
    title: string;
    parentId?: string | number;
    url?: string;
    uri?: string;
    children?: DataItem[];
    depth?: number;
};