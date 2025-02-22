import axios from 'axios';

const api = axios.create({
    // sever
   // baseURL: 'https://bcsswp.azurewebsites.net',
    // local
    // baseURL: 'https://localhost:7199',
    //  baseURL: 'https://cldhbe.azurewebsites.net
    baseURL: 'https://bookingdanceprojectapi20250221194640.azurewebsites.net',

});

const authen = localStorage.getItem('Authen');

// Request interceptor
if (authen != null) {
    api.interceptors.request.use(
        function (config) {
            // Modify the request config here
            config.headers.Authorization = ` Bearer ${localStorage.getItem('Authen')}`;
            return config;
        },
        function (error) {
            // Handle request error here
            return Promise.reject(error);
        }
    );
}

// Response interceptor
api.interceptors.response.use(
    function (response) {
        // Modify the response data here
        if (response.data && response.data.data) {
            response.data = response.data.data;
        }
        return response;
    },
    function (error) {
        // Handle response error here
        return Promise.reject(error);
    }
);

export default api;