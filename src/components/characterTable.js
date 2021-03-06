import dayjs from 'dayjs'
import { Table } from 'antd'
import React from 'react';

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
  
  /**
   * Gets the data for the currently selected person
   *
   * @param {character, swapiPersonData, swapiFilmData} props
   * @returns the data for all of the rows of the table
   */
  function getDataSource(props) {
    var swapiPersonData = props.swapiPersonData
    var characterObject = swapiPersonData[props.character]
    var characterFilmsList = characterObject.films // the films the character was in
    var swapiFilmData = props.swapiFilmData
    var data = []
    for (let i = 0; i < characterFilmsList.length; i++) {
      var filmURL = characterFilmsList[i]
      var filmData = swapiFilmData[filmURL] // url is a key, see App.js
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
  
export default CharacterTable;  