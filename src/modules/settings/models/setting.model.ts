import { Document } from 'mongoose';

export class SettingModel extends Document {
  key: string;

  value: any;

  name: string;

  description: string;

  group = 'system';

  public = false;

  type = 'text';

  visible = true;

  editable = true;

  meta: any;

  autoload: boolean;

  ordering: number;

  createdAt?: Date;

  updatedAt?: Date;

  extra?: string;
}
