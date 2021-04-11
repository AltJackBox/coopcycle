import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduit, Produit } from '../produit.model';
import { ProduitService } from '../service/produit.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IPanier } from 'app/entities/panier/panier.model';
import { PanierService } from 'app/entities/panier/service/panier.service';

@Component({
  selector: 'jhi-produit-update',
  templateUrl: './produit-update.component.html',
})
export class ProduitUpdateComponent implements OnInit {
  isSaving = false;

  restaurantsSharedCollection: IRestaurant[] = [];
  paniersSharedCollection: IPanier[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(3)]],
    price: [null, [Validators.required, Validators.min(0)]],
    isAvailable: [null, [Validators.required]],
    restaurant: [],
    panier: [],
  });

  constructor(
    protected produitService: ProduitService,
    protected restaurantService: RestaurantService,
    protected panierService: PanierService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produit }) => {
      this.updateForm(produit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produit = this.createFromForm();
    if (produit.id !== undefined) {
      this.subscribeToSaveResponse(this.produitService.update(produit));
    } else {
      this.subscribeToSaveResponse(this.produitService.create(produit));
    }
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  trackPanierById(index: number, item: IPanier): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduit>>): void {
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

  protected updateForm(produit: IProduit): void {
    this.editForm.patchValue({
      id: produit.id,
      name: produit.name,
      price: produit.price,
      isAvailable: produit.isAvailable,
      restaurant: produit.restaurant,
      panier: produit.panier,
    });

    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      produit.restaurant
    );
    this.paniersSharedCollection = this.panierService.addPanierToCollectionIfMissing(this.paniersSharedCollection, produit.panier);
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));

    this.panierService
      .query()
      .pipe(map((res: HttpResponse<IPanier[]>) => res.body ?? []))
      .pipe(map((paniers: IPanier[]) => this.panierService.addPanierToCollectionIfMissing(paniers, this.editForm.get('panier')!.value)))
      .subscribe((paniers: IPanier[]) => (this.paniersSharedCollection = paniers));
  }

  protected createFromForm(): IProduit {
    return {
      ...new Produit(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      price: this.editForm.get(['price'])!.value,
      isAvailable: this.editForm.get(['isAvailable'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
      panier: this.editForm.get(['panier'])!.value,
    };
  }
}
