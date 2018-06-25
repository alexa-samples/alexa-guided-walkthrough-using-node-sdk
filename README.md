# Alexa Skill Guided Walkthrough using the Node.js SDK v2

We recently released [version two of the Alexa Skills Kit (ASK) Software Development Kit (SDK) for Node.js](https://developer.amazon.com/blogs/alexa/post/decb3931-2c81-497d-85e4-8fbb5ffb1114/now-available-version-2-of-the-ask-software-development-kit-for-node-js), which introduced a fresh approach to handling requests and responses (among many other enhancements to the SDK). In our new code deep dive series, we’ll show you the ins and outs of the new SDK by providing a step-by-step code overview of the new features. We will also build a new skill from scratch, bit by bit, as we progress through the series.

Throughout this series, we will create a listening retention memory game skill that will help customers improve their listening skills in a fun way. Alexa will read a short passage and then ask customers one or more questions related to that passage. Alexa will generate the passages at random. If customer gets a question right, they get points! Eventually they could earn badges and other engaging experiences along the way.

Here's a sample conversation we want to build:

> **_Customer:_** _Alexa, open memory challenge._

> **_Alexa:_** _Welcome to memory challenge. I will read you a short passage, and then ask you question based on that. Are you ready?_

> **_Customer:_** _Yes._

> **_Alexa:_** _Ok. Here we go. John loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are John's favorite games for the Winter Olympics?_

> **_Customer:_** _Ice skating and skiing._

> **_Alexa:_** _Bingo! That's right. Do you want to continue?_

> **_Customer:_** _Yes._

As we build the skill, we will add features to it gradually, testing each one along the way. For the first code deep dive, we will build the scaffold for our skill using the new request handling features in version two of the ASK SDK for Node.js. You can [learn about the request handling features here](https://developer.amazon.com/blogs/alexa/post/9ec7c7d2-a937-4676-b936-48dd2abd0f66/what-s-new-with-request-handling-in-the-alexa-skills-kit-sdk-for-node-js) and then read the rest of this blog post to see those features and concepts implemented as we write the code from scratch for our AWS Lambda function, which will serve as the backend for requests coming to our skill.

## Let's begin

1. [Part 1: Introduction to the ASK Software Development Kit for Node.js](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/tree/master/part-1)
2. [Part 2: Introduction to Slots and Session Attributes in the ASK SDK for Node.js](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/tree/master/part-2)
