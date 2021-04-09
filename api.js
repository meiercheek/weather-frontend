
let url = "https://8f3cbc60a540.ngrok.io"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZDUyMTdjLWYwOTItNDYxYy04MjM5LTlkZmI0N2M0OWZhNCIsImlhdCI6MTYxNzk2NDM3MywiZXhwIjoxNjE4MDUwNzczfQ.SoRsliaA8JgW69A77HR9nr9b_eNlyWWmooN1r54G0Vk"



export const fetchReports = (swlat, swlong, nelat, nelong) => {
    return fetch(`${url}/georeports?SWlat=${swlat}&SWlong=${swlong}&NElat=${nelat}&NElong=${nelong}`, {  
        method: 'GET',
        headers: {
            'x-access-token': token,
        },
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => {return error}) //TODO: TOTO NENI DOBRE
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
    .catch(error => error)
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
    .catch(error => error)
}

export const fetchWholeReport = () => {
    return fetch(`${url}/report/${report_id}`, {  
        method: 'GET',
        headers: {
            'x-access-token': token,
        },
    })
    .then((response) => response.json())
    .then((responseData) => {return responseData})
    .catch(error => error)
}
