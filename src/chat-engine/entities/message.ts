export interface Message {
  id?: string;
  content: any;
  name?: string;
  role: string;
  metaData?: any;
  read_by?: any;
  createdBy?: string;
}
