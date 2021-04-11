import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICompte, Compte } from '../compte.model';
import { CompteService } from '../service/compte.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

@Component({
  selector: 'jhi-compte-update',
  templateUrl: './compte-update.component.html',
})
export class CompteUpdateComponent implements OnInit {
  isSaving = false;

  cooperativesCollection: ICooperative[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    role: [null, [Validators.required]],
    cooperative: [],
  });

  constructor(
    protected compteService: CompteService,
    protected cooperativeService: CooperativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compte }) => {
      this.updateForm(compte);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compte = this.createFromForm();
    if (compte.id !== undefined) {
      this.subscribeToSaveResponse(this.compteService.update(compte));
    } else {
      this.subscribeToSaveResponse(this.compteService.create(compte));
    }
  }

  trackCooperativeById(index: number, item: ICooperative): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompte>>): void {
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

  protected updateForm(compte: ICompte): void {
    this.editForm.patchValue({
      id: compte.id,
      name: compte.name,
      role: compte.role,
      cooperative: compte.cooperative,
    });

    this.cooperativesCollection = this.cooperativeService.addCooperativeToCollectionIfMissing(
      this.cooperativesCollection,
      compte.cooperative
    );
  }

  protected loadRelationshipsOptions(): void {
    this.cooperativeService
      .query({ filter: 'compte-is-null' })
      .pipe(map((res: HttpResponse<ICooperative[]>) => res.body ?? []))
      .pipe(
        map((cooperatives: ICooperative[]) =>
          this.cooperativeService.addCooperativeToCollectionIfMissing(cooperatives, this.editForm.get('cooperative')!.value)
        )
      )
      .subscribe((cooperatives: ICooperative[]) => (this.cooperativesCollection = cooperatives));
  }

  protected createFromForm(): ICompte {
    return {
      ...new Compte(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      role: this.editForm.get(['role'])!.value,
      cooperative: this.editForm.get(['cooperative'])!.value,
    };
  }
}
