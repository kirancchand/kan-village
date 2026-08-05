import axios from 'axios';
import { baseURL, appId } from './constants';
const http = axios.create({
  baseURL: baseURL
});

http.interceptors.request.use((config) => {
  config.headers['X-App-Id'] = appId;
  return config;
});


async function refreshToken() {
    // try {
    //   const response = await http({
    //     method: 'GET',
    //     url: ACCOUNTS_REFRESH,
    //   })
      
    //   const { access_token, redirect_url } = response.data;
    //     //   console.log("response.data",response)
    //   if(response.status==203){

    //     authService.logout()
    //     redirectToLogin();//added to while refresh token become 203
    //     return 
    //   }
    //   if(access_token!=undefined){
    //     setLocalStorage(ACCESS_TOKEN_KEY,access_token)
    //   }
    //   // localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    //   // console.log("AuthService - New access token saved to localStorage");
      
    //   // If we have a redirect URL from refresh, go there
    //   if (redirect_url) {
    //     // console.log("AuthService - Redirecting after token refresh to:", redirect_url);
    //     window.location.href = redirect_url;
    //   }
      
    //   return access_token;
    // } catch (error) {

    //   removeAllLocalStorage()
    //   return null;
    // }
    return true
}

export function redirectToLogin() {

}

export function getAccessToken() {
    return localStorage.getItem("access_token");
}

http.interceptors.request.use(
    async (config) => {
        // console.log("AuthService - Request interceptor for URL:", config.url);
        
        if (!config.url.includes('/register')&&!config.url.includes('/login') && !config.url.includes('/access-token')) {
            const token = getAccessToken();
            if (token) {
                // console.log("AuthService - Token found, checking expiration");
                // Check if token is expired
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // console.log("AuthService - No token found for authenticated request");
            }
        }
        config.headers['X-App-Id'] = appId;
        return config;
    },
    (error) => {
        // console.error("AuthService - Request interceptor error:", error);
        return Promise.reject(error);
    }
    );
    
    // Setup response interceptor for handling token expiration
http.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // console.error("http:", error);
        const originalRequest = error.config;
        
        if (error.response?.status === 500) {
             toast( error.response.data.message +"!!", { position: 'top-right', type: 'error' })
            return Promise.reject(error);
        }else if (error.response?.status === 203) {
            toast( error.response.data.message +"!!", { position: 'top-right', type: 'error' })
            redirectToLogin();
            return Promise.reject(error);
         }else {
            // If 401 and not a refresh token request and not already retried
            if (error.response?.status === 401 && !originalRequest.url.includes('/access-token') && !originalRequest._retry) {
                originalRequest._retry = true;
                // console.log("AuthService - 401 detected, attempting token refresh");
                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        // console.log("AuthService - New token obtained, retrying original request");
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return http(originalRequest);
                    }
                } catch (refreshError) {
                    // console.error("AuthService - Refresh failed on 401 response:", refreshError);
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            }

            if(error.response?.status === 503){
                console.log("service un available")
                toast(  "service un available !!", { position: 'top-right', type: 'error' })
            }
            //503 not catched
            return Promise.reject(error);
        }
    }
);

export default http;