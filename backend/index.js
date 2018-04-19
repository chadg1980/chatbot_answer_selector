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
          "Verbose": false,
          "Highlight": false
        }),
        success: function(data) {
        callback(data);
        }
      });
    }
  
    function handleSearch(query) {
      azSearch(query, function(data) {
        if (!data.value) {
            console.log('No Matches');
           /*$('.answer-listing-wrap').append('<h3>No matches</h3>');*/
          return;
        }
        data.value.forEach((el) =>{
            console.log(el);
          //createListing(el);
        });
      });
    }

    var queryQuestion = getParameterByName('question');
    if (queryQuestion) {
        //$('input').val(queryQuestion);
        //$('.search').trigger('click');   
        azSearch(queryQuestion);
    }  

});