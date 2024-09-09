import {SubmitActionHandler } from "../cardActions/submitActionHandler";
import { AskCommandHandler } from "../commands/askCommandHandler";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import { LikeActionHandler } from "../cardActions/likeActionHandler";
import { ListCommandHandler } from "../commands/listCommandHandler";

// Create the conversation bot and register the command and card action handlers for your app.
export const conversationBot = new ConversationBot({
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppType: config.botType,
    MicrosoftAppTenantId: config.botTenantId,
    MicrosoftAppPassword: config.botPassword,
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
