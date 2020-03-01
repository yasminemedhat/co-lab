export const getJwt = () => {
    return localStorage.getItem('token') ? "Bearer " +localStorage.getItem('token') : null;
}
export const getUserStored = () => {
    return JSON.parse(localStorage.getItem('colab-user'));
}
export const checkTokenExpiration = () => {
    const login_date = localStorage.getItem('login_date');
    if(login_date){
        const seconds = (new Date().getTime() - login_date) / (1000);
        //check if 2 hours expiration date has passed
        return seconds < 7200 ? false:true
    }
    return true;
}