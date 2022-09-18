import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { ValueService } from './value.service';


describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {

    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spy }
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  it('should call to getValue from valueService', () => {
    // const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });

  //isnt't their responsibility
  // it('should return "my value" from the real service', () => {
  //   let valueService = new ValueService();
  //   let masterService = new MasterService(valueService);
  //   expect(masterService.getValue()).toBe("my value");
  // });

  // //no recommended
  // it('should return "other value" from the fake service', () => {
  //   let fakeValueService = new FakeValueService();
  //   let masterService = new MasterService(fakeValueService as unknown as ValueService);
  //   expect(masterService.getValue()).toBe("fake value");
  // });

  // //manual way
  // it('should return "other value" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from obj' }
  //   let masterService = new MasterService(fake as ValueService);
  //   expect(masterService.getValue()).toBe("fake from obj");
  // });


});
