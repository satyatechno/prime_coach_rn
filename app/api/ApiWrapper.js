import axios from "axios";
import querystring from "querystring";
import AsyncStorage from "@react-native-community/async-storage";
import { popToTop } from "../utils/Navigation";

// const BASE_URL = "http://prime-coach.co.uk/backend";
// const BASE_URL = "https://prime-coach.co.uk/developers/backend";
const BASE_URL = "https://prime-coach.co.uk/staging/prime-coach-backend";

export async function standardPostApi(
  endpoint,
  headers,
  params,
  pushLoginToUnauth = true,
  showErrorAlert = true
) {
  const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
  const res = await axios.post(
    `${BASE_URL}/api/${endpoint}`,
    querystring.stringify({ ...params, AccessToken: TOKEN }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
    }
  );
  if (res.data.code == 401) {
    popToTop();
    console.log("REMOVED ACCESS TOKEN !");
  }
  if (showErrorAlert && res.data.code !== 200 && res.data.message) {
    alert(res.data.message);
  }
  return res;
}

export async function standardPostApiJsonBased(
  endpoint,
  headers,
  params,
  pushLoginToUnauth = true,
  showErrorAlert = true
) {
  const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
  try {
    const res = await axios.post(
      `${BASE_URL}/api/${endpoint}`,
      // querystring.stringify({ ...params, AccessToken: TOKEN }),
      params,
      {
        headers: {
          Accept: "application/json",
          ...headers,
        },
      }
    );
    // console.log('response', res);
    if (res.data.code == 401) {
      console.log("REMOVED ACCESS TOKEN !");
    }
    if (showErrorAlert && res.data.code !== 200 && res.data.message) {
      alert(res.data.message);
    }
    return res;
  } catch (e) {
    console.log("error", e);
  }
}

export const uploadVideoOnServer = async (endpoint, data, config = {}) =>
  axios.post(`${BASE_URL}/api/${endpoint}`, data, config, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
