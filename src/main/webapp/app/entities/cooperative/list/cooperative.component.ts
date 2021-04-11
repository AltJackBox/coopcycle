import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICooperative } from '../cooperative.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CooperativeService } from '../service/cooperative.service';
import { CooperativeDeleteDialogComponent } from '../delete/cooperative-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-cooperative',
  templateUrl: './cooperative.component.html',
})
export class CooperativeComponent implements OnInit {
  cooperatives: ICooperative[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected cooperativeService: CooperativeService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.cooperatives = [];
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

    this.cooperativeService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICooperative[]>) => {
          this.isLoading = false;
          this.paginateCooperatives(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.cooperatives = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICooperative): number {
    return item.id!;
  }

  delete(cooperative: ICooperative): void {
    const modalRef = this.modalService.open(CooperativeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cooperative = cooperative;
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

  protected paginateCooperatives(data: ICooperative[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.cooperatives.push(d);
      }
    }
  }
}
