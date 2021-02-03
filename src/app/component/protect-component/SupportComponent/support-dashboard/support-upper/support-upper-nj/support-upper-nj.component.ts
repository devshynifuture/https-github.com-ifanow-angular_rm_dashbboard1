import { Subscription } from 'rxjs';
import { EventService } from './../../../../../../Data-service/event.service';
import { UtilService } from './../../../../../../services/util.service';
import { SupportUpperService } from './../support-upper.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
// import { FormControl } from '@angular/forms';

export interface SchemeI {
  id: number;
  schemeCode: string;
  schemeName: string;
  balanceUnit: number;
  amountInvested: number;
  currentValue: number;
  absoluteReturn: number;
  allocatedPercentage: number;
  switchIn: number;
  switchOut: number;
  redemption: number;
  dividendPayout: number;
  dividendReinvestment: number;
  netInvestment: number;
  marketValue: number;
  netGain: number;
  isActive: number;
  amountInv: number;
  amc_id: number;
  njCount: number;
}

@Component({
  selector: 'app-support-upper-nj',
  templateUrl: './support-upper-nj.component.html',
  styleUrls: ['./support-upper-nj.component.scss']
})
export class SupportUpperNjComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  isLoadingForDropDown: boolean = false;
  previousSchemesValues: {} = {};
  changedSchemesValues: Object = {};
  interval: NodeJS.Timeout;
  isFilteredSchemesCalled: boolean = false;
  dataTable: elementI[];
  filteredSchemeError: boolean = false;
  selectedElement: any;
  apiCallingStack: any[] = [];
  searchSchemes: any[];
  mapUnmappedOptionFC = new FormControl(1);
  njOptionsDropdown = [
    { id: 1, title: 'Unmapped' },
    { id: 2, title: 'Mapped' }
  ];

  startLimit = 0;

  isMapped = false;
  pageEvent: PageEvent;
  totalNjCount: number = 0;
  selectedSchemeRes;
  schemeControlSubs: Subscription;
  searchSchemeControlSubs: Subscription;
  storedVal: string;

  constructor(
    private supportUpperService: SupportUpperService,
    private eventService: EventService
  ) { }

  schemeControl: FormControl = new FormControl();
  searchSchemeControl: FormControl = new FormControl();
  filteredSchemes: any[] = [];
  errorMsg: string;
  isLoading: boolean = false;

  ngOnInit() {
    // console.log(this.schemeFormControl);
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.isLoading = true;
    this.getMappedUnmappedNjSchemes();
    // this.searchSchemeControlSubs = this.searchSchemeControl.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     tap(() => {
    //       // this.errorMsg = "";
    //       this.filteredSchemes = [];
    //       this.isLoadingForDropDown = true;
    //       this.schemeControl.patchValue(null, { emitEvent: false });
    //     }),
    //     switchMap(value => this.searchSchemeNjPrudent(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoadingForDropDown = false
    //         }),
    //       )
    //     )
    //   ).subscribe(data => {
    //     this.isLoading = false;
    //     this.isLoadingForDropDown = false;
    //     if (data) {
    //       let dataTable: any[] = [];
    //       this.apiCallingStack = [];
    //       if (data.njSchemeMasterList.length > 0) {
    //         data.njSchemeMasterList.forEach(item => {
    //           dataTable.push({
    //             name: item.schemeName,
    //             nav: item.nav,
    //             schemeName: '',
    //             schemeCode: '',
    //             amficode: '',
    //             navTwo: '',
    //             navDate: '',
    //             njCount: '',
    //             map: '',
    //             id: item.id,
    //             transactionDate: item.transactionDate
    //           });
    //         });
    //       }
    //       console.log("this is some data::::::", dataTable);
    //       this.dataTable = dataTable;
    //       this.dataSource.data = dataTable;
    //       this.dataSource.data.forEach(element => {
    //         if (this.isMapped == true) {
    //           element.isMapped = true
    //         } else {
    //           element.isMapped = false
    //         }
    //       });
    //       console.log(data);
    //       this.apiCallingStack = [];
    //       this.filteredSchemes = data.njSchemeMasterList;
    //       console.log("this is what i need::::::::", data);
    //       //this.checkIfDataNotPresentAndShowError(data);
    //       console.log(this.filteredSchemes);
    //     }
    //   }, err => {
    //     //this.filteredSchemeError = true;
    //     // this.errorMsg = 'No data Found';
    //     console.error(err);
    //   });

    this.schemeControlSubs = this.schemeControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          // this.errorMsg = "";
          this.filteredSchemes = [];
          if (this.schemeControl.value && this.schemeControl.hasOwnProperty('value') && this.schemeControl.value.length > 2) {
            this.isLoadingForDropDown = true;
          }
        }),
        switchMap(value => this.getFilteredSchemesList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.apiCallingStack = [];
        this.filteredSchemes = data;
        console.log("this is what i need::::::::", data);
        //this.checkIfDataNotPresentAndShowError(data);
        console.log(this.filteredSchemes);
      });
  }

  searchSchemeNjPrudent(value) {
    if (value === '') {
      if (this.selectedElement) {
        let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
        if (this.apiCallingStack[1] !== threeWords) {
          return this.supportUpperService.getSearchSchemeList({ rtMasterId: 5, schemeName: threeWords, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
        }
      } else {
        return this.supportUpperService.getSearchSchemeList({ rtMasterId: 5, schschemeNameeme: value, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
      }
    } else {
      return this.supportUpperService.getSearchSchemeList({ rtMasterId: 5, schemeName: value, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
    }
  }
  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    //this.closeRightSlider('');
  }
  checkIfDataNotPresentAndShowError(data, element) {
    if (data && data.length > 0) {
      element.filteredSchemeError = false;
      element.errorMsg = '';
    } else {
      element.filteredSchemeError = true;
      element.errorMsg = 'No data Found';
      // this.errorMsg = 'No data Found';
    }
  }


  checkIfDataNotPresentAndShowErrorMainSearch(data) {
    if (data && data.length > 0) {
      this.filteredSchemeError = false;
      this.errorMsg = '';
    } else {
      this.filteredSchemeError = true;
      this.errorMsg = 'No data Found';
      // this.errorMsg = 'No data Found';
    }
  }
  logValue(value) {
    console.log("this is some value:::::::::", value);
  }

  getFilteredSchemesList(value) {

    // this.logValue('clicked frmo value changed')
    // if (value === '') {
    //   let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
    //   this.apiCallingStack.push(threeWords);
    //   if (this.apiCallingStack[1] !== threeWords) {
    //     return this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 });
    //   }
    // } else {
    //   return this.supportUpperService.getFilteredSchemes({ scheme: value, startLimit: 0, endLimit: 50 });
    // }



    if (value !== '' && (typeof value === 'string')) {
      if (value.length > 2) {
        if (this.storedVal != value) {
          this.storedVal = value;
          return this.supportUpperService.getFilteredSchemes({ scheme: value, startLimit: 0, endLimit: 50 })
        }
      }
    }
  }

  mapSchemeCodeAndOther(element, scheme) {
    this.logValue('again clicked');
    this.supportUpperService.getSchemesDetails({ id: scheme.id })
      .subscribe(res => {
        element.isSchemeSelected = true;
        this.selectedSchemeRes = res;
        console.log('scheme details', res)
        element.navDate = res.navDate
        element.nav = res.nav
        element.amfiCode = res.amfiCode
        element.njPrudentCount = res.njPrudentCount
        element.schemeCode = scheme.schemeCode;
        element.njCount = scheme.njCount;
      });
    element.schemeCode = scheme.schemeCode;
    element.njCount = scheme.njCount;
  }

  showSuggestionsBasedOnSchemeName(element, eve) {
    console.log(element);
    this.isLoadingForDropDown = false;
    this.selectedElement = element;
    // let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    // this.apiCallingStack.push(threeWords);
    if (eve.length > 2) {
      this.isLoadingForDropDown = true;
      this.supportUpperService.getFilteredSchemes({ scheme: eve, startLimit: 0, endLimit: 50 })
        .subscribe(res => {
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
          this.filteredSchemes = [];
          this.filteredSchemes = res;
          console.log(res);
          this.checkIfDataNotPresentAndShowError(res, element);
        }, error => {
          this.checkIfDataNotPresentAndShowError(null, element);
        });
    } else {
      this.filteredSchemes = []
      element.isSchemeSelected = true;
      this.selectedSchemeRes = '';
      console.log('scheme details', '')
      element.navDate = '';
      element.amfiCode = '';
      element.njPrudentCount = ''
      element.schemeCode = '';
      element.njCount = '';
      element.schemeCode = '';
      element.njCount = '';
      element.nav = ''
    }
  }
  showSuggestionsBasedOnMainSearch(eve) {
    this.isLoadingForDropDown = false;
    // let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    // this.apiCallingStack.push(threeWords);
    if (eve.length > 2) {
      this.isLoadingForDropDown = true;
      this.supportUpperService.getSearchSchemeList({ rtMasterId: 5, schemeName: eve, startLimit: 0, endLimit: 50, isMapped: this.isMapped })
        .subscribe(data => {
          this.isLoading = false;
          this.isLoadingForDropDown = false;
          if (data) {
            let dataTable: any[] = [];
            this.apiCallingStack = [];
            if (data.njSchemeMasterList.length > 0) {
              data.njSchemeMasterList.forEach(item => {
                dataTable.push({
                  name: item.schemeName,
                  nav: item.nav,
                  schemeName: '',
                  schemeCode: '',
                  amficode: '',
                  navTwo: '',
                  navDate: '',
                  njCount: '',
                  map: '',
                  id: item.id,
                  transactionDate: item.transactionDate
                });
              });
            }
            console.log("this is some data::::::", dataTable);
            this.dataTable = dataTable;
            this.dataSource.data = dataTable;
            this.dataSource.data.forEach(element => {
              if (this.isMapped == true) {
                element.isMapped = true
              } else {
                element.isMapped = false
              }
            });
            console.log(data);
            this.apiCallingStack = [];
            this.filteredSchemes = data.njSchemeMasterList;
            console.log("this is what i need::::::::", data);
            //this.checkIfDataNotPresentAndShowError(data);
            this.checkIfDataNotPresentAndShowErrorMainSearch(null);
            console.log(this.filteredSchemes);
          }
        }, error => {
          this.checkIfDataNotPresentAndShowErrorMainSearch(null);
        });
    } else if (eve == "") {
      this.getMappedUnmappedNjSchemes();
    }
  }

  searchSchemeName(element) {
    console.log(element);
    this.isLoadingForDropDown = true;
    let threeWords = element;
    //let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    //this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords && element.length >= 3) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 })
        .subscribe(res => {
          if (res) {
            console.log('serach scheme', res)
            let dataTable: any[] = [];
            this.apiCallingStack = [];
            this.isLoadingForDropDown = false;
            res.forEach(item => {
              dataTable.push({
                name: item.schemeName,
                nav: '',
                schemeName: '',
                schemeCode: '',
                amficode: '',
                navTwo: '',
                navDate: '',
                njCount: '',
                map: '',
                id: item.id,
                transactionDate: item.transactionDate
              });
            });
            console.log("this is some data::::::", dataTable);
            this.dataTable = dataTable;
            this.dataSource.data = dataTable;
            this.dataSource.data.forEach(element => {
              if (this.isMapped == true) {
                element.isMapped = true
              } else {
                element.isMapped = false
              }
            });
          } else {
            //this.checkIfDataNotPresentAndShowError(res);
          }
        });
    }
  }
  displayFn(scheme?: Scheme): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  unMapMappedNjScheme(element) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      id: element.id,
      mutualFundSchemeMasterId: element.mutualFundSchemeMasterId,
      schemeCode: element.schemeCode
    }
    console.log(obj);
    this.supportUpperService.postUnmapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          console.log(res);
          element.isMapped = false;
          this.getMappedUnmappedNjSchemes()

        } else {
          this.eventService.openSnackBar('umap successfully', 'Dismiss');
          this.getMappedUnmappedNjSchemes()
        }
      })
  }

  mapUnmappedNJScheme(element) {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      id: this.selectedSchemeRes.id,
      mutualFundSchemeMasterId: element.id,
      rt_id: 5,
      schemeCode: element.schemeCode
    }
    console.log(obj);

    this.supportUpperService.postMapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          console.log(res);
          element.isMapped = true;
          this.getMappedUnmappedNjSchemes()
        } else {
          this.getMappedUnmappedNjSchemes()
        }
      })
  }

  mapNjScheme(element) {
    console.log("this is some mapping value:::::;", element);
  }

  getMappedUnmappedNjSchemes() {
    if (this.isMapped == true) {
      this.displayedColumns = ['name', 'schemeName', 'schemeCode', 'amficode', 'map'];

    } else {
      this.displayedColumns = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
    }
    this.schemeControl.setValue('');
    this.isLoading = true;
    let data = {
      rtMasterId: 5,
      startLimit: this.startLimit,
      endLimit: this.startLimit + 50,
      isMapped: this.isMapped
    };
    this.supportUpperService.getUnmappedSchemesNj(data).subscribe(res => {
      console.log("this is unmapped Nj schemes::::::::::", res);
      this.isLoading = false;
      let dataTable: any[] = [];
      this.totalNjCount = res.count;
      res.njSchemeMasterList.forEach(item => {
        console.log(item);
        dataTable.push({
          name: item.schemeName,
          //nav: item.nav,
          schemeName: (this.isMapped == true) ? item.mutualFundSchemeName : '',
          schemeCode: item.schemeCode,
          amfiCode: item.amfiCode,
          navTwo: '',
          navDate: '',
          njCount: '',
          map: '',
          id: item.id,
          njNav: item.nav,
          transactionDate: item.transactionDate,
          isSchemeSelected: false,
          mutualFundSchemeMasterId: (this.isMapped == true) ? item.mutualFundSchemeMasterId : '',
        });
        // if (this.isMapped == true) {
        //   dataTable.forEach(element => {
        //     element.schemeName = item.mutualFundSchemeName
        //     element.mutualFundSchemeMasterId = item.mutualFundSchemeMasterId
        //   });
        // }
      });
      console.log("this is some data::::::", dataTable);
      this.dataTable = dataTable;
      this.dataSource.data = dataTable;
      this.dataSource.data.forEach(element => {
        if (this.isMapped == true) {
          element.isMapped = true
        } else {
          element.isMapped = false
        }
      });
    }, err => {
      console.error(err);
    });
  }

  dialogClose() {
    clearInterval(this.interval);
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  setMapUnmapOption(event): void {
    console.log(event);
    this.isMapped = event.value == 1 ? false : true;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.filteredSchemes = [];
    this.schemeControl.setValue('');
    this.getMappedUnmappedNjSchemes();
  }

  onPaginationChange(event) {
    if (event.pageIndex > 0) {
      this.startLimit = event.pageIndex * 50;
    } else {
      this.startLimit = 0;
    }
    this.getMappedUnmappedNjSchemes();
    return event;
  }
  ngOnDestroy(): void {
    if (this.searchSchemeControlSubs) {
      this.searchSchemeControlSubs.unsubscribe();
    }

    if (this.schemeControlSubs) {
      this.schemeControlSubs.unsubscribe();
    }
  }
}

export interface Scheme {
  schemeName: string;
}


export interface elementI {
  name: string;
  nav: string;
  schemeName: string;
  schemeCode: string;
  amficode: string;
  navTwo: string;
  navDate: string;
  njCount: string;
  map: string;
}

const ELEMENT_DATA = [
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
  { name: '', nav: '', schemeName: '', amficode: '', navTwo: '', navDate: '', njCount: '', map: '' },
]