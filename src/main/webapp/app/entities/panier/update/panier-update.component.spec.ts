jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PanierService } from '../service/panier.service';
import { IPanier, Panier } from '../panier.model';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { PanierUpdateComponent } from './panier-update.component';

describe('Component Tests', () => {
  describe('Panier Management Update Component', () => {
    let comp: PanierUpdateComponent;
    let fixture: ComponentFixture<PanierUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let panierService: PanierService;
    let courseService: CourseService;
    let compteService: CompteService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PanierUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PanierUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PanierUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      panierService = TestBed.inject(PanierService);
      courseService = TestBed.inject(CourseService);
      compteService = TestBed.inject(CompteService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call course query and add missing value', () => {
        const panier: IPanier = { id: 456 };
        const course: ICourse = { id: 14913 };
        panier.course = course;

        const courseCollection: ICourse[] = [{ id: 40132 }];
        spyOn(courseService, 'query').and.returnValue(of(new HttpResponse({ body: courseCollection })));
        const expectedCollection: ICourse[] = [course, ...courseCollection];
        spyOn(courseService, 'addCourseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(courseService.query).toHaveBeenCalled();
        expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(courseCollection, course);
        expect(comp.coursesCollection).toEqual(expectedCollection);
      });

      it('Should call Compte query and add missing value', () => {
        const panier: IPanier = { id: 456 };
        const compte: ICompte = { id: 84521 };
        panier.compte = compte;

        const compteCollection: ICompte[] = [{ id: 72716 }];
        spyOn(compteService, 'query').and.returnValue(of(new HttpResponse({ body: compteCollection })));
        const additionalComptes = [compte];
        const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
        spyOn(compteService, 'addCompteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(compteService.query).toHaveBeenCalled();
        expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(compteCollection, ...additionalComptes);
        expect(comp.comptesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Restaurant query and add missing value', () => {
        const panier: IPanier = { id: 456 };
        const restaurant: IRestaurant = { id: 38812 };
        panier.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 40733 }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const panier: IPanier = { id: 456 };
        const course: ICourse = { id: 62180 };
        panier.course = course;
        const compte: ICompte = { id: 80404 };
        panier.compte = compte;
        const restaurant: IRestaurant = { id: 92480 };
        panier.restaurant = restaurant;

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(panier));
        expect(comp.coursesCollection).toContain(course);
        expect(comp.comptesSharedCollection).toContain(compte);
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = { id: 123 };
        spyOn(panierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: panier }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(panierService.update).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = new Panier();
        spyOn(panierService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: panier }));
        saveSubject.complete();

        // THEN
        expect(panierService.create).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = { id: 123 };
        spyOn(panierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(panierService.update).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCourseById', () => {
        it('Should return tracked Course primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCourseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCompteById', () => {
        it('Should return tracked Compte primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCompteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
