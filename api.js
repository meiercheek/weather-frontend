
const url = "https://a29f9a010e22.ngrok.io"

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
