# Part 2: Introduction to Slots and Session Attributes in the ASK SDK for Node.js

In our [first code deep dive](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/tree/master/part-1), we covered the basic concepts of the new ASK SDK for Node.js, like `canHandle()`, `handle()`, and Response Builder. Be sure to check out the first post in this series. We will use the final code from the last deep dive as the starting point for today’s post on slots and session attributes.

This deep dive will teach you how to capture user input using slots and cater responses accordingly. You’ll also learn about session attributes and how to add request handlers for built-in intents like AMAZON.StartOverIntent, and AMAZON.YesIntent.

Here's a scenario that shows the capabilities we want to build into our listening retention memory game skill with this deep dive:

> **Customer:** Alexa, ask Memory Challenge to start the challenge _[This will trigger StartStoryIntent]_.

> **Alexa:** Welcome to Memory Challenge. I will read you a short passage, and then ask you questions based on that. Are you ready?

> **Customer:** Yes _[This will trigger AMAZON.YesIntent]_.

> **Alexa:** Jeff loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are Jeff's favorite games for the Winter Olympics?

> **Customer:** Skiing _[This will trigger AnswerIntent]_.

> **Alexa:** Yup! Skiing is correct. Here's your 2nd question - While traveling, Samantha likes to take her tooth brush, hair brush, face cream, and hair dryer. What does Samantha like to carry when she travels?

> **Customer:** Wallet _[This will trigger AnswerIntent]_

> **Alexa:** Nope! Wallet is incorrect.

> ....

> ....

> **Alexa:** Thank you for playing Memory Challenge. Your final score is 2 out of 5.

Before we begin writing code for our skill, it’s a good idea to think through the conversation, and determine the three main acts that our skill will be handling. Much like writing a script for a play or a movie, this exercise helps figure out the request handlers we would need. For example, the three main acts of our skill will be –

1. Read the Memory Challenge Story to the Customer (StoryHandler)
2. Capture the Response from the Customer, and Check If the Answer is Correct (AnswerHandler)
3. Get the Final Score (FinalScoreHandler)

With that out of the way, let’s start building.

## Act 1: Read the Memory Challenge Story to the Customer
We will start off by creating a new handler that will be responsible for reading the memory challenge stories to the customer. We'll call it `StoryHandler`.

### Step 1: Add a new handler - StoryHandler
As we did with the `LaunchRequestHandler`, we will start off with the basic scaffold for our new handler.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/1._CB475938919_.png)


### Step 2: Set conditions for the requests this handler is capable of handling
As we mentioned in the last deep dirve, in the new Alexa SDK, the request routing is based on a “can you handle this?” concept, which means that every handler lays out the specific condition/s that it is capable of handling.

Let's think about the conditions for our StoryHandler here. As you can see from the conversation above, our skill should read a new question in the following scenarios:

1. Customer starts the skill by saying, "Alexa, ask Memory Challenge to start the challenge." This will trigger `StartStoryIntent`, and our skill should respond with a new question.
2. Customer launches the skill by saying, "Alexa, open Memory Challenge," and then answers Yes (triggers `AMAZON.YesIntent`) to the welcome message prompt, "Welcome to Memory Challenge. I will read you a short passage, and then ask you question based on that. Are you ready?". This will trigger **AMAZON.YesIntent**, and our skill should respond with a new question.
3. Mid-way through the skill, the customer asks to "start over". This will trigger **AMAZON.StartOverIntent**, and our skill should respond with a new question.

Because all of these scenarios require the same execution logic, we can merge them all together to be handled by our `StoryHandler` request handler.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/2._CB475938913_.png)


### Step 3: Add the logic that should execute if canHandle returns true

**Get the story by calling the function getNextStory()**

As we established in the last step, if the canHandle() function returns true for `StoryHandler`, our skill should begin narrating the story. To get the story, we make a call to a little helper function `getNextStory()`, which returns the story to be narrated as an object of the form:

```
{
  "question":"Jeff loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are John's favorite games for the Winter Olympics?",
  "answer":["skating","ice skating","skiing"]
}
```

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/3._CB475938915_.png)


**Narrate the story to the customer by using the responseBuilder**

Next, we assign the question to the speechOutput variable, and generate a speech response by using the `speak()` method of `responseBuilder`.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/4._CB475938914_.png)

**Keep the session open**

Since we are expecting our customer to respond back, we add the `reprompt()` method to our `responseBuilder`. This will keep the session open for us, so the customer can respond back with an answer.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/5._CB475938940_.png)

**Generate the JSON response**

Finally, we add the `getResponse()` method to generate the JSON response back with our `speechOutput`.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/6._CB475938898_.png)

## Act 2: Capture the Response from the Customer, and Check If the Answer is Correct
We have accomplished the first act of our skill, which is to narrate the story to the customer. We are now ready for the second act, which is capturing the answer from the customer, checking if the answer is correct, and responding back accordingly. Then, asking the next question.

