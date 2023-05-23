import {sendQuery} from './sendQuery'

export async function getCountryInfo(code){
    const query = `
    query GetCountryInfo($code: ID!) {
      country(code: $code) {
        name
        native
        emoji
        languages {
          name
        }
      }
    }
    `

    const variables = {
        code,
    };

    const data = await sendQuery(query, variables);
    return data.country;
}
