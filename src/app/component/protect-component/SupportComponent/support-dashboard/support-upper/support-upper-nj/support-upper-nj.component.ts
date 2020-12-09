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
    this.searchSchemeControlSubs = this.searchSchemeControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredSchemes = [];
          this.isLoadingForDropDown = true;
          this.schemeControl.patchValue(null, { emitEvent: false });
        }),
        switchMap(value => this.searchSchemeNjPrudent(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      ).subscribe(data => {
        this.isLoading = false;
        this.isLoadingForDropDown = false;
        if (data) {
          let dataTable: any[] = [];
          this.apiCallingStack = [];
          data.forEach(item => {
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
          console.log("this is some data::::::", dataTable);
          this.dataTable = dataTable;
          this.dataSource.data = dataTable;
          console.log(data);
          this.apiCallingStack = [];
          this.filteredSchemes = data;
          console.log("this is what i need::::::::", data);
          this.checkIfDataNotPresentAndShowError(data);
          console.log(this.filteredSchemes);
        }
      }, err => {
        this.filteredSchemeError = true;
        this.errorMsg = 'No data Found';
        console.error(err);
      });

    this.schemeControlSubs = this.schemeControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredSchemes = [];
          this.isLoadingForDropDown = true;
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
        this.checkIfDataNotPresentAndShowError(data);
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
  checkIfDataNotPresentAndShowError(data) {
    if (data && data.length > 0) {
      this.filteredSchemeError = false;
    } else {
      this.filteredSchemeError = true;
      this.errorMsg = 'No data Found';
    }
  }

  logValue(value) {
    console.log("this is some value:::::::::", value);
  }

  getFilteredSchemesList(value) {

    this.logValue('clicked frmo value changed')
    if (value === '') {
      let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
      this.apiCallingStack.push(threeWords);
      if (this.apiCallingStack[1] !== threeWords) {
        return this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 });
      }
    } else {
      return this.supportUpperService.getFilteredSchemes({ scheme: value, startLimit: 0, endLimit: 50 });
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

  showSuggestionsBasedOnSchemeName(element) {
    console.log(element);
    this.isLoadingForDropDown = true;
    this.selectedElement = element;
    let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 0 })
        .subscribe(res => {
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
          this.filteredSchemes = [];
          this.filteredSchemes = res;
          console.log(res);
          this.checkIfDataNotPresentAndShowError(res);
        });
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
          } else {
            this.checkIfDataNotPresentAndShowError(res);
          }
        });
    }
  }
  displayFn(scheme?: Scheme): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  unMapMappedNjScheme(element) {
    let obj = {
      id: this.selectedSchemeRes.id,
      mutualFundSchemeMasterId: element.id,
      schemeCode: element.schemeCode
    }
    console.log(obj);
    this.supportUpperService.postUnmapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        if (res) {
          console.log(res);
          element.isMapped = false;
        }
      })
  }

  mapUnmappedNJScheme(element) {
    let obj = {
      id: this.selectedSchemeRes.id,
      mutualFundSchemeMasterId: element.id,
      rt_id: 5,
      schemeCode: element.schemeCode
    }
    console.log(obj);

    this.supportUpperService.postMapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        if (res) {
          console.log(res);
          element.isMapped = true;
        }
      })
  }

  mapNjScheme(element) {
    console.log("this is some mapping value:::::;", element);
  }

  getMappedUnmappedNjSchemes() {
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
          nav: item.nav,
          schemeName: '',
          schemeCode: '',
          amficode: '',
          navTwo: '',
          navDate: '',
          njCount: '',
          map: '',
          id: item.id,
          transactionDate: item.transactionDate,
          isSchemeSelected: false
        });
      });
      console.log("this is some data::::::", dataTable);
      this.dataTable = dataTable;
      this.dataSource.data = dataTable;
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
    this.getMappedUnmappedNjSchemes();
  }

  onPaginationChange(event) {
    console.log(event);
    if (event.value >= 0) {
      this.startLimit = event.value * 50;
    } else {
      this.startLimit = 0;
    }
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