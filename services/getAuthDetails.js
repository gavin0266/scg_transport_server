const axios = require('axios');

module.exports = async () => {
    const authRes = await axios({
        method: 'GET',
        url: 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        auth: {
            username: process.env['B2_KEY_ID'],
            password: process.env['B2_APPLICATION_KEY'],
        },
    });

    console.info(`Success getting B2 auth details`);

    const data = authRes.data;

    const bucketId = data.allowed.bucketId;
    const apiUrl = data.apiUrl;
    const authToken = data.authorizationToken;

    return {
        bucketId,
        apiUrl,
        authToken,
    };
};