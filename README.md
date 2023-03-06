# StockScope

Project Description:   
Financial statements are significant to investors because they may reveal a lot about a company's income, costs, profitability, debt burden, and capacity to pay short- and long-term financial commitments. That’s why we are planning to build a website that provides investors with real-time data, news, analysis, tools, and insights on stocks to help them make informed investment decisions.
 
Our application will have a landing page that will contain vital information for example Top gains which will provide a list of all the stocks that tend to close with a higher price than what they opened with/their previous close price in an intraday market. Similarly, top losers will do the opposite i.e. it will display all the stock that lends to close with a lower price than what they opened with/their previous close price in an intraday market.  Additionally, our landing page will also display the latest news related to the market.
 
There will be a search bar that will allow users to search for the stocks. When the user searches for a particular stock and selects it then all the financial insights about the stock such as its market open price, close price, volume, balance sheet, cash flow, earnings, etc. will be displayed to the user.
 
There will be a user profile that will allow the user to display and modify his details. Users can also create their own portfolio by adding or removing stocks. Users can see their up-to-date profits/losses with this feature. Registered Users can chat with financial experts to get tips related to the stock market.
 
Course Technologies:

1. React: We will be using React as a Front-end JavaScript framework library to create the single-page web application. The reason for using React is that we will be designing multiple UI components which can be reused and composed to create more complex interfaces.
2. Redis: We will be using Redis to cache our static data and web pages. Besides caching, we will also be implementing Redis for session-storage
3. Firebase: It will be used to authorize the user for our website. It provides a variety of sign-in methods, including email and password, Google, Facebook, Twitter, GitHub, phone numbers, and custom authentication systems.
4. Socket.io: Socket.io provides real-time bi-directional communication between the client and the server which will allow us to perform instant messaging and other real-time requests and responses features.

Independent Technologies:

1. Elastic Search: It is an open-source search engine that is used for full-text search, real-time analytics, and other applications that require fast and flexible search functionality. We will be using this technology to search for a particular stock.
2. Amazon EC3, Netlify or Linode: Netlify or Linode is a cloud-based platform that specializes in web creation and hosting. It provides a one-stop shop for developing, deploying, and administering contemporary online apps and websites.
3. Recharts: Recharts is an open-source, lightweight, and renders SVG components to produce stunning, interactive charts. It's simple to use, and the documentation is entertaining. It has built-in general chart options such as legend tooltips and labels, and it performs well with static charts. When dealing with numerous animated charts on the same page and large datasets, it can be sluggish, but it will suffice in most circumstances.

4. Docker: Docker allows you to package an application with its environment and all of its dependencies into a "box", called a container. Usually, a container consists of an application running in a stripped-to-basics version of a Linux operating system. An image is the blueprint for a container, a container is a running instance of an image. We’ll be using docker to create images of both the node application and the react application.

