import { useEffect, useState } from 'react'
import { getCountryInfo } from '../../libs/queryFunctions/getCountryInfo'

const CountryInfoDisplay = ({code}) => {
    const [country, setCountry] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        async function populateCountryInfo(){
            const data = await getCountryInfo(code)
            setCountry(data)
            setLoading(false)
            console.log()
        } 
        populateCountryInfo()
    }, [code])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <section>
            <h2>{country.name} </h2>
            <p><i>{country.native}</i></p>
            <p>Flag: {country.emoji}</p>
            <p>Official language{country.languages.length > 1 ? 's' : null}: {country.languages.map((lang)=><span>{lang.name} </span>)}
            </p>
        </section>
    )
}

export default CountryInfoDisplay