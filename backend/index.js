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
          let i;
          let preQuestion = 'You recently asked Leana &quot;'+ query +
              '&quot; I don\'t think Leana gave you the best answer. ' +
              'A better answer is ';
              
              
          for(i = 0; i < data.value.length; i++){
            createListing(query, data.value[i], i, memberid, preQuestion);
          }
          
          $(".answers").append(`
          <div id="answer${i}">
          <p><span class="no_good">No Good answer listed for</span> <span class="queryClass">&quot;${query}&quot;</span></p>
          <input type="text" class="textboxAnswer" id="no-good-text" value="${preQuestion}"/>
          <div class="buttonCenter">
          <button id="no-good">Copy to Clipboard</>
          </div>
          </div>
          `);
          $("#no-good").click(function(){
            let copyText = document.getElementById("no-good-text");
            copyText.select();
            console.log(copyText.textContent);
            document.execCommand("Copy");
            window.open('https://diabetes.healthslate.com/app/educator/coachPatientMessages.action?patientId='+memberid);
            });

      });
    }

    var queryQuestion = getParameterByName('question');
    var memberid = getParameterByName('memberid');
    if (queryQuestion && memberid) {
        $('#incomingQuery').append(queryQuestion);
        $('#member').append(" " + memberid); 
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

function createListing(question, data, i, memberid, prequestion) {
  let queryandAnswer = prequestion + data.textAnswer
     
  $(".answers").append(`
    <div id=answer${i}><p class="score">Score: 
    ${data["@search.score"]}</p><p id="textAnswer${i}">
    ${data.textAnswer}</p>
    <input type="text" class="textboxAnswer" id="textInput${i}" value="${queryandAnswer}"/>
    <div class="buttonCenter">
    <button id="myButton${i}">Copy to Clipboard</>
    </div>
    </div>
  `)
  
    $("#myButton"+i).click(function(){
    let copyText = document.getElementById("textInput"+i);
    copyText.select();
    console.log(copyText.textContent);
    document.execCommand("Copy");
    window.open('https://diabetes.healthslate.com/app/educator/coachPatientMessages.action?patientId='+memberid);
    });
  
 
  
}