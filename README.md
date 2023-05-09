**CS554 - Stockscope: Portfolio Management Application**

**Team members**

1. Sagar Chakravarthy Mathada Veera - 20011401

2. Chaitanya pawar - 20008880

3. Akshay Pradeep Pathade - 20009092

4. Naveen Mathews Renji - 20016323

5. Manudeep Reddy - 20012372

**Project Description**

Financial statements are significant to investors because they may reveal much about a company's income, costs, profitability, debt burden, and capacity to pay short- and long-term financial commitments. That's why we plan to build a website that provides investors with real-time data, news, analysis, tools, and stock insights to help them make informed investment decisions. Our application will have a landing page containing vital information, for example, top gains, which will provide a list of all the stocks that tend to close with a higher price than what they opened with/their previous close price in an intraday market. Similarly, top losers will do the opposite, i.e., it will display all the stock that lends to close with a lower price than what they opened with/their previous close price in an intraday market. Our landing page will also display the latest news related to the market. There will be a search bar that will allow users to search for the stocks. When the user searches for a particular stock and selects it, all the financial insights about the stock, such as its market open price, close price, volume, balance sheet, cash flow, earnings, etc., will be displayed to the user. There will be a user profile that will allow the user to display and modify his details. Users can also create their portfolios by adding or removing stocks. Users can see their up-to-date profits/losses with this feature. Registered Users can chat with financial experts to get tips related to the stock market.

**Course Technologies**

1.  React: We have used React to build our frontend
2.  Redis: We have used Redis to cache the API results from the financial APIs. This data will be refreshed every few minutes to keep the data up to date.
3.  Firebase: We have used Firebase for user authentication. Users can signup to our application using Email/Password or Google signup.
4.  Socket.io: We have used Socket.io for chat functionality between the users and the agent and to listen to the financial APIs for real-time data.

**Independent Technologies**

1.  Heroku/Amazon EC2: We have deployed our application to the Heroku environment. We have used Heroku because it's free. We hadn't listed Heroku in the initial project proposal, but it's very similar to the ones we have listed.
2.  Docker: We have created a container using Docker. This container can be run in the local machine or used to deploy to any environment.
    Note: We have used two of the four listed independent technologies.

**Few things to note before grading the project**

1. All the HTML validation errors we are encountering in our application are either from Bootstrap, CSS, or React.
2. The finance API we are listening to through the web socket closes at 8 pm every day. So, if you want to get live updates for the stocks in the portfolio, use the application when the stock market is open, that is from 9 am to 4 pm. You'll be able to use the application outside this timeframe as well, but you'll not be getting live data.
3. DO NOT USE STEVENS-GUEST WIFI OR ANY OTHER NETWORK THAT HAS RESTRICTED ACCESS TO THE INTERNET. Some restricted networks may timeout the Mongo connection. If you face this issue, try with a different network.
4. Do not create a user account directly from the Firebase console and use that user credentials to use the application. On signup, we have a dependency with one more API to create a user object on the MongoDB collection. Only create users from the application.
5. As we have rate limits on the external APIs we are using, please use the application at a reasonably slow pace so that those rate limits are not reached.

**Instructions to run the project on your local machine**

**Redis**

    `Open Ubuntu cmd prompt
    - sudo service redis-server restart`

**Backend**

    `cd back-end
    npm install
    npm start`

**Frontend**

    `cd front-end
    npm install
    npm start`

**Instructions to create and use the Docker Container Image**

- Install Docker Desktop software
- Run the below cmd

  `docker compose up`

**Resources**
MongoDB Server console: https://cloud.mongodb.com/v2/638bc7a8b433235f5269396b#/clusters

Firebase Console: https://console.firebase.google.com/u/1/project/stocksscope/overview

You'll have access to both the consoles.
