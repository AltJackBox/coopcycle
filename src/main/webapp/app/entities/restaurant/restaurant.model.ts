import * as dayjs from 'dayjs';
import { IProduit } from 'app/entities/produit/produit.model';
import { IPanier } from 'app/entities/panier/panier.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface IRestaurant {
  id?: number;
  name?: string;
  openTime?: dayjs.Dayjs | null;
  closeTime?: dayjs.Dayjs | null;
  produits?: IProduit[] | null;
  paniers?: IPanier[] | null;
  cooperative?: ICooperative | null;
}

export class Restaurant implements IRestaurant {
  constructor(
    public id?: number,
    public name?: string,
    public openTime?: dayjs.Dayjs | null,
    public closeTime?: dayjs.Dayjs | null,
    public produits?: IProduit[] | null,
    public paniers?: IPanier[] | null,
    public cooperative?: ICooperative | null
  ) {}
}

export function getRestaurantIdentifier(restaurant: IRestaurant): number | undefined {
  return restaurant.id;
}
