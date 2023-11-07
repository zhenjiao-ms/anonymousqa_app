import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import listQuestionCard from "../adaptiveCards/listQuestionResponse.json";
import { QuestionListCardData } from "../cardModels";
import { listQuestions } from "../question";

/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class ListCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "list";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    // Render your adaptive card for reply message
    const cardData: QuestionListCardData = {
      title: "Welcome to anonymous Q&A bot",
      body: "We have the following questions",
      data: [{
        question: "**Question**",
        liked: "**Liked**",
        answerBy: "**Sent To**"
      }],
      questionUrl: process.env.QUESTIONURL
    };

    const questions = await listQuestions();
    for (const q of questions) {
      cardData.data.push({
        question: q.txt,
        liked: q.liked,
        answerBy: q.answer
      });
      }

    const cardJson = AdaptiveCards.declare(listQuestionCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}
