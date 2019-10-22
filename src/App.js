import React, {useEffect, useState} from 'react';
import './App.css';
import { Select, Table, Divider } from 'antd'
import 'antd/dist/antd.css'
const { Option } = Select;

function App() {
  const [swapiPersonData, setSwapiPersonData] = useState(JSON.parse(localStorage.getItem('swapiPersonData')) || {})
  const [swapiFilmData, setSwapiFilmData] = useState(JSON.parse(localStorage.getItem('swapiFilmData')) || {})
  const [filmLoading, setFilmLoading] = useState(true)
  const [peopleLoading, setPeopleLoading] = useState(true)
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

  if (filmLoading || peopleLoading) {
    return (
      <div className="App">
        <header className="App-header">
          Loading...
        </header>
    </div>
    )
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <Select
            showSearch
            style={{ width: 200 }}
            onSelect={onSelect}
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
          </Select>
          <CharacterTable character={selectedPerson}/>
        </header>
      </div>
    );
  }
  
}

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Director',
    dataIndex: 'director',
    key: 'director'
  },
  {
    title: "Release Date",
    dataIndex: 'release_date',
    key: 'release_date'
  }
]

const data = [
  {
    key: '1',
    character: 'Luke Skywalker',
    description: 'A hero?',
    films: 'A new hope'
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
  if (props.character === '') {
    return ''
  } else {
    return (
      <Table columns={columns} dataSource={getDataSource(props.character)}/>
    )
  }
}

export default App;
