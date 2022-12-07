import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TurnContext, InvokeResponse } from "botbuilder";
import { TeamsFxAdaptiveCardActionHandler, InvokeResponseFactory } from "@microsoft/teamsfx";
import responseCard from "../adaptiveCards/question.json";
import { QuestionCardData } from "../cardModels";
import { conversationBot } from "../internal/initialize";
import { addNewQuestion } from "../question"

/**
 * The `DoStuffActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card action with `triggerVerb`.
 */
export class SubmitActionHandler implements TeamsFxAdaptiveCardActionHandler {
  /**
   * A global unique string associated with the `Action.Execute` action.
   * The value should be the same as the `verb` property which you define in your adaptive card JSON.
   */
  triggerVerb = "submit";

  async handleActionInvoked(context: TurnContext, actionData: any): Promise<InvokeResponse> {
    /**
     * You can send an adaptive card to respond to the card action invoke.
     */
    const question = actionData['question']??'';
    const answeredBy = actionData['answeredBy']??'';
    const cardData: QuestionCardData = {
      title: "Notification from Anonymous Q&A Bot",
      body: question,
      questionId: 0,
      questionText: question
    };

    const id = await addNewQuestion(question, '', answeredBy);
    cardData.questionId = id;
    const cardJson = AdaptiveCards.declare(responseCard).render(cardData);  
    const installs = await conversationBot.notification.installations();
    for (const target of installs) {
      if (target.type === "Channel" || target.type === "Group") {
          const members = await target.members();
          for (const member of members){
            console.log(`Send card to ${member.account.userPrincipalName}`);
            await member.sendAdaptiveCard(cardJson);
          }
      }else{
        console.log(`Send card to ${target.conversationReference.conversation.id}`);
        await target.sendAdaptiveCard(cardJson);
      }
    }
      return InvokeResponseFactory.textMessage("Thanks very much for sending the question!");

    /**
     * If you want to send invoke response with text message, you can:
     * 
     return InvokeResponseFactory.textMessage("[ACK] Successfully!");
    */

    /**
     * If you want to send invoke response with error message, you can:
     *
     * return InvokeResponseFactory.errorResponse(InvokeResponseErrorCode.BadRequest, "The incoming request is invalid.");
     */
  }
}
