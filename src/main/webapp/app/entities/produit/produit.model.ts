import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IPanier } from 'app/entities/panier/panier.model';

export interface IProduit {
  id?: number;
  name?: string;
  price?: number;
  isAvailable?: boolean;
  restaurant?: IRestaurant | null;
  panier?: IPanier | null;
}

export class Produit implements IProduit {
  constructor(
    public id?: number,
    public name?: string,
    public price?: number,
    public isAvailable?: boolean,
    public restaurant?: IRestaurant | null,
    public panier?: IPanier | null
  ) {
    this.isAvailable = this.isAvailable ?? false;
  }
}

export function getProduitIdentifier(produit: IProduit): number | undefined {
  return produit.id;
}
