import { handlerPath } from "@libs/handler-resolver";

export const InventoryValidation = {
  handler: `${handlerPath(__dirname)}/inventoryValidaion.handleEvents`,
  name: "inventory-validation-handler-${self:provider.stage}",
  events: [
    {
      sqs: {
        arn: "${self:provider.environment.INVENTORY_PROCESS_SQS_QUEUE_ARN}",
        batchSize: 1,
      },
    },
  ],
  role: "${self:provider.environment.INVENTORY_PROCESS_HANDLER_ACCESS_ROLE}",
  timeout: 60,
  tags: {
    PROJECT: "EIP",
    ENVIRONMENT: "${self:provider.stage}",
    TEAM: "EIP Development Team",
  },
};
