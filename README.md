## Chatbot Answer Selector 
Chatbot Answer Selector (CAS)
When the Subject Matter Expert (SME) sees a Question that the chatbot did not answer correctly, the CAS will give a quick way for the SME to respond to the customer.

## Motivation
The chatbot is the way we are heading, but the chatbot does not give the correct answer every time. To get the end user the best possible experience, the CAS was created. Also when top answer given is not the best answer, the data scientist needs to collect this data from the SME so the chatbot can be 'learning' and give a better answer in the future. 
When the SME is chatting with a live human, there is a search bar to quickly find the next question the end user might have. 

### Details
A portal channel monitors the incoming questions to the bot and answer the chatbot sent to the user, with a SME monitoring the channel. When the SME finds the chatbot does not send the best answer, the SME can click the button to open the CAS.
When the CAS is open it sends the question to an API created by a data scientist, returning the top scoring answers, for the SME to choose from. With an extra spot for the SME to write a customer response. 
The CAS also makes a call to the database to retrieve the end users display name. The display name will show the SME, and also be added to the answer to make the answer more personal. 
The SME will pick the best answer for the question the end user asked, or write a custom answer, and press the button. 
The selected answer will be sent to Airtable, allowing the chatbot to be trained and get better, at the same time the message is send to the user via in-app message.




## Technology Used

### Front End
* HTML/CSS
* Javascript
* jQuery

### Back End
* AWS API Gateway
* AWS Lambda
* Node.JS
* (Airtable)[https://airtable.com/] - Airtable 

