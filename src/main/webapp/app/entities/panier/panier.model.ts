import { ICourse } from 'app/entities/course/course.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ICompte } from 'app/entities/compte/compte.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { SystemPaiment } from 'app/entities/enumerations/system-paiment.model';

export interface IPanier {
  id?: number;
  method?: SystemPaiment | null;
  price?: number | null;
  isPaid?: boolean;
  course?: ICourse | null;
  produits?: IProduit[] | null;
  compte?: ICompte | null;
  restaurant?: IRestaurant | null;
}

export class Panier implements IPanier {
  constructor(
    public id?: number,
    public method?: SystemPaiment | null,
    public price?: number | null,
    public isPaid?: boolean,
    public course?: ICourse | null,
    public produits?: IProduit[] | null,
    public compte?: ICompte | null,
    public restaurant?: IRestaurant | null
  ) {
    this.isPaid = this.isPaid ?? false;
  }
}

export function getPanierIdentifier(panier: IPanier): number | undefined {
  return panier.id;
}
