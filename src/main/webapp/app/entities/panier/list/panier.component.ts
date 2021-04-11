import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPanier } from '../panier.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { PanierService } from '../service/panier.service';
import { PanierDeleteDialogComponent } from '../delete/panier-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
})
export class PanierComponent implements OnInit {
  paniers: IPanier[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected panierService: PanierService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.paniers = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.panierService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IPanier[]>) => {
          this.isLoading = false;
          this.paginatePaniers(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.paniers = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPanier): number {
    return item.id!;
  }

  delete(panier: IPanier): void {
    const modalRef = this.modalService.open(PanierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.panier = panier;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginatePaniers(data: IPanier[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.paniers.push(d);
      }
    }
  }
}
