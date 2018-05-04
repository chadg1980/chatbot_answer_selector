let qnaData = {};
$(document).ready(function() {

    
  var QUESTION;
  let queryQuestion = getParameterByName('question');
  let memberid = getParameterByName('memberid');
  let hasAnswer = getParameterByName('hasanswer');
  /**
   * hasAnswer will be false while in conference mode
   */
  hasAnswer = "false";
  memberid = 14294;

  let url = "";
  let displayName;

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
  
  function handleSearch(query, memberid, preQuestion, dName, isAnswered) {
    azSearch(query, function(data) {
      if (!data) {
        console.log('No Data');
        $('.header').append('<h3>No matches</h3>');
        return;
      }
      let i;
      let top_score_answer = "{";              
      /* Send the JSON object to AWS Lambda
      qnadata{
        "query" : string,
        "GTID"  :  int,
        "azure_response_array" : array of strings,
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

      
      for(i = 0; i < data.value.length; i++){
        if(i != data.value.length-1){
          top_score_answer += data.value[i]["id"] +  ": " + data.value[i]["@search.score"] +", ";
        }
        else{
          top_score_answer += data.value[i]["id"] +  ": " + data.value[i]["@search.score"] + "}";
        }
        createListing(query, data.value[i], i, memberid, preQuestion, isAnswered);
      }
      Object.assign(qnaData, {"azure_response_array" : top_score_answer} );

      $(".answers").append(`
        <div id="answer${i}">
        <p><span class="no_good">No Good answer listed for</span> <span class="queryClass">&quot;${query}&quot;</span></p>
        <label>Add Custom Answer:
        <textarea type="text" id="no_good_text" >${preQuestion}</textarea>
        </label>
        <div class="buttonCenter">
        <button class="buttons" id="no-good">Copy To Clipboard</>
        </div>
        </div>
      `);

      $("#no-good").click(function(){
        $(':button').prop('disabled', true);
        $('.buttons').css('background-color', 'black');
        //BEGIN DELETE AFTER CONFERENCE:
        let saveAnswer = copyText.value;
        console.log(saveAnswer);
        copyText.select();
        document.execCommand("Copy");


        //END DELETE AFTER CONFERENCE
        /*
        qnaData.GTID = -1;
        let copyText = document.getElementById("no_good_text");
        let saveAnswer = copyText.value;
        console.log(saveAnswer);
        saveAnswer = saveAnswer.replace("Hi, "+ dName +", ", "");
        
        saveAnswer = saveAnswer.replace(/\b(You recently asked Leana, ")/, "").replace(query, "").replace(/"/g, "");;
        saveAnswer = saveAnswer.replace(/\b(I don't think Leana gave you the best answer. A better answer is )/, "").trim();
        saveAnswer = saveAnswer.replace(/\b(and Leana couldn't find an answer to your question. Here is the answer you should have received.)/, "");
        Object.assign(qnaData, {"custom_response" : saveAnswer });
        sendToDatabase();
        copyText.select();
        document.execCommand("Copy");
        window.open('https://diabetes.healthslate.com/facilityadmin/techsupport/direct-message/'+memberid);
        */
      });
    });
  }

  if(queryQuestion && memberid && hasAnswer){
    //url = "https://66r83wmh9a.execute-api.us-east-1.amazonaws.com/beta/displayname?member_id="+memberid;
    url = "https://66r83wmh9a.execute-api.us-east-1.amazonaws.com/beta/displayname?member_id="+14294;
    /* Get Display Name */
    $.ajax({
      url: url, 
      type: "GET",
      headers: {
          'Content-Type' : 'application/json'
      },
      accepts: "application/json; charset=utf-8",
      success: function(data){
        if(data){
          let getName =  JSON.parse(data) ;
          displayName = getName["display_name"];
          /* check for all querystring parameters */
          if (queryQuestion && memberid && hasAnswer) {
            $('#incomingQuery').append(queryQuestion);
            //$('#member').append(" " + memberid);  Commented out for conference
            $('#member').append(" HLTH" ); 
            
            let preQuestion = 'Hi, ' + displayName + ', you recently asked Leana, &quot;'+ queryQuestion ;
            if(hasAnswer == "true"){
              preQuestion +=  '&quot; I don\'t think Leana gave you the best answer. ' +
                              'A better answer is: ';
            }
            else {
              preQuestion +=  '&quot; and Leana couldn\'t find an answer to your question. ' +
                              'Here is the answer you should have received. '
            }
            /**
             * prequestion will be "" until after conference
             */
            preQuestion = "";
            memberid = "HLTH";
            handleSearch(queryQuestion, memberid, preQuestion, displayName, hasAnswer);
            
          }
          else{
            $('.header').replaceWith('<h1>Bad Data</h1>')
            $('.query').remove();
            window.location.replace("http://google.com"); //This will redirect if there is not proper query string parameters.
          }
        }
        else{
          displayName = ""
        }
      }
    });
  }
  else{
    $('.header').replaceWith('<h1>Bad Data</h1>')
    $('.query').remove();
    window.location.replace("http://google.com"); //This will redirect if there is not proper query string parameters.
  }

  $('#newQuery').bind('keyup', function(e){
    e.preventDefault()
    if(e.keyCode === 13){
      let newQuery = encodeURIComponent( $('#newQuery').val() );
      console.log(newQuery);
      newurl = replaceurl(window.location.href) + "&question=" + newQuery;
      console.log(newurl)
      location.replace(newurl);
    }
  })
})     
                                            
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

