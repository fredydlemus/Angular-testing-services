import { TestBed } from "@angular/core/testing";
import { ProductsService } from './product.service'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { environment } from "../../environments/environment";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { HttpStatusCode } from "@angular/common/http";

fdescribe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    })
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      productService.getAllSimple()
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);


    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      productService.getAll()
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();

        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

    })

    it('should return product list with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100
        },
        {
          ...generateOneProduct(),
          price: 200
        },
        {
          ...generateOneProduct(),
          price: 0
        },
        {
          ...generateOneProduct(),
          price: -100

        }
      ];

      //Act
      productService.getAll()
        .subscribe((data) => {
          //Assert
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          expect(data[2].taxes).toEqual(0);
          expect(data[3].taxes).toEqual(0);
          doneFn();
        });

      //Assert
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

    })

    it('should send query params with limit 10 and ofset 3', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;

      productService.getAll(limit, offset)
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(limit.toString());

    })
  });

  describe('test for create', () => {
    it('should return a new product', (doneFn) => {
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'new description',
        categoryId: 1,
      }
      //Act
      productService.create({ ...dto })
        .subscribe(data => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');


    });
  });

  describe('test for update', () => {
    it('should update a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new Product'
      }
      const productId = 1;

      productService.update(productId.toString(), { ...dto })
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    })
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      const mockData = true;
      const productId = 1;
      productService.delete(productId.toString())
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    })

  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const productId = '1';

      productService.getOne(productId)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the rigth msg when status code is 404', (doneFn) => {

      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }

      productService.getOne(productId)
        .subscribe({
          error: (error) => {
            expect(error).toEqual('El producto no existe');
            doneFn();
          }
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });

});
