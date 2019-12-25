export const getJwt = () => {
    return "Bearer " +localStorage.getItem('token');
}
export const getUserStored = () => {
    return JSON.parse(localStorage.getItem('colab-user'));
}