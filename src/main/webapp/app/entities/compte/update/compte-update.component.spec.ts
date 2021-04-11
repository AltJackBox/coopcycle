jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CompteService } from '../service/compte.service';
import { ICompte, Compte } from '../compte.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

import { CompteUpdateComponent } from './compte-update.component';

describe('Component Tests', () => {
  describe('Compte Management Update Component', () => {
    let comp: CompteUpdateComponent;
    let fixture: ComponentFixture<CompteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let compteService: CompteService;
    let cooperativeService: CooperativeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CompteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CompteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CompteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      compteService = TestBed.inject(CompteService);
      cooperativeService = TestBed.inject(CooperativeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call cooperative query and add missing value', () => {
        const compte: ICompte = { id: 456 };
        const cooperative: ICooperative = { id: 57033 };
        compte.cooperative = cooperative;

        const cooperativeCollection: ICooperative[] = [{ id: 82154 }];
        spyOn(cooperativeService, 'query').and.returnValue(of(new HttpResponse({ body: cooperativeCollection })));
        const expectedCollection: ICooperative[] = [cooperative, ...cooperativeCollection];
        spyOn(cooperativeService, 'addCooperativeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        expect(cooperativeService.query).toHaveBeenCalled();
        expect(cooperativeService.addCooperativeToCollectionIfMissing).toHaveBeenCalledWith(cooperativeCollection, cooperative);
        expect(comp.cooperativesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const compte: ICompte = { id: 456 };
        const cooperative: ICooperative = { id: 53897 };
        compte.cooperative = cooperative;

        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(compte));
        expect(comp.cooperativesCollection).toContain(cooperative);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = { id: 123 };
        spyOn(compteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: compte }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(compteService.update).toHaveBeenCalledWith(compte);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = new Compte();
        spyOn(compteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: compte }));
        saveSubject.complete();

        // THEN
        expect(compteService.create).toHaveBeenCalledWith(compte);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = { id: 123 };
        spyOn(compteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(compteService.update).toHaveBeenCalledWith(compte);
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
