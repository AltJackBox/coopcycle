import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPanier, Panier } from '../panier.model';
import { PanierService } from '../service/panier.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-panier-update',
  templateUrl: './panier-update.component.html',
})
export class PanierUpdateComponent implements OnInit {
  isSaving = false;

  coursesCollection: ICourse[] = [];
  comptesSharedCollection: ICompte[] = [];
  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [],
    method: [],
    price: [null, [Validators.min(0)]],
    isPaid: [null, [Validators.required]],
    course: [],
    compte: [],
    restaurant: [],
  });

  constructor(
    protected panierService: PanierService,
    protected courseService: CourseService,
    protected compteService: CompteService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ panier }) => {
      this.updateForm(panier);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const panier = this.createFromForm();
    if (panier.id !== undefined) {
      this.subscribeToSaveResponse(this.panierService.update(panier));
    } else {
      this.subscribeToSaveResponse(this.panierService.create(panier));
    }
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  trackCompteById(index: number, item: ICompte): number {
    return item.id!;
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPanier>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(panier: IPanier): void {
    this.editForm.patchValue({
      id: panier.id,
      method: panier.method,
      price: panier.price,
      isPaid: panier.isPaid,
      course: panier.course,
      compte: panier.compte,
      restaurant: panier.restaurant,
    });

    this.coursesCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesCollection, panier.course);
    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing(this.comptesSharedCollection, panier.compte);
    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      panier.restaurant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query({ filter: 'panier-is-null' })
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesCollection = courses));

    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing(comptes, this.editForm.get('compte')!.value)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));
  }

  protected createFromForm(): IPanier {
    return {
      ...new Panier(),
      id: this.editForm.get(['id'])!.value,
      method: this.editForm.get(['method'])!.value,
      price: this.editForm.get(['price'])!.value,
      isPaid: this.editForm.get(['isPaid'])!.value,
      course: this.editForm.get(['course'])!.value,
      compte: this.editForm.get(['compte'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
    };
  }
}
