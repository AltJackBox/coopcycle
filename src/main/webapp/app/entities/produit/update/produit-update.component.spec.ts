jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProduitService } from '../service/produit.service';
import { IProduit, Produit } from '../produit.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IPanier } from 'app/entities/panier/panier.model';
import { PanierService } from 'app/entities/panier/service/panier.service';

import { ProduitUpdateComponent } from './produit-update.component';

describe('Component Tests', () => {
  describe('Produit Management Update Component', () => {
    let comp: ProduitUpdateComponent;
    let fixture: ComponentFixture<ProduitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let produitService: ProduitService;
    let restaurantService: RestaurantService;
    let panierService: PanierService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProduitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProduitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProduitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      produitService = TestBed.inject(ProduitService);
      restaurantService = TestBed.inject(RestaurantService);
      panierService = TestBed.inject(PanierService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Restaurant query and add missing value', () => {
        const produit: IProduit = { id: 456 };
        const restaurant: IRestaurant = { id: 15375 };
        produit.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 42241 }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Panier query and add missing value', () => {
        const produit: IProduit = { id: 456 };
        const panier: IPanier = { id: 27301 };
        produit.panier = panier;

        const panierCollection: IPanier[] = [{ id: 70855 }];
        spyOn(panierService, 'query').and.returnValue(of(new HttpResponse({ body: panierCollection })));
        const additionalPaniers = [panier];
        const expectedCollection: IPanier[] = [...additionalPaniers, ...panierCollection];
        spyOn(panierService, 'addPanierToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        expect(panierService.query).toHaveBeenCalled();
        expect(panierService.addPanierToCollectionIfMissing).toHaveBeenCalledWith(panierCollection, ...additionalPaniers);
        expect(comp.paniersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const produit: IProduit = { id: 456 };
        const restaurant: IRestaurant = { id: 1822 };
        produit.restaurant = restaurant;
        const panier: IPanier = { id: 47384 };
        produit.panier = panier;

        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(produit));
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
        expect(comp.paniersSharedCollection).toContain(panier);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = { id: 123 };
        spyOn(produitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(produitService.update).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = new Produit();
        spyOn(produitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produit }));
        saveSubject.complete();

        // THEN
        expect(produitService.create).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = { id: 123 };
        spyOn(produitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(produitService.update).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPanierById', () => {
        it('Should return tracked Panier primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPanierById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
