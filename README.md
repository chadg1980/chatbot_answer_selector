# Chatbot Answer Selector README

This tool will be opened from a link in Slack.  
The Chatbot answer selector will receive a Query as a query string parameter. `?question=what%20is%20yoga&memberid=14294` 
`question` `string`
`memberid` `number`
and a member ID
The query will be sent to the Leana Diagnostic API `https://xnoyn83321.execute-api.us-west-2.amazonaws.com/dev/lenaquery`  
The return value will include the top 3/4 answers.  
The answers will be displayed as buttons for the Expert to select.  
The Expert will select the best possible answer.  
The Answer text will be copied to the clipboard.  
A new window will open to the members dashboard.   
`https://diabetes.healthslate.com/app/educator/coachPatientMessages.action?patientId=14294`   
1. this links to the old portal.  
2. this link only works if the Expert is logged in already.  
3. this links only to the current facility, in this case DPP.  


