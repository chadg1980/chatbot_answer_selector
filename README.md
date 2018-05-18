# Chatbot Answer Selector README

This tool will be opened from a link in Slack.  
The Chatbot answer selector will receive a Query as a query string parameter. `?question=what%20is%20yoga&memberid=14294` 
`question` `string`
`memberid` `number`
and a member ID
The query will be sent to the Leana Diagnostic API `https://xnoyn83321.execute-api.us-west-2.amazonaws.com/dev/lenaquery`  
The return value will include the top 5 answers. Plus a spot available to fill in a custom anser.
The Expert will select the best possible answer. or fill in an answer.
The Answer or custom answer text will be copied to the clipboard.  
A new window will open to the members dashboard.   

1. The button links to the new portal message page with the text on the clipboard.  
2. The expert needs to be logged in, if not logged in the login page is displayed.
3. The expert needs to have DPP selected, if not the message window will not be displayed.  


