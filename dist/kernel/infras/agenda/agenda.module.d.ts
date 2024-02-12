import { DynamicModule } from '@nestjs/common';
import { AgendaModuleOptions, AgendaModuleAsyncOptions } from './interfaces';
declare const Agenda: any;
export declare class AgendaService extends Agenda {
}
export declare class AgendaModule {
    static register(options?: AgendaModuleOptions): DynamicModule;
    static registerAsync(options: AgendaModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
export {};
