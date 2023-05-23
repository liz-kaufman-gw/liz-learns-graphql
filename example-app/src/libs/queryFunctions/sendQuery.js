import {request} from 'graphql-request'

export async function sendQuery(query, variables) {
    const data = await request('https://countries.trevorblades.com', query, variables);
    return data;
}
