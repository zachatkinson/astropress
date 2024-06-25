import {graphQuery} from "./graphQuery.ts";

export async function getNavByLocation(location = 'secondary') {
    return await graphQuery({
        query: `
            query getNavByLocation($loc: MenuLocationEnum! = PRIMARY) {
                menus(where: {location: $loc}) {
                    nodes {
                        name
                        slug
                        menuItems {
                                nodes {
                                    uri
                                    url
                                    order
                                    label
                                }
                        }
                    }
                }
            }`,
        variables: {"loc": location.toUpperCase()},
    })
}