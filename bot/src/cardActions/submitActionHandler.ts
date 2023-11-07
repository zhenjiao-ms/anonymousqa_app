import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TurnContext, InvokeResponse } from "botbuilder";
import { TeamsFxAdaptiveCardActionHandler, InvokeResponseFactory, sendAdaptiveCard } from "@microsoft/teamsfx";
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
      questionText: question,
      eventName: process.env.EVENTNAME,
      questionUrl: process.env.QUESTIONURL,
    };

    const id = await addNewQuestion(question, '', answeredBy);
    cardData.questionId = id;
    const cardJson = AdaptiveCards.declare(responseCard).render(cardData);  
    this.sendCards(cardJson);
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

  async sendCards(cardJson: any){
    const installs = await conversationBot.notification.installations();
    const sent = new Set();
    for (const target of installs) {
      if (target.type === "Channel" || target.type === "Group") {
          const members = await target.members();
          for (const member of members){
            const email = member.account.userPrincipalName;
            const id = member.account.id;
            if (!sent.has(id)) {
              try{
                console.log(`Send card to ${email}`);
                sent.add(id);
                await member.sendAdaptiveCard(cardJson);
              }
              catch (e) {
                console.log(`Got exception in sending card to ${email}, error=${e}`);
              }
            }
          }
      }else{
        const id = target.conversationReference.user.id;
        if(!sent.has(id)){
          try{
            console.log(`Send card to ${id}`);
            sent.add(id);
            await target.sendAdaptiveCard(cardJson);
          }
          catch (e) {
            console.log(`Got exception in sending card to ${id}, error=${e}`);
          }
    }
      }
    }

  }
}
