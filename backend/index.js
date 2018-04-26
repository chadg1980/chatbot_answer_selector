let Airtable = require('airtable');
let base = new Airtable({apiKey: "keySRLy2WHOoOzqPM"}).base('appazQ1yAI1aqEkEM');


function insertRecord(data, callback){
    base('query_gt').create({
        "query" : data.query, 
        "GTID" : parseInt(data.GTID, 10),
        "azure_response_array" : data.azure_response_array,
        "custom_response" : data.custom_response,
        "query_safeID" : data.query_safeID

    }, function(err, record){
        if(err) {console.error(err); callback(err); return;}
        console.log(record.getId());
        callback(null, "success");

    });
}


exports.handler = (event, context, callback) =>{
    insertRecord(event, callback);
   
}