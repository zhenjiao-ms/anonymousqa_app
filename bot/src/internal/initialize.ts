import {SubmitActionHandler } from "../cardActions/submitActionHandler";
import { AskCommandHandler } from "../commands/askCommandHandler";
import { ConversationBot } from "@microsoft/teamsfx";
import config from "./config";
import { LikeActionHandler } from "../cardActions/likeActionHandler";
import { ListCommandHandler } from "../commands/listCommandHandler";

// Create the conversation bot and register the command and card action handlers for your app.
export const conversationBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },
  command: {
    enabled: true,
    commands: [new AskCommandHandler(),
               new ListCommandHandler()],
  },
  cardAction: {
    enabled: true,
    actions: [new LikeActionHandler(),
              new SubmitActionHandler()
              ],
  },
  notification: {
    enabled: true
  },
});
