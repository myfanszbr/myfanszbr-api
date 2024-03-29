import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SettingModule } from 'src/modules/settings/setting.module';
import {
  CountryService,
  LanguageService,
  PhoneCodeService,
  RecaptchaService,
  UserAdditionalInfoService,
  StateService,
  CityService
} from './services';
import {
  CountryController,
  LanguageController,
  PhoneCodeController,
  UserAdditionalInfoController,
  RecaptchaController,
  StateController,
  CityController
} from './controllers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => SettingModule)
  ],
  controllers: [
    CountryController,
    LanguageController,
    PhoneCodeController,
    UserAdditionalInfoController,
    RecaptchaController,
    StateController,
    CityController
  ],
  providers: [
    CountryService, LanguageService, PhoneCodeService,
    UserAdditionalInfoService, RecaptchaService,
    StateService, CityService
  ],
  exports: [CountryService, LanguageService, PhoneCodeService]
})
export class UtilsModule {}
