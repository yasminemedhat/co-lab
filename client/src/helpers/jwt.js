export const getJwt = () => {
    return localStorage.getItem('token') ? "Bearer " +localStorage.getItem('token') : null;
}
export const getUserStored = () => {
    return JSON.parse(localStorage.getItem('colab-user'));
}