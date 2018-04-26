let Airtable = require('airtable');
let base = new Airtable({apiKey: "keySRLy2WHOoOzqPM"}).base('appazQ1yAI1aqEkEM');


function insertRecord(){
    base('query_gt').create({
        "query" : query, 
        "GTID" : GTID,
        "azure_response_array" : azure_response_array,
        "custom_response" : custom_response,
        "query_safeID" : query_safeID

    }, function(err, record){
        if(err) {console.error(err); return;}
        console.log(record.getId());

    });
}

exports.hander = (event, context, callback) =>{
    console.log('Received event' JSON.stringify(event, null, 2))
}