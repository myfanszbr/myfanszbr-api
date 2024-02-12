import { AxiosResponse } from 'axios';
export declare class CountryService {
    constructor();
    private countryList;
    getList(): any;
    findCountryByIP(ip: string): Promise<AxiosResponse<any>>;
}
