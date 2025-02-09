import {I18nEnum} from "./I18nEnum";

export enum Fare {
    Full = 'full',
    Child = 'child',
}

export type FareType = {
    fare: I18nEnum<Fare>;
    price: any;
};
