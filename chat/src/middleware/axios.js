import axios from 'axios';

export const makeRequest = async (
  url,
  method = 'GET',
  headers = {},
  data = null,
) => {
  try {
    console.log(url);
    const response = await axios({
      url: url.url,
      method: method,
      headers: headers,
      data: data,
    });
    // console.log(response);
    return Promise.resolve(response);
  } catch (error) {
    console.log(error);
    return Promise.reject({ error });
  }
};
