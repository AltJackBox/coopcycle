import { IPanier } from 'app/entities/panier/panier.model';

export interface ICourse {
  id?: number;
  deliveryTime?: string | null;
  panier?: IPanier | null;
}

export class Course implements ICourse {
  constructor(public id?: number, public deliveryTime?: string | null, public panier?: IPanier | null) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
