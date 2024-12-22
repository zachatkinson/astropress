import { graphQuery } from "./graphQuery.ts";

type DataItem = {
    [key: string]: any;
    id: string | number;
    parentId: string | number;
    depth?: number; // Add depth property
};

interface HierarchicalOptions {
    idKey?: string;
    parentKey?: string;
    childrenKey?: string;
    depth?: number;
}

const flatListToHierarchical = (
    data: DataItem[] = [],
    { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' }: HierarchicalOptions = {}
): DataItem[] => {
    const tree: DataItem[] = [];
    const childrenOf: { [key: string]: DataItem[] } = {};
    const depthOf: { [key: string]: number } = {}; // To track depth of each item

    data.forEach((item) => {
        const newItem = { ...item };
        const id = newItem[idKey];
        const parentId = newItem[parentKey] || 0;

        newItem.depth = depthOf[parentId] !== undefined ? depthOf[parentId] + 1 : 0;
        depthOf[id] = newItem.depth;

        if (!childrenOf[id]) {
            childrenOf[id] = [];
        }
        newItem[childrenKey] = childrenOf[id];

        if (parentId) {
            if (!childrenOf[parentId]) {
                childrenOf[parentId] = [];
            }
            childrenOf[parentId].push(newItem);
        } else {
            tree.push(newItem);
        }
    });

    return tree;
};

export async function getNavByLocation(location = 'secondary'): Promise<DataItem[]> {
    const res = await graphQuery({
        query: `query getNavByLocation($loc: MenuLocationEnum!) {
            menuItems(first: 100, where: {location: $loc}) {
                items: nodes {
                    databaseId
                    id
                    title: label
                    parentId
                    url
                    uri
                }
            }
        }`,
        variables: { "loc": location.toUpperCase() },
    });

    if (!res || !res.menuItems || !Array.isArray(res.menuItems.items)) {
        throw new Error("Invalid response structure");
    }

    return flatListToHierarchical(res.menuItems.items, {
        idKey: 'id',
        parentKey: 'parentId',
        childrenKey: 'children',
        depth: 0, // Initialize depth as 0
    });
}