
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://16.170.194.209:8080'
});

//instance.get('/user_management')

export default instance;