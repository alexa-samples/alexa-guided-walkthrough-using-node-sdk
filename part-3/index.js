const Alexa = require('ask-sdk-core');

const WELCOME_MESSAGE = "Welcome to memory challenge. I will read you a short passage,\
                         and then ask you question based on that. Are you ready?";
const HELP_MESSAGE = "I will read you a short passage,\
                      and then ask you question based on that. Are you ready?";
const BACKGROUND_IMAGE_URL = "http://ajotwani.s3.amazonaws.com/alexa/background.png"


const LaunchRequestHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === "LaunchRequest";
	},
	handle(handlerInput) {
		const speechOutput = WELCOME_MESSAGE;
		const repromptSpeechOutput = HELP_MESSAGE;
		var response = "";

		const attributes = handlerInput.attributesManager.getSessionAttributes();

		if (supportsDisplay(handlerInput)) {
			const display_type = "BodyTemplate7"
			const image_url = BACKGROUND_IMAGE_URL;
			response = getDisplay(handlerInput.responseBuilder, attributes, image_url, display_type)
		}
		else{
			response = handlerInput.responseBuilder
		}

		return response
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

		const attributes = handlerInput.attributesManager.getSessionAttributes();
		var response = "";

		if (supportsDisplay(handlerInput)) {
			const image_url = attributes.lastQuestion.image;
			const display_type = "BodyTemplate2"
			response = getDisplay(handlerInput.responseBuilder, attributes, image_url, display_type)
		}
		else{
			response = handlerInput.responseBuilder
		}

		return response
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

		var response = "";

		attributes.lastResult = result.message;
		handlerInput.attributesManager.setSessionAttributes(attributes);

		if (supportsDisplay(handlerInput)) {
			const image_url = attributes.lastQuestion.image;
			const display_type = "BodyTemplate2"
			response = getDisplay(handlerInput.responseBuilder, attributes, image_url, display_type)
		}
		else{
			response = handlerInput.responseBuilder
		}

		return response
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
    const answerSlot = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    const result = checkAnswer(handlerInput, answerSlot);

    var response = "";

    attributes.lastResult = result.message;
		handlerInput.attributesManager.setSessionAttributes(attributes);
    if (supportsDisplay(handlerInput)) {
			const image_url = BACKGROUND_IMAGE_URL;
			const display_type = "BodyTemplate7"
			response = getDisplay(handlerInput.responseBuilder, attributes, image_url, display_type)
		}
		else{
			response = handlerInput.responseBuilder
		}

		return response
			.speak(attributes.lastResult + " Thank you for playing Memory Challenge. Your final score is " + attributes.correctCount + " out of " + (attributes.counter + 1))
			.getResponse();
	}
};

// returns true if the skill is running on a device with a display (show|spot)
function supportsDisplay(handlerInput) {
	var hasDisplay =
	  handlerInput.requestEnvelope.context &&
	  handlerInput.requestEnvelope.context.System &&
	  handlerInput.requestEnvelope.context.System.device &&
	  handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
	  handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
	return hasDisplay;
  }

function getDisplay(response, attributes, image_url, display_type){
	const image = new Alexa.ImageHelper().addImageInstance(image_url).getImage();
	const current_score = attributes.correctCount;
	let display_score = ""
	console.log("the display type is => " + display_type);

	if (typeof attributes.correctCount !== 'undefined'){
		display_score = "Score: " + current_score;
	}
	else{
		display_score = "Score: 0. Let's get started!";
	}

	const myTextContent = new Alexa.RichTextContentHelper()
	.withPrimaryText('Question #' + (attributes.counter + 1) + "<br/>")
	.withSecondaryText(attributes.lastResult)
	.withTertiaryText("<br/> <font size='4'>" + display_score + "</font>")
	.getTextContent();

	if (display_type == "BodyTemplate7"){
		//use background image
		response.addRenderTemplateDirective({
			type: display_type,
			backButton: 'visible',
			backgroundImage: image,
			title:"Memory Challenge",
			textContent: myTextContent,
			});
	}
	else{
		response.addRenderTemplateDirective({
			//use 340x340 image on the right with text on the left.
			type: display_type,
			backButton: 'visible',
			image: image,
			title:"Memory Challenge",
			textContent: myTextContent,
			});
	}

	return response
}

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
		message = "Yup! " + capitalizeFirstLetter(answerSlot) + " is correct. ";
		attributes.correctCount += 1;
		status =true;

	}
	else{
		console.log("wrong");
		message = "Nope! " + capitalizeFirstLetter(answerSlot) + " is incorrect. ";
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const stories = [
	{
		"question":"Jeff loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are Jeff's favorite games for the Winter Olympics?","answer":["skating","ice skating","skiing"],"image":"https://ajotwani.s3.amazonaws.com/alexa/winter2.png"
	},
	{
		"question":"Mike loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are John's favorite games for the Winter Olympics?","answer":["skating","ice skating","skiing"],"image":"https://ajotwani.s3.amazonaws.com/alexa/winter2.png"
	},
	{
		"question":"While traveling, Samantha likes to take her tooth brush, hair brush, face cream, and hair dryer. What does Samantha like to carry when she travels?","answer":["tooth brush","hair brush","hair dryer","face cream"],"image":"https://ajotwani.s3.amazonaws.com/alexa/travel2.png"
	},
	{
		"question":"Mark loves sports. His favorite sports in the Olympics are ice skating and skiing for the Winter Olympics, and basketball and volleyball for the Summer Olympics. What are John's favorite games for the Winter Olympics?","answer":["skating","ice skating","skiing"],"image":"https://ajotwani.s3.amazonaws.com/alexa/winter2.png"
	},
	{
		"question":"While traveling, Jessica likes to take her tooth brush, hair brush, face cream, and hair dryer. What does Samantha like to carry when she travels?","answer":["tooth brush","hair brush","hair dryer","face cream"],"image":"https://ajotwani.s3.amazonaws.com/alexa/travel2.png"
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
