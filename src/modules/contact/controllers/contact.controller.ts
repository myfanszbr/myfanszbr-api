import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Post,
  Body
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { ContactService } from '../services';
import { ContactPayload } from '../payloads/contact.payload';

@Injectable()
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async contact(
    @Body() payload: ContactPayload
  ): Promise<DataResponse<any>> {
    await this.contactService.contact(payload);
    return DataResponse.ok({ success: true });
  }
}
