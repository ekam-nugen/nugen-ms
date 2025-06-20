import axios from 'axios';

export const authMiddleware = async (req, res, next) => {
  let auth_url = process.env.API_URL_AUTH;
  const endpoint = `${auth_url}/validate`;
  const method = 'POST';
  const headers = {
    Authorization: req.headers['authorization'],
  };
  let accessToken = req.headers['authorization'];
  if (accessToken) {
    accessToken = accessToken.split(' ')[1];
  } else {
    return res.status(400).json({
      message: 'Token is missing',
    });
  }
  try {
    const response = await axios({
      url: endpoint,
      method,
      headers,
      data: {
        accessToken: accessToken,
      },
    });

    req.user = await response.data.payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};
