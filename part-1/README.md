# Part 1: Introduction to the ASK Software Development Kit for Node.js

This walkthrough will teach you how to build request handlers for incoming requests using canHandle() and handle() methods. You’ll also learn how to register the request handlers.

We have one main objective for this walkthrough – when customers start the skill by saying, "Alexa, open memory challenge," we want the skill to respond with a welcome greeting like the one we included in the conversation above (“Welcome to memory challenge…”). Let’s start building.

## Step 1: Include the ASK SDK

Since we’ll be using version two of the ASK SDK for Node.js to write this Lambda function for our skill, the first thing we’ll do is use JavaScript’s require function to include the core ASK SDK module in our Lambda function. The Core Alexa SDK module provides us everything we need to get our skill started. As we expand the functionality of our skill in future deep dives, we will look into [other flavors](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/wiki/Setting-Up-The-ASK-SDK) of the ASK SDK for Node.js.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-1._CB477971882_.png)

## Step 2: Write Your First Handler to Handle the Request of Type LaunchRequest

When a customer starts your skill by saying, “open memory challenge,” your skill receives a request of type “LaunchRequest.”

To handle this request, wecreate a new object called LaunchRequestHandler. You can name it whatever you want but give it a name that’s related to the kind of requests it’s capable of handling for easy recall. For example, in our case, we name it LaunchRequestHandler, since it would be doing just that–handling launch requests.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-2._CB477971876_.png)

## Step 3: Set Conditions for the Requests This Handler Can Handle

This is probably the most significant change compared to the previous version of the ASK SDK. In the new SDK, the request routing is based on a “_can you handle this_?” concept, which means that every handler lays out the specific condition/s that it is capable of handling. This is done within the canHandle() function defined inside the handler. This function is required in every handler. As we will see in later installments of this series, this lets you write a single handler for multiple intents, or handlers that check for other values, like [session attributes](https://developer.amazon.com/blogs/alexa/post/08edaa00-59e2-46b7-aace-4080f2a87450/using-session-attributes-in-your-alexa-skill-to-enhance-the-voice-experience).

The second piece to this is the handle() function, which includes the execution logic for the handler. If the condition/s set in the canHandle() function return true, the code included in the handle() function is executed. If not, the search for the appropriate handler continues.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-3._CB477971878_.png)

## Step 4: Grab the Request

When a customer interacts with an Alexa skill, your service (Lambda function) receives a POST request containing a JSON body. This request body contains the parameters we would need to figure out what the customer is asking for and is made available by the SDK to all request handlers through a _HandlerInput_ object.

Here’s an example of what the HandlerInput object may look like for a LaunchRequest:

```json
{
    "requestEnvelope": {
        "version": "1.0",
        "session": {
          . . .
          . . .
        },
        "context": {
          . . .
          . . .
        },
        "request": {
            "type": "LaunchRequest",
            "requestId": "amzn1.echo-api.request.403abfd8-625c-4717-94e3-76c20e449c7a",
            "timestamp": "2018-05-24T02:35:25Z",
            "locale": "en-US",
            "shouldLinkResultBeReturned": false
        }
    },
    "context": {
      . . .
      . . .
    },
    "attributesManager": {},
    "responseBuilder": {}
}
```

What we are interested in is the request object inside requestEnvelope in HandlerInput object. We grab that and assign it to a variable named _request_. We will use this variable to set our “can you handle this” conditions for our LaunchRequestHandler in the next step.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-4._CB477972298_.png)

## Step 5: Add the Conditions This Handler Can Handle

Next, we set the conditions. We want this handler to execute if the request type is a LaunchRequest. Remember for the handler to execute the logic inside the handle() function, the canHandle() function must return true. We return true if the request type is a ‘LaunchRequest’ (you can review the sample request JSON above to see that the request type for that example is in fact LaunchRequest).

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-5._CB477971872_.png)

## Step 6: Add the Logic That Should Execute if canHandle Returns True

Let’s add the logic for our request handler inside the handle() function. If the request is a LaunchRequest, that means that the customer has asked the skill to be launched, without a specific request to a functionality within the skill, so we should probably welcome the customer with a welcome message and tell them briefly what the skill can do.

We generate a speech response by using the speak() method of responseBuilder. The responseBuilder is a helper function provided by the ASK SDK and is used to generate all kinds of responses back to the customer (speech, cards, images, plain text and rich text for devices with display). We will dive deep into ResponseBuilder in the future code walkthroughs, but for now we will use the .speak() method to generate the welcome message speech and then use the .getResponse() method to package that into a JSON response and send it back to the customer.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-6._CB477971860_.png)

Let's refactor that a bit to improve readability:

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-6a._CB477971862_.png)

## Step 7: Create the skillBuilder Object

We are almost done with our basic version of the skill. All we need to do now is create an instance of the skill. There are a few different skill builders you can use depending on the features your skill needs. Because our skill is fairly straightforward, we will use CustomSkillBuilder. You can read more about other skill builders available [here.](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/wiki/Skill-Builders)

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-7._CB477971856_.png)

## Step 8: AWS Lambda Function Handler (exports.handler)

Since we are using AWS Lambda to host our skill code, we need to create handler object (exports.handler), which will serve as the entry point that AWS Lambda will use to execute our function code.

To ensure that this AWS Lambda entry point is aware of the names of all our request handlers, we register them by using skill builder’s built-in addRequestHandlers() method. Since we only have one request handler for now, LaunchRequestHandler, we add that. You will notice in future code deep dives as we add more request handlers that the order in which you type them inside the addRequestHandlers matters. It starts with the first handler and goes down the list asking the question “can you handle this” until it gets to a request handler that returns true.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-9(1)._CB476252662_.png)

## Step 9: Get Your Code Ready for AWS Lambda

Finally, we call the .lambda(), and pass it the handler object:

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/sdk-walkthrough-10(1)._CB476252656_.png)

## Start Building

Now we’ve created a basic scaffold for our skill. If you would like to build this skill with us throughout the series, follow the steps below to kick-start your skill:

1.  Create the skill in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
    *   Create a new skill at developer.amazon.com. Call it "Memory Challenge."
    *   Give it an invocation name of "memory game."
    *   Click on JSON Editor and paste this [interaction model](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-1/interaction-model.json).
    *   Click Save and Build Model.
2.  [Follow the steps here](https://github.com/alexa/skill-sample-nodejs-fact/blob/en-US/instructions/2-lambda-function.md) to create a new AWS Lambda function, and then paste [this final code](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-1/index.js) in the section titled **Function Code**.
3.  In the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask), test your skill in the Test tab by typing the phrase “_open memory challenge_”

## Source Code for this walkthrough

1. [Final code for the Lambda function](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-1/index.js)
2. [Interaction model for the skill](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-1/interaction-model.json)

## What's Next
In the next code deep dive, we will add some more request handlers to our skill to handle customer requests like, “Alexa, ask memory challenge to start a nerdy memory challenge.” We will be using slots to accept customer input and cater our responses accordingly.

## More Resources

*   [What’s New with Request Handling in the Alexa Skills Kit SDK for Node.js](https://developer.amazon.com/blogs/alexa/post/9ec7c7d2-a937-4676-b936-48dd2abd0f66/what-s-new-with-request-handling-in-the-alexa-skills-kit-sdk-for-node-js)
*   [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
