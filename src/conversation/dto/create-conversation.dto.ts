export class CreateConversationDto {
  readonly configuration: any;
  readonly title: string;
  readonly createdBy: number;
  readonly createdAt: Date;
  readonly conversation: any[];
  readonly parties: any[];
}
