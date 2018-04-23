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
          "Highlight": false
        }),
        success: function(data) {
        if(callback)callback(data);
        }
      });
    }
  
    function handleSearch(query, memberid) {
      azSearch(query, function(data) {
        if (!data) {
            console.log('No Matches');
           $('.header').append('<h3>No matches</h3>');
          return;
        }
        
          for(let i = 0; i < data.value.length; i++){
            createListing(data.value[i], i, memberid);
          }
       
      });
    }

    var queryQuestion = getParameterByName('question');
    var memberid = getParameterByName('memberid');
    if (queryQuestion && memberid) {
        $('#incomingQuery').append(queryQuestion);
        $('#member').append('<a target="_blank" href="https://diabetes.healthslate.com/app/educator/coachPatientMessages.action?patientId=' + memberid+'"> '+memberid+' </a>'); 
        handleSearch(queryQuestion, memberid);
    }
    else{
      $('.header').replaceWith('<h1>Bad Data</h1>')
      $('.query').remove();
      window.location.replace("http://google.com");
    }  
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

function createListing(data, i, memberid) {
  
  $(".answers").append(`
    <div id=answer${i}><p class="score">Score: 
    ${data["@search.score"]}</p><p id="textAnswer${i}">
    ${data.textAnswer}</p>
    <input type="text" class="textboxAnswer" id="textInput${i}" value="${data.textAnswer}"/>
    <div class="buttonCenter">
    <button id="myButton${i}">Copy to Clipboard</>
    </div>
    </div>
  `)
  
    $("#myButton"+i).click(function(){
    let copyText = document.getElementById("textInput"+i);
    copyText.select();
    document.execCommand("Copy");
    window.open('https://diabetes.healthslate.com/app/educator/coachPatientMessages.action?patientId='+memberid);
    });
  
 
  
}