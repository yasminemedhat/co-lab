import io from 'socket.io-client';

const endpoint=process.env.REACT_APP_baseAPIURL || 'http://localhost:5000';
var socket=io(endpoint);


export default socket;




