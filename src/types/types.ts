// src/types.ts
export type DataItem = {
    id: string | number;
    title: string;
    parentId?: string | number;
    url?: string;
    children?: DataItem[];
};