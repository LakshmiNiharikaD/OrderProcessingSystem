import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";

export class SnsService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({ region: process.env.REGION });
  }

  async publishMessage(params: {
    topicArn: string;
    message: any;
    subject?: string;
    messageGroupId?: string;
    messageDeduplicationId?: string;
    messageAttributes?: { [key: string]: any };
  }): Promise<any> {
    const isFifo = params.topicArn.endsWith(".fifo");

    const publishParams: PublishCommandInput = {
      TopicArn: params.topicArn,
      Message: params.message,
      MessageAttributes: params.messageAttributes,
      ...(isFifo && { MessageGroupId: params.messageGroupId }),
      ...(isFifo && { MessageDeduplicationId: params.messageDeduplicationId }),
      ...(!isFifo && params.subject && { Subject: params.subject }),
    };

    try {
      const command = new PublishCommand(publishParams);
      return await this.snsClient.send(command);
    } catch (error) {
      throw error;
    }
  }
}
