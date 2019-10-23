import React, {useEffect, useState} from 'react';

import { Typography, Button } from 'antd'
import 'antd/dist/antd.css'
import StarWarsLogo from './star-wars-logo.png'
import BarLoader from 'react-spinners/BarLoader'
import LazyLoad from 'react-lazyload'
import { css } from '@emotion/core'
import CharacterTable from './components/characterTable'
import './App.css';

const { Text } = Typography;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  margin-top: 20px;
`

function App() {
  const [swapiPersonData, setSwapiPersonData] = useState(null)
  const [swapiFilmData, setSwapiFilmData] = useState(null)
  const [swapiPlanetData, setSwapiPlanetData] = useState(null)
  const [swapiSpeciesData, setSwapiSpeciesData] = useState(null)

  const [filmLoading, setFilmLoading] = useState(true)
  const [peopleLoading, setPeopleLoading] = useState(true)
  const [planetLoading, setPlanetLoading] = useState(true)
  const [speciesLoading, setSpeciesLoading] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState('')

  const [jediMode, setJediMode] = useState(false)

  useEffect(() => {
    var pagesRequired = 0
    fetch(
      'https://swapi.co/api/people/'
    )
    .then(res => res.json())
    .then(response =>{
      const apiPromises = []
      pagesRequired = Math.ceil(response.count / 10)
      for (let i = 1; i <= pagesRequired; i++) {
        apiPromises.push(fetch('https://swapi.co/api/people/?page='+i))
      }

      Promise.all(apiPromises)
      .then(responses => {
        responses = responses.map(response => response.json())
        Promise.all(responses)
        .then(responses => {
          responses = responses.map(response => response.results).flat()
          var personData = {}
          for (let i = 0; i < responses.length; i++) {
            personData[responses[i].name] = responses[i]
          }
          setSwapiPersonData(personData)
          setPeopleLoading(false)
        })
      })
    })
  }, [swapiPersonData])

  useEffect(() => {
    var pagesRequired = 0
    fetch(
      'https://swapi.co/api/species/'
    )
    .then(res => res.json())
    .then(response =>{
      const apiPromises = []
      pagesRequired = Math.ceil(response.count / 10)
      for (let i = 1; i <= pagesRequired; i++) {
        apiPromises.push(fetch('https://swapi.co/api/species/?page='+i))
      }

      Promise.all(apiPromises)
      .then(responses => {
        responses = responses.map(response => response.json())
        Promise.all(responses)
        .then(responses => {
          responses = responses.map(response => response.results).flat()
          var speciesData = {}
          for (let i = 0; i < responses.length; i++) {
            speciesData[responses[i].url] = responses[i]
          }
          setSwapiSpeciesData(speciesData)
          setSpeciesLoading(false)
        })
      })
    })
  }, [swapiSpeciesData])

  useEffect(() => {
    var pagesRequired = 0
    fetch(
      'https://swapi.co/api/planets/'
    )
    .then(res => res.json())
    .then(response =>{
      const apiPromises = []
      pagesRequired = Math.ceil(response.count / 10)
      for (let i = 1; i <= pagesRequired; i++) {
        apiPromises.push(fetch('https://swapi.co/api/planets/?page='+i))
      }

      Promise.all(apiPromises)
      .then(responses => {
        responses = responses.map(response => response.json())
        Promise.all(responses)
        .then(responses => {
          responses = responses.map(response => response.results).flat()
          var planetData = {}
          for (let i = 0; i < responses.length; i++) {
            planetData[responses[i].url] = responses[i]
          }
          setSwapiPlanetData(planetData)
          setPlanetLoading(false)
        })
      })
    })
  }, [swapiPlanetData])

  useEffect(() => {
    fetch(
      'https://swapi.co/api/films/'
    )
    .then(res => res.json())
    .then(response => {
      var filmData = {}
      for (let i = 0; i < response.results.length; i++) {
        filmData[response.results[i].url] = response.results[i]
      }
      setSwapiFilmData(filmData)
      setFilmLoading(false)
    })
  }, [swapiFilmData])

  function trackChange(e) {
    const value = e.currentTarget.value
    setSelectedPerson(value)
  }

  return (
    <div className={"App " + (jediMode ? 'jedi-mode' : '')}>
      <header className="App-header">
        <LazyLoad>
          <img
            src={StarWarsLogo}
            id="star-wars-logo"
          />
        </LazyLoad>
        {
          filmLoading || peopleLoading || speciesLoading || planetLoading ?
          <div>
            <p>Loading data...</p>
            <BarLoader
              css={override}
              sizeUnit={'px'}
              size={150}
              color={'black'}
              className="barloader"
            />
          </div> :
          <div>
              <input autoFocus type="text" list="people" onChange={trackChange} placeholder="Pick your character"/>
              <datalist id="people">
                {Object.keys(swapiPersonData).map((value, index) => {
                    return (
                      <option value={value} key={index}>{value}</option>
                    )
                })}
              </datalist>
            
            {
              Object.keys(swapiPersonData).indexOf(selectedPerson) == -1
              ? ''
              : (
                <div>
                  <p>
                    <Text code>{selectedPerson}</Text> is a <Text code>{swapiSpeciesData[swapiPersonData[selectedPerson].species[0]].name}</Text> from the <Text code>Planet of {swapiPlanetData[swapiPersonData[selectedPerson].homeworld].name}</Text>, far, far away...
                  </p>
                  <CharacterTable character={selectedPerson} swapiPersonData={swapiPersonData} swapiFilmData={swapiFilmData}/>
                </div>
              )
            }
          </div>
        }
        <Button className="jedi-mode-button" onClick={(e) => {
          const value = e.currentTarget.value
          setJediMode(!jediMode)
          console.log(jediMode)
        }}>{jediMode ? 'Padawan Mode' : 'Jedi Mode'}</Button>
      </header>
    </div>
  )
}
export default App;