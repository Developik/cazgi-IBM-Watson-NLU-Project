const express = require('express');
const app = new express();
const dotenv = require('dotenv')
dotenv.config();


function getNLUInstance() {

    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}

function returnRequest(type, input) {
    let analyzeParams = {
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
        },
    };
    if (type === "text") {
        analyzeParams.text = input;
    }
    else if (type === "url") {
        analyzeParams.url = input;
    }

    return analyzeParams;

}

async function sendRequest(type, input) {
    let newReq = returnRequest(type, input);
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(newReq);
    /*
    try{
        naturalLanguageUnderstanding.analyze(newReq)
            .then(analysisResults => {
                console.log(JSON.stringify(analysisResults, null, 2));
                result = JSON.stringify(analysisResults, null, 2)
                return result;
            })
            .catch(err => {
                console.log('error:', err);
                //result = JSON.stringify(analysisResults, null, 2)
            });
    }
    finally{
        if (result === "error"){
            console.log('error');
        }
        return result;
    }
    */
    let analysisResults = await naturalLanguageUnderstanding.analyze(newReq)

    return analysisResults;

}


app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", async (req, res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.url);

    let result_from_req = await sendRequest('url', req.query.url);
    let outputJson = result_from_req;

    console.log("---" + JSON.stringify(outputJson.result.keywords[0].emotion));

    let json_data = outputJson.result.keywords[0].emotion;
    let result = [];

    result = Object.keys(json_data).map((key) => [key, json_data[key]]);

    console.log(result);

    return res.send(result);
});

app.get("/url/sentiment", async (req, res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.url);

    let result_from_req = await sendRequest('url', req.query.url);
    let outputJson = result_from_req;
    console.log("---" + outputJson.result.keywords[0].sentiment.label);
    return res.send(outputJson.result.keywords[0].sentiment.label);
    //return res.send("text sentiment for " + req.query.text);
});

app.get("/text/emotion", async (req, res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);

    let result_from_req = await sendRequest('text', req.query.text);
    let outputJson = result_from_req;

    console.log("---" + JSON.stringify(outputJson.result.keywords[0].emotion));

    let json_data = outputJson.result.keywords[0].emotion;
    let result = [];

    result = Object.keys(json_data).map((key) => [key, json_data[key]]);

    console.log(result);

    return res.send(result);
    //console.log(result_from_req['result']['keywords'][0]['sentiment']['label']);
    //return res.send({ "happy": "10", "sad": "90" });
});

app.get("/text/sentiment", async (req, res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);

    let result_from_req = await sendRequest('text', req.query.text);
    let outputJson = result_from_req;
    console.log("---" + outputJson.result.keywords[0].sentiment.label);
    return res.send(outputJson.result.keywords[0].sentiment.label);
    //return res.send("text sentiment for " + req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})



