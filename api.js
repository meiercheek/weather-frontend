
const url = "http://192.168.0.104:3000"
//const url = "https://ad69cf91c69e.ngrok.io"

export const getThisUser = (token) => {
    return fetch(`${url}/me`, {  
        method: 'GET',
        headers: {
            'x-access-token': token,
        },
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}

export const sendReport = (token, report) => {
    console.log(report)
    return fetch(`${url}/reports`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body:JSON.stringify(report)
    })
    .then((response) => response.json())
    .then((responseData) => { return(responseData)})
    .catch(error => {console.log(error)})
}

export const fetchLocationName = (lat, long) => {
    return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`, {  
        method: 'GET',
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}

export const fetchReports = (token, swlat, swlong, nelat, nelong) => {
    return fetch(`${url}/georeports?SWlat=${swlat}&SWlong=${swlong}&NElat=${nelat}&NElong=${nelong}`, {  
        method: 'GET',
        headers: {
            'x-access-token': token,
        },
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}

export const fetchLogin = (u, p) => {
    return fetch(`${url}/login`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            password: p,
            username: u
        })
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}

export const fetchRegister = (e, u, p) => {
    return fetch(`${url}/users`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email: e,
            password: p,
            username: u
        })
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}

export const fetchWholeReport = (token, report_id) => {
    return fetch(`${url}/report/${report_id}`, {  
        method: 'GET',
        headers: {
            'x-access-token': token,
        },
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {console.log(error)})
}
