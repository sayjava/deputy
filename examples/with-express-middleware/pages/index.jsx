import {useEffect, useState} from 'react'
export default () => {
    const [state, setState] = useState(null)
    
    useEffect(() => {
        fetch('/api/weather')
        .then(res => res.json())
        .then(data => setState({error: null, data}))
        .catch(error => setState({error, data: null}))
    }, [])


    if(!state) {
        return <div>
            Loading up weather
        </div>
    }

    if(state.error) {
        return <div style={{color: 'red'}}>
            {state.error.message}
        </div>
    }

    console.log(state.data)

    return <div>
        <h2>{state.data.name}'s Weather</h2>
        <div>
            <h4>Feels Like</h4>
            <ul>
                <li>{state.data.main.feels_like}</li>
                <li>{state.data.main.humidity}</li>
            </ul>
            <h4>Weather</h4>
            <ul>
                <li>{state.data.weather[0].description}</li>
                <li>{state.data.weather[0].main}</li>
            </ul>
        </div>
    </div>
}