### Step 1: Set up a new handler - AnswerHandler
Create a new handler called `AnswerHandler`. This will be used when the customer provides an answer to our question and will trigger the `AnswerIntent`.

Like we've done before, we start off by capturing the `request`.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/7._CB475938863_.png)

### Step 2: Set conditions for the requests this handler is capable of handling
This will be a pretty straight forward canHandle() function. We just need to check if the intent name is `AnswerIntent`.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/8._CB475938862_.png)

### Step 3: Capture User Input and respond back

**Get session attributes**

We will be using session attributes to keep track of session-level data, like counter, number of correct answers, last question asked, etc. We will use attributes manager provided by the SDK to get and set the session attributes using the attributes manager's `getSessionAttributes`, and `setSessionAttributes` methods.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/9._CB475938856_.png)

**Capture the user input through the answer slot**

We navigate through the JSON request sent to our skill, and grab the user input provided through the `answer` slot defined in our interaction model.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/10._CB475938858_.png)

**Check answer**

We use our helper function `checkAnswer()` to check if the answer provided by the customer (answerSlot) matches the correct answer.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/11._CB475938819_.png)

**Get the next story**

We then get the next story using our helper function `getNextStory()`.
![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/12._CB475938845_.png)

Let's take a quick diversion to take a look at the `getNextStory` function. As you can see in the code below, we set up some attributes that will come in handy for us to keep track of number of questions asked (`attributes.counter`), number of correct (`attributes.correctCount`), number of incorrect answers (`attributes.wrongCount`). We increment these counters accordingly in the `checkAnswer()` function.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/13._CB475938847_.png)

**Generate speechOutput using session attributes**

Back in the AnswerHandler, we set up the speechOutput to read the result of the answer (correct/incorrect) as returned by the `checkAnswer()` function. We also pull the counter from the session attributes and include that in our response.

```
const speechOutput = result.message + "Here's your " + (attributes.counter + 1) + "th question - " + story.question;
```

Respond back with the status of the answer, and then the question.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/14._CB475938846_.png)

**Store the result of the last question in session attributes**

We store the result of the last question as a session attribute, and call attributes manager's setSessionAttributes() method to save the attributes, so they're available in the next interaction.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/15._CB475938840_.png)

**Generate the JSON response**

Since we are expecting the customer to respond back, we add the `reprompt()` method to our `responseBuilder`. This will keep the session open for us, so the customer can respond back with an answer. Finally, we add the `getResponse()` method to generate the JSON response back with our `speechOutput`.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/16._CB475939071_.png)

## Act 3: Get the Final Score
We will be using the session attribute counter (`attributes.counter`) to determine if the last question has been asked, which would mean that our skill should now respond with the final score. To deal with that, we will add one more handler - FinalScoreHandler, and add a condition to check if the number of questions asked (`attributes.counter`) equals the total number of questions available. If yes, we respond back with the final score.

**Set up the FinalScoreHandler**
![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/17._CB475939065_.png)

**Add counter condition to AnswerHandler**

If the counter is not equal to the number of questions yet, Alexa should hit the `AnswerHandler` again. But, to make sure that happens, we will make a small change to our condition for `AnswerHandler` - check if the number of questions asked (`attributes.counter`) is less than the total number of questions available.

We will be using session attributes to keep track of session-level data, like counter, number of correct answers, last question asked, etc. We will use attributes manager provided by the SDK to get and set the session attributes.

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/18._CB475939067_.png)

## Start Building

If you would like to build this skill with us throughout the series, follow the steps below to kick-start your skill:

1.  Create the skill in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
    - Create a new skill at developer.amazon.com. Call it "Memory Challenge."
    - Give it an invocation name of "memory game."
    - Click on JSON Editor and paste this [interaction model](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-2/interaction-model.json).
    - Click Save and Build Model.
2.  [Follow the steps here](https://github.com/alexa/skill-sample-nodejs-fact/blob/en-US/instructions/2-lambda-function.md) to create a new AWS Lambda function, and then paste [this final code](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-2/index.js) in the section titled **Function Code**.
3.  In the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask), test your skill in the Test tab by typing the phrase “_open memory challenge_”


## Source Code for This Deep Dive

1. [Final code for the Lambda function](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-2/index.js)
2. [Interaction model for the skill](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-2/interaction-model.json)

## More Resources
-	Code Deep Dive: Introduction to the ASK Software Development Kit for Node.js [TODO: Link]
- [What’s New with Request Handling in the Alexa Skills Kit SDK for Node.js](https://developer.amazon.com/blogs/alexa/post/9ec7c7d2-a937-4676-b936-48dd2abd0f66/what-s-new-with-request-handling-in-the-alexa-skills-kit-sdk-for-node-js)
- [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
