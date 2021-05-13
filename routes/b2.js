const getAuthDetails = require('../services/getAuthDetails');
const getUploadDetails = require('../services/getUploadDetails');

var clientUrl = "https://scg-af-logistic.surge.sh";

var debug = process.env.DEBUG;

if(debug) {
    clientUrl = "http://localhost:3001";
}

module.exports = async (req, res, next) => {
    try {
        const authDetails = await getAuthDetails();
        const uploadDetails = await getUploadDetails(authDetails);

        res.set('Access-Control-Allow-Origin', clientUrl);
        res.json(uploadDetails);
        return;
    } catch (e) {
        console.error(`Error while getting B2 upload details:`, e.message);
        res.status(500).send();
        return;
    }
};