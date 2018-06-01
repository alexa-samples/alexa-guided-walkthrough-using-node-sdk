const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const speechOutput =
          "Welcome to memory challenge. I will read you a short passage,\
           and then ask you question based on that. Are you ready?"
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler
  )
  .lambda()
