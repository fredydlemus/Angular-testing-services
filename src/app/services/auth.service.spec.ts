import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";
import { Auth } from "../models/auth.model";
import { environment } from "../../environments/environment";

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {

    const spy = jasmine.createSpyObj('TokenService', ['saveToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: spy
        }
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('test for login', () => {
    it('should return a token', (doneFn) => {
      const mockData: Auth = {
        access_token: '123'
      };
      const email = 'fredy@mail.com';
      const password = '123456';

      authService.login(email, password)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return and save a token', (doneFn) => {
      const mockData: Auth = {
        access_token: '123'
      };
      const email = 'fredy@mail.com';
      const password = '123456';
      tokenService.saveToken.and.callThrough();

      authService.login(email, password)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledWith(mockData.access_token);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
});
