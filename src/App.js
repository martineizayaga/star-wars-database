import React, {useEffect, useState} from 'react';

import { Select, Table, Divider, Typography } from 'antd'
import 'antd/dist/antd.css'
import dayjs from 'dayjs'
import StarWarsLogo from './star-wars-logo.png'
import BarLoader from 'react-spinners/BarLoader'
import LazyLoad from 'react-lazyload'
import { css } from '@emotion/core'
import './App.css';

const { Option } = Select;
const { Title, Text } = Typography;

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

  const [allLoaded, setAllLoaded] = useState(localStorage.getItem('allLoaded') || false)

  useEffect(() => {
    console.log(1)
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
    console.log(2)
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
    console.log(3)
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
    console.log(4)
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

  function onSelect(value, event) {
    setSelectedPerson(value)
  }

  function trackChange(e) {
    const value = e.currentTarget.value
    setSelectedPerson(value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <LazyLoad>
          <img
            src={StarWarsLogo}
            id="star-wars-logo"
          />
        </LazyLoad>
        {
          filmLoading || peopleLoading || speciesLoading || planetLoading ?
          <BarLoader
            css={override}
            sizeUnit={'px'}
            size={150}
            color={'black'}
            className="barloader"
          /> :
          <div>
              <input autofocus type="text" list="people" onChange={trackChange} placeholder="Pick your character"/>
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
      </header>
    </div>
  )
}

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => (a.title).localeCompare(b.title)
  },
  {
    title: 'Director',
    dataIndex: 'director',
    key: 'director',
    sorter: (a, b) => (a.director).localeCompare(b.director)
  },
  {
    title: "Release Date",
    dataIndex: 'release_date',
    key: 'release_date',
    sorter: (a, b) => dayjs(a.release_date).isAfter(b.release_date) ? 1 : -1,
    defaultSortOrder: 'ascend'
  }
]

function getDataSource(props) {
  var swapiPersonData = props.swapiPersonData
  var characterObject = swapiPersonData[props.character]
  var characterFilmsList = characterObject.films
  var swapiFilmData = props.swapiFilmData
  var data = []
  for (let i = 0; i < characterFilmsList.length; i++) {
    var filmURL = characterFilmsList[i]
    var filmData = swapiFilmData[filmURL]
    data.push({
      key: i.toString(),
      title: filmData.title,
      director: filmData.director,
      release_date: filmData.release_date
    })
  }
  return data
}

function CharacterTable(props) {
  return (
    <Table
      title={() => (props.character + " was in these Movies")}
      columns={columns}
      dataSource={getDataSource(props)}
      pagination={false}
      tableLayout={'auto'}
      style={{
        maxWidth: '750px',
        marginTop: 0,
        marginbottom: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    />
  )
}

export default App;
