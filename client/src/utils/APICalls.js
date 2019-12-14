 import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_baseAPIURL,
    withCredentials: false,
});

axiosInstance.interceptors.response.use(
    res => {

        return res;
    },
    error => {
        return Promise.reject(error.response)
    }
);

export const signup = (user) => {
    return axiosInstance.post('user/register', user)
    .then((res) => {
        return res.data;
    })
}
export const login = (email, password) => {
    return axiosInstance.post('user/login', {
        email,
        password
    }).then(res => {
        console.log(res.data);
        return res.data;
    })
}

export const getUser = (jwt) => {
    return axiosInstance.get('user/profile', {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api ', res.data);
        return res.data;
    })
}

export const logout = (jwt, user) =>{
    const headers = {
        Authorization: jwt
      }
    return axiosInstance.post('user/logout', user,  {headers: headers}).then(res => {
        return res.data;
    });
}

export const createProject = (jwt, project)=> {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': jwt
    }
    return axiosInstance.post('project/add', project,{headers:headers })
        .then((res) => {
            return res;
      });
}

export const getInterestsList=() => {
    return axiosInstance.get('user/interestsList')
        .then(res => {
            return res.data;
        });	
}
// axios.post('http://localhost:5000/user/login', credentials)
// .then((res) => {
//     localStorage.setItem('token',res.data.token);
//     this.props.history.push({
//       pathname : path,
//       state :{
//       user: res.data.user,
//       }
//       });
//     // this.props.history.push(path);
//   })
// .catch((e)=> {
//     if (e.response && e.response.data) {
//         alert("Error: "+ e.response.data.message);
//     }
// });

// export const APIURL = process.env.REACT_APP_baseAPIURL;
export const getPhotos = () => axiosInstance.get(`${APIURL}/photos`);

export const addPhoto = data =>
  axios({
    method: "post", 
    url: `${APIURL}/photos/add`,
    data,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  });
export const editPhoto = data =>
  axios({
    method: "put",
    url: `${APIURL}/photos/edit`,
    data,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  });
export const deletePhoto = id => axios.delete(`${APIURL}/photos/delete/${id}`);
