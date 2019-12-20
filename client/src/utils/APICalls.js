 import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_baseAPIURL,
    withCredentials: false,
    timeout: 30000,
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
export const changePassword = (email) =>{
    return axiosInstance.post('/user/resetPasswordRequest', {email: email})
    .then((res) => {
        return res.data
    })
}


export const getUser = (jwt) => {
    return axiosInstance.get('user/profile', {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api 2', res);
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

export const createProject = (jwt, formData)=> {
    const headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': jwt
      }
//   axios({
//     method: "post", 
//     url: '${process.env.REACT_APP_baseAPIURL}/project/add',
//     data,
//     config: { headers: headers }
//   });
    return axiosInstance.post('project/add', formData,{headers:headers })
        .then((res) => {
            return res;
      });
}

export const updateUser = (jwt, formData) => {
    const headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': jwt
      }
      return axiosInstance.patch('user/update', formData,{headers:headers }).then((res) => {
            return res;
      });
}
export const getProjects = (jwt) => {
    return axiosInstance.get('user/viewProjects', {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api getting projs ', res.data);
        return res.data;
    })
}

export const getInterestsList=() => {
    return axiosInstance.get('user/interestsList')
        .then(res => {
            return res.data;
        });	
}




