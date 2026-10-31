export const baseURL = "http://localhost:5001/api";
export const authURL = "http://localhost:8084/auth";
export const masterURL = "http://localhost:8070";
export const elasticURL = "http://localhost:9201";

export const appId = "1";
export const REGISTER_USER = `${authURL}/register`;
export const GET_REFRESHEDTOKEN = `${authURL}/refresh-accesstoken`;
export const GET_MY_HOMEADVERTISEMENT = `${baseURL}/advertisements/getHomeAdvertisement`;
export const GET_MY_ADVERTISEMENT = `${baseURL}/advertisements/getMyAdvertisement`;
export const GET_VILLAGE_CAROUSEL = `${baseURL}/carousel/getVillageCarousel`;
export const GET_VILLAGE_MOB_CAROUSEL = `${baseURL}/carousel/getVillageMobCarousel`;
export const GET_CATEGORIES = `${baseURL}/organisations/getCategories`;
export const GET_EMERGENCY_ORGANISATION = `${baseURL}/organisations/getEmergencyOrganisation`;
export const GET_IMPORTANT_PERSONS = `${baseURL}/users/getImportantPersons`;
export const GET_ORGANISATIONS_CATEGORIES = `${baseURL}/organisations/getCategories`;
export const GET_PEOPLES_LIST = `${baseURL}/users/list`;
export const GET_ANALYTICS = `${baseURL}/analytics`;
export const GET_ORGANISATIONS_BY_CATEGORIES = `${baseURL}/organisations/getOrganisationByCategory`;
export const LOGIN_USER = `${authURL}/login`;
export const GET_ALLGENDER = `${masterURL}/master/gender/getAll`;
export const REQUEST_APPDATA = `${baseURL}/villageapps/getapp`;

export const LISTVILLAGEELASTICUSER = elasticURL + "/villageuser/search_byFilter"

export const ADD_MARKET_PRODUCT_ITEM = baseURL + "/market/add"
export const LIST_MARKET_PRODUCT_ITEM = baseURL + "/market/list"
export const UPDATE_MARKET_PRODUCT_ITEM = baseURL + "/market/update"
export const DELETE_MARKET_PRODUCT_ITEM = baseURL + "/market/delete"

export const GET_PRODUCT_IMAGES = baseURL + "/market/get_product_images"

