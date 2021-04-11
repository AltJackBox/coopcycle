jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RestaurantService } from '../service/restaurant.service';
import { IRestaurant, Restaurant } from '../restaurant.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

import { RestaurantUpdateComponent } from './restaurant-update.component';

describe('Component Tests', () => {
  describe('Restaurant Management Update Component', () => {
    let comp: RestaurantUpdateComponent;
    let fixture: ComponentFixture<RestaurantUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let restaurantService: RestaurantService;
    let cooperativeService: CooperativeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RestaurantUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RestaurantUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RestaurantUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      restaurantService = TestBed.inject(RestaurantService);
      cooperativeService = TestBed.inject(CooperativeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Cooperative query and add missing value', () => {
        const restaurant: IRestaurant = { id: 456 };
        const cooperative: ICooperative = { id: 85868 };
        restaurant.cooperative = cooperative;

        const cooperativeCollection: ICooperative[] = [{ id: 67008 }];
        spyOn(cooperativeService, 'query').and.returnValue(of(new HttpResponse({ body: cooperativeCollection })));
        const additionalCooperatives = [cooperative];
        const expectedCollection: ICooperative[] = [...additionalCooperatives, ...cooperativeCollection];
        spyOn(cooperativeService, 'addCooperativeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ restaurant });
        comp.ngOnInit();

        expect(cooperativeService.query).toHaveBeenCalled();
        expect(cooperativeService.addCooperativeToCollectionIfMissing).toHaveBeenCalledWith(
          cooperativeCollection,
          ...additionalCooperatives
        );
        expect(comp.cooperativesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const restaurant: IRestaurant = { id: 456 };
        const cooperative: ICooperative = { id: 42003 };
        restaurant.cooperative = cooperative;

        activatedRoute.data = of({ restaurant });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(restaurant));
        expect(comp.cooperativesSharedCollection).toContain(cooperative);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const restaurant = { id: 123 };
        spyOn(restaurantService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: restaurant }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(restaurantService.update).toHaveBeenCalledWith(restaurant);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const restaurant = new Restaurant();
        spyOn(restaurantService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: restaurant }));
        saveSubject.complete();

        // THEN
        expect(restaurantService.create).toHaveBeenCalledWith(restaurant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const restaurant = { id: 123 };
        spyOn(restaurantService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ restaurant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(restaurantService.update).toHaveBeenCalledWith(restaurant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCooperativeById', () => {
        it('Should return tracked Cooperative primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCooperativeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
