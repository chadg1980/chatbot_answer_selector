let qnaData = {};
$(document).ready(function() {

    // Store submitting question globally
    var QUESTION;
    
    
    function azSearch(query, callback) {
      $.ajax({
        type: "POST",
        url: "https://xnoyn83321.execute-api.us-west-2.amazonaws.com/dev/lenaquery",
        headers:{
          'Content-Type' : 'application/json',
          'X-Api-Key': 'KjIlXvwVTD3ZdmLYmSMqD2ef9Ub2fjsYaUoCyaQL'
        },
        data: JSON.stringify({
          "Query": query, 
          "Verbose": true,
          "Highlight": false,
          "Routing" : "hslate"
        }),
        success: function(data) {
        if(callback)callback(data);
        }
      });
    }
  
    function handleSearch(query, memberid, preQuestion) {
      azSearch(query, function(data) {
        if (!data) {
          console.log('No Data');
          $('.header').append('<h3>No matches</h3>');
          return;
        }
        let i;
        /* Send the JSON object to AWS Lambda
       qnadata{
          "query" : string,
          "GTID"  :  int,
          "azure_response_array" : string,
          "custom_response" : string,
          "query_safgeID" : string
        }
        */

        Object.assign(qnaData, {
          "query": query,
          "GTID" : -1,
          "azure_response_array" : "",
          "custom_response":"",
          "query_safeID" : null
        });
              
        let top_score_answer = "";              
        for(i = 0; i < data.value.length; i++){
          if(i != data.value.length-1){
            top_score_answer += data.value[i]["id"] +  " : " + data.value[i]["@search.score"] +", "
          }
          else{
            top_score_answer += data.value[i]["id"] +  " : " + data.value[i]["@search.score"]
          }
          createListing(query, data.value[i], i, memberid, preQuestion);
        }
        Object.assign(qnaData, {"azure_response_array" : top_score_answer} );
        $(".answers").append(`
          <div id="answer${i}">
          <p><span class="no_good">No Good answer listed for</span> <span class="queryClass">&quot;${query}&quot;</span></p>
          <label>Add Custom Answer:
          <textarea type="text" id="no_good_text" >${preQuestion}</textarea>
          </label>
          <div class="buttonCenter">
          <button class="buttons" id="no-good">SELECT</>
          </div>
          </div>
        `);

        $("#no-good").click(function(){
          $(':button').prop('disabled', true);
          $('.buttons').css('background-color', 'black');
          qnaData.GTID = -1;
          let copyText = document.getElementById("no_good_text");
          let saveAnswer = copyText.value;
          saveAnswer = saveAnswer.replace(/\b(You recently asked Leana, ")/, "").replace(query, "").replace(/"/g, "");;
          saveAnswer = saveAnswer.replace(/\b(I don't think Leana gave you the best answer. A better answer is )/, "").trim();
          saveAnswer = saveAnswer.replace(/\b(and Leana couldn't find an answer to your question. I have an answer for you.)/, "");
          Object.assign(qnaData, {"custom_response" : saveAnswer });
          sendToDatabase();
          copyText.select();
          document.execCommand("Copy");
          window.open('https://diabetes.healthslate.com/facilityadmin/techsupport/direct-message/'+memberid);
        });
      });
    }

    let queryQuestion = getParameterByName('question');
    let memberid = getParameterByName('memberid');
    let hasAnswer = getParameterByName('hasanswer');
    if (queryQuestion && memberid && hasAnswer) {
        $('#incomingQuery').append(queryQuestion);
        $('#member').append(" " + memberid); 
       
        let preQuestion = 'You recently asked Leana, &quot;'+ queryQuestion ;
        if(hasAnswer == "true"){
          preQuestion +=  '&quot; I don\'t think Leana gave you the best answer. ' +
                          'A better answer is ';
        }
        else {
          preQuestion +=  '&quot; and Leana couldn\'t find an answer to your question. ' +
                          'I have an answer for you. '
        }
        handleSearch(queryQuestion, memberid, preQuestion);
        
    }
    else{
      $('.header').replaceWith('<h1>Bad Data</h1>')
      $('.query').remove();
      window.location.replace("http://google.com"); //This will redirect if there is not proper query string parameters.
  }                                                   //Turned off for testing.
});

/* Helper Functions */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createListing(question, data, i, memberid, prequestion) {
  let removeChars = /\[uc\]|\[nm\]|\[ns\]/g;
  let textAnswercleaned = data.textAnswer.replace(removeChars, "");
  let queryandAnswer = prequestion + textAnswercleaned

  $(".answers").append(`
    <div id=answer${i}><p class="score">Score: 
    ${data["@search.score"]}</p><p id="textAnswer${i}">
    ${textAnswercleaned}</p>
    <input type="text" class="textboxAnswer" id="textInput${i}" value="${queryandAnswer}"/>
    <div class="buttonCenter">
    <button class="buttons" id="myButton${i}">SELECT</>
    </div>
    </div>
  `)
  
    $("#myButton"+i).click(function(){
      $(':button').prop('disabled', true);
      $('.buttons').css('background-color', 'black');
      qnaData.GTID = data.id;
      qnaData.custom_response = "";
      sendToDatabase();
      let copyText = document.getElementById("textInput"+i);
      copyText.select();
      
      document.execCommand("Copy");
      window.open('https://diabetes.healthslate.com/facilityadmin/techsupport/direct-message/'+memberid);
    });
}

/* Send the JSON object to AWS Lambda
qnadata{
  "query" : string,
  "GTID"  :  int,
  "azure_response_array" : string,
  "custom_response" : string,
  "query_safgeID" : string
}
*/
function sendToDatabase(){
  let thisURL = 'https://ld05uagkqd.execute-api.us-east-1.amazonaws.com/prod/data';
  $.ajax({
    url: thisURL,
    dataType : 'json',
    contentType: 'application/json',
    type: 'POST',
    headers: {
      "Accept" : 'application/json'
    },
    data: JSON.stringify(qnaData),
    success: function(result){
      console.log(result);
    }


  });
 
}