function createListing(question, data, i, memberid, prequestion, isAnswered) {
  let removeChars = /\[uc\]|\[nm\]|\[ns\]/g;
  let textAnswercleaned = data.textAnswer.replace(removeChars, "");
  let queryandAnswer = prequestion + textAnswercleaned
  if(isAnswered.localeCompare("true") == 0 && i == 0){
    
    $(".answers").append(`
    <div id=answer${i} class="correct">
    <h2>Bot Selected Answer</h2>
    <p class="score">Score: 
    ${data["@search.score"]}</p><p id="textAnswer${i}">
    ${textAnswercleaned}</p>
    <input type="text" class="textboxAnswer" id="textInput${i}" value="${queryandAnswer}"/>
    <div class="buttonCenter">
    <button class="buttons" id="myButton${i}">Copy To Clipboard</>
    </div>
    </div>
  `)

   /** button for choosing a better answer */
   $("#myButton0").click(function(){
    $(':button').prop('disabled', true);
    $('.buttons').css('background-color', 'black');
    qnaData.GTID = data.id;
    qnaData.custom_response = "";
    //sendToDatabase();
    
  });
  }
  else{
    $(".answers").append(`
    <div id=answer${i}><p class="score">Score: 
    ${data["@search.score"]}</p><p id="textAnswer${i}">
    ${textAnswercleaned}</p>
    <input type="text" class="textboxAnswer" id="textInput${i}" value="${queryandAnswer}"/>
    <div class="buttonCenter">
    <button class="buttons" id="myButton${i}">Copy To Clipboard</>
    </div>
    </div>
  `)

  /** button for choosing a better answer */
  $("#myButton"+i).click(function(){
    $(':button').prop('disabled', true);
    $('.buttons').css('background-color', 'black');
    qnaData.GTID = data.id;
    qnaData.custom_response = "";
    //sendToDatabase();                                                                             SEND TO DATABASE TURNED OFF
    let copyText = document.getElementById("textInput"+i);
    copyText.select();
    
    document.execCommand("Copy");
    //window.open('https://diabetes.healthslate.com/facilityadmin/techsupport/direct-message/'+memberid);  OPEN NEW WINDOW TURNED OFF
    
  });
  }

}



/* Send the JSON object to AWS Lambda then to Airtable
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
    crossDomain: true,
    headers: {
      'accept' : 'application/json',
      'Access-Control-Allow-Origin' : '*'
    },
    data: JSON.stringify(qnaData),
    success: function(result){
      console.log(result);
    }
  });
}

function replaceurl(oldURL){
  let urlArray = oldURL.split("?");
  let base = urlArray[0];
  //let newmemberid = getParameterByName('memberid'); STATIC NUMBER FOR THE CONFERENCE
  let newmemberid = 0
  let newhasAnswer = "false";
  return (base+"?memberid="+newmemberid+"&hasanswer="+newhasAnswer);
  
}
