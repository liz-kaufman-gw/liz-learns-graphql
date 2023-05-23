import {gql} from 'graphql-request'
import {sendQuery} from './sendQuery'

const query = gql`
{
  countries {
    code
  }
}
`

export async function getAllCountryCodes(){
  const data = await sendQuery(query);
  const codeList = Object.values(data.countries).reduce((acc,cur)=>{
    return [...acc, cur.code]
  }, [])
  return codeList;
}