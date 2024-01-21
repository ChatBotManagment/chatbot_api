export class CreateRoomDto {
  readonly title: string;
  configuration?: any;
  readonly conversation?: any[];
  readonly createdBy?: string;
  // readonly createdAt?: Date;
  readonly room?: any[];
  readonly parties?: any[];
}
