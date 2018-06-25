const Alexa = require('ask-sdk-core');

const WELCOME_MESSAGE = "Welcome to memory challenge. I will read you a short passage,\
                         and then ask you question based on that. Are you ready?";
const HELP_MESSAGE = "I will read you a short passage,\
                      and then ask you question based on that. Are you ready?";

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === "LaunchRequest";
	},
	handle(handlerInput) {
		const speechOutput = WELCOME_MESSAGE;
		const repromptSpeechOutput = HELP_MESSAGE;
		return handlerInput.responseBuilder
			.speak(speechOutput)
			.reprompt(repromptSpeechOutput)
			.getResponse();
	}
};

const StoryHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === "IntentRequest" &&
           (request.intent.name === "StartStoryIntent" ||
            request.intent.name === "AMAZON.StartOverIntent" ||
            request.intent.name === "AMAZON.YesIntent");
	},
	handle(handlerInput) {
		const story = getNextStory(handlerInput);
		const speechOutput = story.question;
		return handlerInput.responseBuilder
			.speak(speechOutput)
			.reprompt(speechOutput)
			.getResponse();
	}
};

const AnswerHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		return request.type === "IntentRequest" &&
           request.intent.name === "AnswerIntent" &&
           attributes.counter < attributes.storiesDeck.length - 1;
	},
	handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
		const answerSlot = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    const result = checkAnswer(handlerInput, answerSlot);
		const story = getNextStory(handlerInput);
		const speechOutput = result.message + "Here's your " + (attributes.counter + 1) + "th question - " + story.question;

		attributes.lastResult = result.message;
		handlerInput.attributesManager.setSessionAttributes(attributes);

		return handlerInput.responseBuilder
			.speak(speechOutput)
			.reprompt(speechOutput)
			.getResponse();
	}
};


const FinalScoreHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		return request.type === "IntentRequest" &&
           request.intent.name === "AnswerIntent" &&
           attributes.counter == attributes.storiesDeck.length - 1;
	},
	handle(handlerInput) {
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		return handlerInput.responseBuilder
			.speak(attributes.lastResult + " Thank you for playing Memory Challenge. Your final score is " + attributes.correctCount + " out of " + (attributes.counter + 1))
			.getResponse();
	}
};


function getNextStory(handlerInput){
	const attributes = handlerInput.attributesManager.getSessionAttributes();
	var storiesDeck = [];

	if (!attributes.counter){ //skill launched for first time - no counter set
		storiesDeck = shuffle(stories);
		attributes.storiesDeck = storiesDeck;
		attributes.counter = 0;
		attributes.correctCount = 0;
		attributes.wrongCount = 0;
	}
	else{
		storiesDeck = attributes.storiesDeck;
	}

	const story = storiesDeck[attributes.counter];
	attributes.lastQuestion = story;
	handlerInput.attributesManager.setSessionAttributes(attributes);
	return story;
}

function checkAnswer(handlerInput,answerSlot){
	const attributes = handlerInput.attributesManager.getSessionAttributes();
	var status = "";
	var message ="";

	if (attributes.lastQuestion.answer.includes(answerSlot)){
		console.log("correct");
		message = "Yup! " + answerSlot + " is correct. ";
		attributes.correctCount += 1;
		status =true;

	}
	else{
		console.log("wrong");
		message = "Nope! " + answerSlot + " is incorrect. ";
		attributes.wrongCount += 1;
		status = false;
	}
	attributes.counter += 1;
	handlerInput.attributesManager.setSessionAttributes(attributes);
	return {"status":status,"message":message};
}

function shuffle(arr) {
	var ctr = arr.length, temp, index;
	while (ctr > 0) {
		index = Math.floor(Math.random() * ctr);
		ctr--;
		temp = arr[ctr];
		arr[ctr] = arr[index];
		arr[index] = temp;
	}
	return arr;
}

const stories = [
	{
		"question":"Jeff loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are Jeffs favorite games for the Winter Olympics?","answer":["skating","ice skating","skiing"]
	},
	{
		"question":"While traveling, Samantha likes to take her tooth brush, hair brush, face cream, and hair dryer. What does Samantha like to carry when she travels?","answer":["tooth brush","hair brush","hair dryer","face cream"]
	}
];

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		StoryHandler,
		AnswerHandler,
		FinalScoreHandler
	)
	.lambda();
