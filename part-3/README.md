# Part 3: Using the Display Directives in the ASK SDK for Node.js

We recently released [version two of the Alexa Skills Kit (ASK) Software Development Kit (SDK) for Node.js](https://developer.amazon.com/blogs/alexa/post/decb3931-2c81-497d-85e4-8fbb5ffb1114/now-available-version-2-of-the-ask-software-development-kit-for-node-js), which introduced a fresh approach to handling requests and responses (among many other enhancements to the SDK). In our new code deep dive series, we’ll show you the ins and outs of the new SDK by providing a step-by-step code overview of the new features. We will also build a listening retention memory game skill from scratch, bit by bit, as we progress through the series.  

In our  [first code deep dive](https://developer.amazon.com/blogs/alexa/post/dff6f892-ee90-4fef-954f-27ad84eb7739/code-deep-dive-introduction-to-the-ask-software-development-kit-for-node-js) , we covered the basic concepts of the new ASK SDK for Node.js, like `canHandle()`, `handle()`, and Response Builder. In the  [second deep dive](https://developer.amazon.com/blogs/alexa/post/f167aa0f-8abe-4602-b985-65118b3032ca/code-deep-dive-slots-and-session-attributes-in-the-ask-sdk-for-node-js) , we looked at how to capture customer input using slots and session attributes for persistence. We will use the  [final code](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-2/index.js)  from the last deep dive as the starting point for today’s post on display directives. 

As a skill builder, you can choose whether or not to specifically support a particular interface, such as screen display. For the best customer experience, however, you should plan to create a conditional workflow so that customers who use devices without a screen, like Amazon Echo or Echo Plus can have an optimized experience, and so can the customers accessing your skill from Echo Show, Echo Spot or Fire TV Cube. Even if the screen experience is not the focus of your skill, you should still think about how visual components could enhance your skill on devices with screens. 

This post will build on top of the last couple deep dives, and provide a step-by-step walkthrough for delighting your customers by providing a screen experience for your skill. 

In this walkthrough we will show you how to: 

1. Detect if the device has display. We will use this  [Alexa Skill recipe](https://developer.amazon.com/blogs/alexa/post/6839eb1c-f718-41cd-ad0c-6ba59c5360f5/alexa-skill-recipe-making-the-most-of-devices-that-support-display)  to do this. 
2. Use the display directives provided by the ASK SDK to display relevant information on the screen, such as a background image when the skill is launched on Echo Show, Echo Spot, Fire TV Cube or any other Alexa enabled device with a screen. Or, how to display the current score along with a picture on the screen after each question.

Here’s an example of what those screens may look like on a square and a round display:


![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/welcome_show._CB469840198_.png)

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/welcome_spot._CB469840196_.png)

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/question_show._CB469840194_.png)

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/question_spot._CB469840192_.png)

Let’s get started. 

## Step 0: Enable the Display Interface for Your Skill
First, for your skill to be able to serve on display devices, you need to enable it through the developer console as shown below.

![]( [https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/skill-builder-interfaces._CB501055934_.png](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/skill-builder-interfaces._CB501055934_.png) )

## Step 1: Check If the Device Has a Screen

Let’s first write the code to check if the requesting device has a display screen. We will do that by writing a helper function, which we can call from all our handlers whenever needed. We will call this hasDisplay()

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/1(1)._CB469841459_.png)

## Step 2: Write a Helper Function to Create a Display
Next, let’s write a helper function that we can call from our handlers after checking that the requesting device has display screen our skill can use. We will call this getDisplay(). 

To generate our display response, we use Alexa SDK’s built-in ImageHelper() and RichTextContentHelper() methods. You can learn more about the display directives  [here.](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html)  

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/2(1)._CB469841421_.png)

## Step 3: Set Up the Handlers to Use These Display Helper Functions
In our LaunchRequestHandler, we first use the supportsDisplay() function to check if the device supports a display, and then create our response accordingly. If the requesting device does support a display, we use our getDisplay() function to generate our response, which includes a display screen. 

### Inside LaunchRequestHandler

**Using BodyTemplate7**

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/3(1)._CB469841417_.png)

### Inside StoryHandler
Same treatment as LaunchRequestHandler – we check if the device supports display, and then respond accordingly. 

**Using BodyTemplate2**

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/4(1)._CB469841418_.png)

### Inside AnswerHandler
Same treatment as LaunchRequestHandler and StoryHandler – we check if the device supports display, and then respond accordingly. 

**Using BodyTemplate2**

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/5(1)._CB469841409_.png)

### Inside FinalScoreHandler
Same treatment as LaunchRequestHandler, StoryHandler, and AnswerHandler – we check if the device supports display, and then respond accordingly. 

**Using BodyTemplate7**

![](https://m.media-amazon.com/images/G/01/DeveloperBlogs/AlexaBlogs/default/6(1)._CB469841625_.png)

## Start Building

If you would like to build this skill with us throughout the series, follow the steps below to kick-start your skill:

1. Create the skill in the  [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) .
	* Create a new skill at developer.amazon.com. Call it “Memory Challenge.”
	* Give it an invocation name of “memory game.”
	* Click on JSON Editor and paste this  [interaction model](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-3/interaction-model.json) .
	* Click Save and Build Model.
2. [Follow the steps here](https://github.com/alexa/skill-sample-nodejs-fact/blob/en-US/instructions/2-lambda-function.md)  to create a new AWS Lambda function, and then paste  [this final code](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-3/index.js)  in the section titled Function Code.
3. In the  [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) , test your skill in the Test tab by typing the phrase “_open memory challenge_”

## Source Code for This Deep Dive

1. [Final code for the Lambda function](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-3/index.js) 
2. [Interaction model for the skill](https://github.com/alexa/alexa-guided-walkthrough-using-node-sdk/blob/master/part-3/interaction-model.json) 

## More Resources
* [Code Deep Dive: Introduction to the ASK Software Development Kit for Node.js](https://developer.amazon.com/blogs/alexa/post/dff6f892-ee90-4fef-954f-27ad84eb7739/code-deep-dive-introduction-to-the-ask-software-development-kit-for-node-js) 
* [Code Deep Dive: Slots and Session Attributes in the ASK SDK for Node.js](https://developer.amazon.com/blogs/alexa/post/f167aa0f-8abe-4602-b985-65118b3032ca/code-deep-dive-slots-and-session-attributes-in-the-ask-sdk-for-node-js) 
* [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) 
* [Alexa Skill Recipe: Making the Most of Devices That Support Display](https://developer.amazon.com/blogs/alexa/post/6839eb1c-f718-41cd-ad0c-6ba59c5360f5/alexa-skill-recipe-making-the-most-of-devices-that-support-display) 