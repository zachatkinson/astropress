import {graphQuery} from "./graphQuery.ts";

export interface WordPressPost {
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    }
    featuredImage: {
        altText: string;
        mediaItemUrl: string;
    }
    slug: string;
    id: string;

}

export async function getPosts(postCount:number = 100){
    const res = await graphQuery({
        query: `
            query getPostList($postCount: Int!) {
              posts(first: $postCount) {
                posts: nodes {
                  title(format: RENDERED)
                  content(format: RENDERED)
                  excerpt(format: RENDERED)
                  slug
                  uri
                  featuredImage {
                    image: node {
                      altText
                      mediaItemUrl
                    }
                  }
                }
              }
            }
        `,
        variables: { "postCount": postCount },
    })
    if (!res || !res.posts || !Array.isArray(res.posts.posts)) {
        throw new Error("Invalid response structure");
    }
    return res.posts.posts;

}