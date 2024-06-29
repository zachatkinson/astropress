interface gqlParams {
    query: String;
    variables?: object;
}
export async function graphQuery({query, variables={} }: gqlParams) {
    const response = await fetch(import.meta.env.WP_GRAPHQL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${import.meta.env.USER}:${import.meta.env.PASS}`)}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    })
    if (!response.ok){
        console.error(response);
        return {};
    }

    const{ data } = await response.json();
    return data;
}