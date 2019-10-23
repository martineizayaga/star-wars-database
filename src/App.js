import React, {useEffect, useState, useCallback} from 'react';

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
  const swapiPersonData = useState(localStorage.getItem('swapiPersonData'))[0]
  const swapiFilmData = useState(localStorage.getItem('swapiFilmData'))[0]

  const [,updateState] = useState()

  const [filmLoading, setFilmLoading] = useState((localStorage.getItem('filmLoading') === 'true') || true) // true if still fetching films
  const [peopleLoading, setPeopleLoading] = useState((localStorage.getItem('peopleLoading') === 'true') || true) // true if still fetching people
  
  const [selectedPerson, setSelectedPerson] = useState('') // name in input

  const [jediMode, setJediMode] = useState(false) // super secret easter egg shhh don't tell anyone

  const [, forceUpdate] = useState(0)

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
      // going through all the pages and collecting them in an array
      for (let i = 1; i <= pagesRequired; i++) {
        apiPromises.push(fetch('https://swapi.co/api/people/?page='+i))
      }
      // promises of all the people pages
      Promise.all(apiPromises)
      .then(responses => {
        responses = responses.map(response => response.json())
        Promise.all(responses)
        .then(responses => {
          // flattening the array to have one
          responses = responses.map(response => response.results).flat()
          var personData = {}
          // formatting data so that it follows the schema:
          // {
          //  "name1": {info...}
          //  "name2": {info...} 
          // }
          for (let i = 0; i < responses.length; i++) {
            personData[responses[i].name] = responses[i]
          }
          localStorage.setItem('swapiPersonData', JSON.stringify(personData))
          localStorage.setItem('peopleLoading', false)
          setPeopleLoading(false)
        })
      })
    })
  }, [swapiPersonData])

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
      // following the schema shown in the comments above
      for (let i = 0; i < response.results.length; i++) {
        filmData[response.results[i].url] = response.results[i]
      }
      localStorage.setItem('swapiFilmData', JSON.stringify(filmData))
      localStorage.setItem('filmLoading', false)
      setFilmLoading(false)
    })
  }, [swapiFilmData])

  // update selected character value based on input from keyboard or mouse
  function trackChange(e) {
    const value = e.currentTarget.value
    setSelectedPerson(value)
  }

  function returnDropdown() {
      var swapiPersonDataJSON = JSON.parse(localStorage.getItem('swapiPersonData'))
      var swapiFilmDataJSON = JSON.parse(localStorage.getItem('swapiFilmData'))
      return (
        <div>
          <input autoFocus type="text" list="people" onChange={trackChange} placeholder="Pick your character"/>
          <datalist id="people">
            {Object.keys(swapiPersonDataJSON).map((value, index) => {
                return (
                  <option value={value} key={index}>{value}</option>
                )
            })}
          </datalist>
          {
            // if the typed input can't be found in the valid list of names
            Object.keys(swapiPersonDataJSON).indexOf(selectedPerson) === -1
            ? ''
            : (
              <div>
                <p>
                  Did you know? <Text code>{selectedPerson}</Text> has been in <Text code>{swapiPersonDataJSON[selectedPerson].films.length} films</Text>{(() => {
                    if (!isNaN(swapiPersonDataJSON[selectedPerson]['height'])) {
                      return (<span> and is <Text code>{swapiPersonDataJSON[selectedPerson].height / 100} meters tall</Text>.</span>)
                    } else if (!isNaN(swapiPersonDataJSON[selectedPerson].mass)) {
                      return (<span> and weighs <Text code>swapiPersonDataJSON[selectedPerson].mass</Text> lbs.</span>)
                    } else {
                      return '.'
                    }
                  })()}
                </p>
                <CharacterTable character={selectedPerson} swapiPersonData={swapiPersonDataJSON} swapiFilmData={swapiFilmDataJSON}/>
              </div>
            )
          }
        </div>
      )
  }

  function returnBody() {
      // if we should keep on loading
      if(filmLoading || peopleLoading || localStorage.getItem('swapiFilmData') === null || localStorage.getItem('swapiPersonData') === null) {
      return (
        <div>
          <p>
            {
              (() => {
                if (filmLoading && peopleLoading) {
                  return 'Traveling through hyperspace...'
                } else if (filmLoading) {
                  return 'Firing up lightsabers...'
                } else if (peopleLoading) {
                  return 'Charging up the blasters...'
                } else {
                  return 'Loading...'
                }
              })()
            }
          </p>
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
            {jediMode ? 'Go Padawan' : 'Go Jedi'}
          </Button>
        </header>
      </div>
    )
  }

  return returnAppTemplate()
}
export default App;