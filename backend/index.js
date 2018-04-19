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
  
    function handleSearch(query) {
      azSearch(query, function(data) {
        if (!data) {
            console.log('No Matches');
           /*$('.answer-listing-wrap').append('<h3>No matches</h3>');*/
          return;
        }
        data.value.forEach((el) =>{
          createListing(el);
        });
      });
    }

    var queryQuestion = getParameterByName('question');
    if (queryQuestion) {
        //$('input').val(queryQuestion);
        //$('.search').trigger('click');   
        $('#incomingQuery').append(queryQuestion);
        handleSearch(queryQuestion);
    }  
    var memberid = getParameterByName('memberid');
    if (memberid) {
        //$('input').val(queryQuestion);
        //$('.search').trigger('click'); 
        $('#member').append(' ' + memberid); 
        console.log(memberid);
        
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

function createListing(data, i) {
  $(".answers").prepend(`<div>${data.textAnswer}</div>`)
  
}