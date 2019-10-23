import React, {useEffect, useState} from 'react';
import './App.css';
import { Select, Table, Divider, Typography } from 'antd'
import 'antd/dist/antd.css'
import dayjs from 'dayjs'
import StarWarsLogo from './star-wars-logo.png'
import BarLoader from 'react-spinners/BarLoader'
import { css } from '@emotion/core'

const { Option } = Select;
const { Title } = Typography;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
`

function App() {
  const [swapiPersonData, setSwapiPersonData] = useState(JSON.parse(localStorage.getItem('swapiPersonData')) || {})
  const [swapiFilmData, setSwapiFilmData] = useState(JSON.parse(localStorage.getItem('swapiFilmData')) || {})
  const [swapiPlanetData, setSwapiPlanetData] = useState(JSON.parse(localStorage.getItem('swapiPlanetData')) || {})
  const [filmLoading, setFilmLoading] = useState(true)
  const [peopleLoading, setPeopleLoading] = useState(true)
  const [planetLoading, setPlanetLoading] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState('')

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
          localStorage.setItem('swapiPersonData', JSON.stringify(personData))
          setPeopleLoading(false)
        })
      })
    })
  }, [swapiPersonData])

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
          localStorage.setItem('swapiPlanetData', JSON.stringify(planetData))
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
      localStorage.setItem('swapiFilmData', JSON.stringify(filmData))
      setFilmLoading(false)
    })
  }, [swapiFilmData])

  function onSelect(value, event) {
    setSelectedPerson(value)
  }

  function onFormSubmit(e) {
    console.log('trackchange', e)
  }

  function trackChange(e) {
    const value = e.currentTarget.value
    setSelectedPerson(value)
  }

  if (filmLoading || peopleLoading || planetLoading) {
  // if (true) {
    return (
      <div className="App">
        <header className="App-header">
          <BarLoader
            css={override}
            sizeUnit={'px'}
            size={150}
            color={'black'}
            className="barloader"
          />
        </header>
    </div>
    )
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={StarWarsLogo}
            id="star-wars-logo"
          />
          <Title className="title">Database</Title>

          <input type="text" list="people" onChange={trackChange}/>
          <datalist id="people" onChange={onFormSubmit}>
            {Object.keys(swapiPersonData).map((value, index) => {
                return (
                  <option value={value} key={index}>{value}</option>
                )
            })}
          </datalist>




          {/* <Select
            showSearch
            style={{ width: '60%', maxWidth: '600px' }}
            onSelect={onSelect}
            placeholder="May the search be with you..."
          >
            {Object.keys(swapiPersonData).map((value, index) => {
              return (
                <Option
                  key={index}
                  value={value}>
                  {value}
                </Option>
              )
            })}
          </Select> */}
          {
            Object.keys(swapiPersonData).indexOf(selectedPerson) == -1
            ? ''
            : (
              <div>
                <span>
                  {selectedPerson} was born a long time ago in a galaxy far, far away on the year {swapiPersonData[selectedPerson].birth_year} in the Planet {swapiPlanetData[swapiPersonData[selectedPerson].homeworld].name}
                </span>
                <CharacterTable character={selectedPerson}/>
              </div>
            )
          }
        </header>
      </div>
    );
  }
  
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

function getDataSource(character) {
  var characterObject = JSON.parse(localStorage.getItem('swapiPersonData'))[character]
  var characterFilmsList = characterObject.films
  var swapiFilmData = JSON.parse(localStorage.getItem('swapiFilmData'))
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
      title={() => (props.character + "'s Movies")}
      columns={columns}
      dataSource={getDataSource(props.character)}
      pagination={false}
      tableLayout={'auto'}
    />
  )
}

export default App;
