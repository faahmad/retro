import Axios from "axios";

const idToken = localStorage.getItem("idToken");
Axios.defaults.headers.common["x-retro-auth"] = idToken;

export const axios = Axios;
