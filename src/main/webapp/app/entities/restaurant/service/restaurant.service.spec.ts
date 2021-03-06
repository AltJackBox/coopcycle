import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRestaurant, Restaurant } from '../restaurant.model';

import { RestaurantService } from './restaurant.service';

describe('Service Tests', () => {
  describe('Restaurant Service', () => {
    let service: RestaurantService;
    let httpMock: HttpTestingController;
    let elemDefault: IRestaurant;
    let expectedResult: IRestaurant | IRestaurant[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RestaurantService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        openTime: currentDate,
        closeTime: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            openTime: currentDate.format(DATE_TIME_FORMAT),
            closeTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            openTime: currentDate.format(DATE_TIME_FORMAT),
            closeTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            openTime: currentDate,
            closeTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Restaurant()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            openTime: currentDate.format(DATE_TIME_FORMAT),
            closeTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            openTime: currentDate,
            closeTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Restaurant', () => {
        const patchObject = Object.assign({}, new Restaurant());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            openTime: currentDate,
            closeTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            openTime: currentDate.format(DATE_TIME_FORMAT),
            closeTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            openTime: currentDate,
            closeTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Restaurant', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRestaurantToCollectionIfMissing', () => {
        it('should add a Restaurant to an empty array', () => {
          const restaurant: IRestaurant = { id: 123 };
          expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurant);
        });

        it('should not add a Restaurant to an array that contains it', () => {
          const restaurant: IRestaurant = { id: 123 };
          const restaurantCollection: IRestaurant[] = [
            {
              ...restaurant,
            },
            { id: 456 },
          ];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Restaurant to an array that doesn't contain it", () => {
          const restaurant: IRestaurant = { id: 123 };
          const restaurantCollection: IRestaurant[] = [{ id: 456 }];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurant);
        });

        it('should add only unique Restaurant to an array', () => {
          const restaurantArray: IRestaurant[] = [{ id: 123 }, { id: 456 }, { id: 5866 }];
          const restaurantCollection: IRestaurant[] = [{ id: 123 }];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, ...restaurantArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const restaurant: IRestaurant = { id: 123 };
          const restaurant2: IRestaurant = { id: 456 };
          expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant, restaurant2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurant);
          expect(expectedResult).toContain(restaurant2);
        });

        it('should accept null and undefined values', () => {
          const restaurant: IRestaurant = { id: 123 };
          expectedResult = service.addRestaurantToCollectionIfMissing([], null, restaurant, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurant);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
