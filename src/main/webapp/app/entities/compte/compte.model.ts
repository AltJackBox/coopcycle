import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { IPanier } from 'app/entities/panier/panier.model';
import { Role } from 'app/entities/enumerations/role.model';

export interface ICompte {
  id?: number;
  name?: string;
  role?: Role;
  cooperative?: ICooperative | null;
  paniers?: IPanier[] | null;
}

export class Compte implements ICompte {
  constructor(
    public id?: number,
    public name?: string,
    public role?: Role,
    public cooperative?: ICooperative | null,
    public paniers?: IPanier[] | null
  ) {}
}

export function getCompteIdentifier(compte: ICompte): number | undefined {
  return compte.id;
}
