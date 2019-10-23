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
  const [swapiHashSpecies, setSwapiHashSpecies] = useState({})

  const [filmLoading, setFilmLoading] = useState(true) // true if still fetching films
  const [peopleLoading, setPeopleLoading] = useState(true) // true if still fetching people
  const [planetLoading, setPlanetLoading] = useState(true) // true if still fetching planets
  const [speciesLoading, setSpeciesLoading] = useState(true) // true if still fetching species
  
  const [selectedPerson, setSelectedPerson] = useState('') // name in input

  const [jediMode, setJediMode] = useState(false) // super secret easter egg shhh don't tell anyone

  /**
   * Effect hook for swapi person data
   * Sets swapi person data to have this schema:
   * {
   *  "name1": {info...},
   *  "name2": {info...},
   *  ...
   * }
   */
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
            var url = responses[i]['species'][0]
            console.log(personData[responses[i].name].name, url)
            console.log(responses[i]['species'] in swapiHashSpecies)
            // if (!(responses[i]['species'] in swapiHashSpecies)) {
              // fetch(url)
              // .then(res => res.json())
              // .then(response => {swapiHashSpecies[url] = response.results['name']})
            // }
            // personData[responses[i].name][url] = swapiHashSpecies[url]
          }
          console.log(personData)
          setSwapiPersonData(personData)
          setPeopleLoading(false)
        })
      })
    })
  }, [swapiPersonData])

  /** 
   * Effect hook for species data
   * Sets swapi specied data to have this schema:
   * {
   *  "https:...1": {info...},
   *  "https:...2": {info...},
   *  ...
   * }
   */
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

  /**
   * Effect hook for planet data
   * Sets swapi planet data to have this schema:
   * {
   *  "https://...1": {info...},
   *  "https://...2": {info...},
   *  ...
   * }
   */
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

  /**
   * Effect hook for film data
   * Sets swapi film data to have this schema:
   * {
   *  "https://...1": {info...},
   *  "https://...2": {info...},
   *  ...
   * }
   */
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

  function returnDropdown() {
    return (
      <div>
        {/* Inspired by https://codepen.io/BTM/pen/ZKxKPo?editors=1111 */}
        <input autoFocus type="text" list="people" onChange={trackChange} placeholder="Pick your character"/>
        <datalist id="people">
          {Object.keys(swapiPersonData).map((value, index) => {
              return (
                <option value={value} key={index}>{value}</option>
              )
          })}
        </datalist>
        {
          // if the typed input can't be found in the valid list of names
          Object.keys(swapiPersonData).indexOf(selectedPerson) === -1
          ? ''
          : (
            <div>
              <p>
                <Text code>{selectedPerson}</Text> is a <Text code>
                {!swapiPersonData[selectedPerson].species || !swapiPersonData[selectedPerson].species.length 
                  ?
                  '???'
                  :
                  swapiSpeciesData[swapiPersonData[selectedPerson].species[0]].name
                }
                </Text> from the <Text code>Planet of {swapiPlanetData[swapiPersonData[selectedPerson].homeworld].name}</Text>, far, far away...
              </p>
              <CharacterTable character={selectedPerson} swapiPersonData={swapiPersonData} swapiFilmData={swapiFilmData}/>
            </div>
          )
        }
      </div>
    )
  }

  function returnBody() {
    if (filmLoading || peopleLoading || speciesLoading || planetLoading) {
      return (
        <div>
          <p>Loading data...</p>
          <BarLoader
            css={override}
            sizeUnit={'px'}
            size={150}
            color={'black'}
            className="barloader"
          />
        </div>
      )
    } else {
      return returnDropdown()
    }
  }

  function returnAppTemplate() {
    return (
      <div className={"App " + (jediMode ? 'jedi-mode' : '')}>
        <header className="App-header">
          <LazyLoad>
            <img
              src={StarWarsLogo}
              id="star-wars-logo"
              alt="Star Wars Logo"
            />
          </LazyLoad>
          {returnBody()}
          <Button className="jedi-mode-button" onClick={(e) => setJediMode(!jediMode)}>
            {jediMode ? 'Padawan Mode' : 'Jedi Mode'}
          </Button>
        </header>
      </div>
    )
  }

  return returnAppTemplate()
}
export default App;