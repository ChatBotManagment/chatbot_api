export class CreateRoomDto {
  readonly configuration: any;
  readonly title: string;
  readonly createdBy: number;
  readonly createdAt: Date;
  readonly room: any[];
  readonly parties: any[];
}
