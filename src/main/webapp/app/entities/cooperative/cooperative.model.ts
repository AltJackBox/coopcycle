import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { ICompte } from 'app/entities/compte/compte.model';

export interface ICooperative {
  id?: number;
  name?: string;
  geographicalArea?: string | null;
  restaurants?: IRestaurant[] | null;
  compte?: ICompte | null;
}

export class Cooperative implements ICooperative {
  constructor(
    public id?: number,
    public name?: string,
    public geographicalArea?: string | null,
    public restaurants?: IRestaurant[] | null,
    public compte?: ICompte | null
  ) {}
}

export function getCooperativeIdentifier(cooperative: ICooperative): number | undefined {
  return cooperative.id;
}
