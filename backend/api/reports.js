const tools = require('./tools')


const getGeoReports = (request, response) => {
    // react-native-maps: getMapBoundaries -> {northEast: LatLng, southWest: LatLng}
    if (request.query.NElat == undefined ||
      request.query.NElong == undefined ||
      request.query.SWlat == undefined ||
      request.query.SWlong == undefined) {
      return response.status(400).json({ "error": 'Incorrect map data entered.' })
    }
  
    else {
      const { NElat, NElong, SWlat, SWlong } = request.query
      let prep = `SELECT report_id, characteristic, latitude, longitude FROM wra.reports WHERE (latitude BETWEEN ${SWlat} AND ${NElat}) AND ((${SWlong} < ${NElong}) AND longitude BETWEEN ${SWlong} AND ${NElong}) OR ((${NElong} < ${SWlong}) AND ((longitude BETWEEN ${SWlong} AND 180) OR (longitude BETWEEN -180 AND ${NElong})))`
      tools.pool.query(prep, (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length == 0)
            return response.status(404).json({ "error": 'No reports found.' })
  
          response.status(200).json({ "response": { "reports": results.rows } })
        }
  
      })
    }
  }
  
  const createReport = (request, response) => {
    if (request.body.user_id == undefined || request.body.characteristic == undefined || request.body.latitude == undefined ||
      request.body.longitude == undefined || request.body.description == undefined || request.body.location == undefined
       || request.body.photo == undefined) {
      return response.status(400).json({ "error": 'Invalid object received.' })
    } // ak je nezadaný description alebo photo, príde "-"
  
    const { user_id, characteristic, latitude, longitude,
      description, location, photo } = request.body
    //query neakceptuje coordinates, pozrieť podľa db a zmeniť query
    let options
    let query  
    const photoQuery = 'INSERT INTO wra.reports (user_id, characteristic, latitude, longitude, description,location, uploadTime, photo) VALUES ($1, $2, $3, $4, $5, $6, now(), decode($7, \'base64\'))'
    const photoOptions = [user_id, characteristic, latitude, longitude, description, location, photo]
    const noPhotoQuery = 'INSERT INTO wra.reports (user_id, characteristic, latitude, longitude, description,location, uploadTime) VALUES ($1, $2, $3, $4, $5, $6, now())'
    const noPhotoOptions = [user_id, characteristic, latitude, longitude, description, location]  

    if (photo == "-"){
      options = noPhotoOptions
      query= noPhotoQuery
    }
    else {
      options = photoOptions
      query = photoQuery
    }

    tools.pool.query(query,
      options, (error, results) => {
          if (error) {
            return response.status(500).json({ "error": error })
          }
          else {
            return response.status(201).json({ "response": "success" })
          }
  
        })
  }
  
  const updateReport = (request, response) => {
    if (tools.checkuuid(request.params.report_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
  
    if (request.body.user_id == undefined || request.body.characteristic == undefined || request.body.latitude == undefined ||
      request.body.longitude == undefined || request.body.description == undefined || request.body.location == undefined
       || request.body.photo == undefined) {
      return response.status(400).json({ "error": 'Invalid object received.' })
    } // ak je nezadaný description alebo photo, príde "-"
  
    const { user_id, characteristic, latitude, longitude,
      description, location, uploadTime, photo } = request.body
    const report_id = request.params.report_id
  
    const prep = `update wra.reports set user_id=\'${user_id}\', characteristic=\'${characteristic}\', latitude=${latitude}, longitude=${longitude}, description=\'${description}\', location=\'${location}\', uploadTime=now(),  photo=decode(\'${photo}\', \'base64\') where report_id=\'${report_id}\'`
  
    tools.pool.query(prep, (error, results) => {
      if (error) {
        return response.status(500).json({ "error": error })
      }
      else {
        return response.status(200).json({ "response": "success" })
      }
  
    }
    )
  }

  const getReportById = (request, response) => {
    if (tools.checkuuid(request.params.report_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
    tools.pool.query('SELECT report_id, user_id, characteristic, latitude, longitude, location, uploadTime, description, encode(photo::bytea, \'base64\') as photo  FROM wra.reports WHERE report_id=$1',
      [request.params.report_id], (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length == 0) {
            return response.status(404).json({ "error": "No reports found." })
          }
          return response.status(200).json({ "response": { "report": results.rows[0] } })
        }
      })
  }

  const getReportsByOwner = (request, response) => {
    if (tools.checkuuid(request.params.user_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
    tools.pool.query('SELECT report_id, uploadtime, characteristic, location FROM wra.reports WHERE user_id = $1',
      [request.params.user_id], (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length == 0) {
            return response.status(404).json({ "error": "No reports found." })
          }
          return response.status(200).json({ "response": { "reports": results.rows } })
        }
      })
  }
  
  const deleteReport = (request, response) => {
    if (tools.checkuuid(request.params.report_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
    tools.pool.query('DELETE FROM wra.reports WHERE report_id = $1',
      [request.params.report_id], (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          return response.status(200).json({ "response": "deleted" })
        }
      })
  
  
  }

  module.exports = {
    getGeoReports,
    getReportsByOwner,
    createReport,
    updateReport,
    deleteReport,
    getReportById
  }  
  