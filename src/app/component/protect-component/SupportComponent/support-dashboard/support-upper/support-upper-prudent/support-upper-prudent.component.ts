import { Subscription } from 'rxjs';
import { EventService } from './../../../../../../Data-service/event.service';
import { SupportUpperService } from './../support-upper.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, PageEvent, MatPaginator } from '@angular/material';
import { switchMap, finalize, debounceTime, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AnyCnameRecord } from 'dns';

@Component({
  selector: 'app-support-upper-prudent',
  templateUrl: './support-upper-prudent.component.html',
  styleUrls: ['./support-upper-prudent.component.scss']
})
export class SupportUpperPrudentComponent implements OnInit {

  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  selectedElement: any;
  isLoadingForDropDown: boolean;
  filteredSchemes: any[];
  filteredSchemeError: boolean;
  errorMsg: string;
  schemeControl: FormControl = new FormControl();
  apiCallingStack: any = [];
  prudentList = [];
  dataTable: elementI[];
  isLoading: boolean = false;
  searchSchemeControl = new FormControl();
  mapUnmapFC = new FormControl(1);
  prudentSelectOptionList = [
    { id: 1, title: 'Unmapped' },
    { id: 2, title: 'Mapped' }
  ];
  isMapped: boolean = false;
  schemeControlSubs: Subscription;
  searchSchemeControlSubs: Subscription;
  selectedSchemeRes: any = null;
  totalPrudentCount = null;
  pageEvent: PageEvent;
  startLimit = 0;
  storedVal: string;

  constructor(
    public supportUpperService: SupportUpperService,
    private eventService: EventService
  ) { }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.isLoading = true;
    this.getMappedUnmappedPrudentList();
    // this.getMappedUnmappedCount();

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
              this.isLoadingForDropDown = false;
            }),
          )
        )
      )
      .subscribe(data => this.onResponseHandlerAfterSearchingSchemes(data));

    // this.searchSchemeControlSubs = this.searchSchemeControl.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     tap(() => {
    //       //this.errorMsg = "";
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
    //       this.prudentList = data;
    //       data.forEach(item => {
    //         dataTable.push({
    //           name: item.schemeName,
    //           nav: item.nav,
    //           schemeName: '',
    //           schemeCode: '',
    //           amficode: '',
    //           navTwo: '',
    //           navDate: '',
    //           njCount: '',
    //           map: '',
    //           id: item.id,
    //           transactionDate: item.transactionDate
    //         });
    //       });
    //       console.log("this is some data::::::", dataTable);
    //       this.dataTable = dataTable;
    //       this.dataSource.data = dataTable;
    //       console.log(data);
    //       this.onResponseHandlerAfterSearchingSchemes(data)
    //     }
    //   });
  }

  searchSchemeNjPrudent(value) {
    if (value === '') {
      if (this.selectedElement) {
        let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
        if (this.apiCallingStack[1] !== threeWords) {
          return this.supportUpperService.getSearchSchemeList({ rtMasterId: 4, schemeName: threeWords, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
        }
      } else {
        return this.supportUpperService.getSearchSchemeList({ rtMasterId: 4, schschemeNameeme: value, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
      }
    } else {
      return this.supportUpperService.getSearchSchemeList({ rtMasterId: 4, schemeName: value, startLimit: 0, endLimit: 50, isMapped: this.isMapped });
    }
  }

  onResponseHandlerAfterSearchingSchemes(data) {
    this.apiCallingStack = [];
    this.filteredSchemes = data;
    console.log("this is what i need::::::::", data);
    if (data && data.length > 0) {
      //this.errorMsg = 'No Data Found';
    } else {
      //this.errorMsg = '';
    }
    console.log(this.filteredSchemes);
  }

  setmapUnmap(event) {
    console.log(event);
    this.isMapped = event.value == 1 ? false : true;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.schemeControl.setValue('');
    this.startLimit = 0;
    this.paginator.pageIndex = 0;
    this.getMappedUnmappedPrudentList();
  }

  unMapMappedPrudentScheme(element) {
    let obj = {
      id: element.id,
      mutualFundSchemeMasterId: element.mutualFundSchemeMasterId,
      schemeCode: element.schemeCode
    }
    console.log(obj);
    this.supportUpperService.postUnmapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        console.log(res);
        element.isMapped = false;
        this.getMappedUnmappedPrudentList()
        this.eventService.openSnackBar('unmap successfully', 'Dismiss');
      })
  }

  mapUnmappedPrudentScheme(element) {
    let obj = {
      id: this.selectedSchemeRes.id,
      mutualFundSchemeMasterId: element.id,
      rt_id: 4,
      schemeCode: element.schemeCode
    }
    console.log(obj);

    this.supportUpperService.postMapUnmappedNjPrudentScheme(obj)
      .subscribe(res => {
        if (res) {
          console.log(res);
          element.isMapped = true;
          this.getMappedUnmappedPrudentList()
          this.eventService.openSnackBar('map successfully', 'Dismiss');
        } else {
          this.getMappedUnmappedPrudentList()
          this.eventService.openSnackBar('map successfully', 'Dismiss');
        }
      })
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


  displayFn(scheme?: Scheme): string | undefined {
    return scheme ? scheme.schemeName : undefined;
  }

  searchSchemeName(element) {
    if (element !== '') {
      console.log(element);
      this.isLoading = true;
      this.isLoadingForDropDown = true;
      let threeWords = element;
      this.schemeControl.patchValue(null, { emitEvent: false });
      //let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
      //this.apiCallingStack.push(threeWords);
      if (this.apiCallingStack[1] !== threeWords && element.length >= 3) {
        this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 })
          .subscribe(res => {
            if (res) {
              this.isLoading = false;
              let dataTable: any[] = [];
              this.apiCallingStack = [];
              this.isLoadingForDropDown = false;
              this.prudentList = res;
              res.forEach(item => {
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
              console.log(res);
              // this.checkIfDataNotPresentAndShowError(res);
            }
          }, err => {
            this.isLoading = false;
            this.isLoadingForDropDown = false;
            console.error(err);
          });
      }
    }
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
      // this.filteredSchemes = []
      // this.selectedSchemeRes = '';
      // element.isSchemeSelected = false;
      // element.navDate = ''
      // element.nav = ''
      // element.amfiCode = ''
      // element.njPrudentCount = ''
      // element.schemeCode = '';
      // element.njCount = '';
      // element.nav = ''
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
      this.supportUpperService.getSearchSchemeList({ rtMasterId: 4, schemeName: eve, startLimit: 0, endLimit: 50, isMapped: this.isMapped })
        .subscribe(data => {
          this.isLoading = false;
          this.isLoadingForDropDown = false;
          if (data) {
            let dataTable: any[] = [];
            this.apiCallingStack = [];
            // this.njSchemeMasterList = data;
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
      this.getMappedUnmappedPrudentList();
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
  mapSchemeCodeAndOther(element, scheme) {
    console.log(element);
    this.supportUpperService.getSchemesDetails({ id: scheme.id })
      .subscribe(res => {
        console.log('scheme details', res)
        this.selectedSchemeRes = res;
        element.isSchemeSelected = true;
        element.navDate = res.navDate
        element.nav = res.nav
        element.amfiCode = res.amfiCode
        element.njPrudentCount = res.njPrudentCount
        element.schemeCode = scheme.schemeCode;
        element.njCount = scheme.njCount;
      });
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

  getSearchNJSchemes(value) {
    if (value === '') {
      if (this.selectedElement) {
        let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
        if (this.apiCallingStack[1] !== threeWords) {
          return this.supportUpperService.getSearchSchemeList({ scheme: threeWords, startLimit: 0, endLimit: 50 });
        }
      } else {
        return this.supportUpperService.getSearchSchemeList({ scheme: value, startLimit: 0, endLimit: 50 });
      }
    } else {
      return this.supportUpperService.getSearchSchemeList({ scheme: value, startLimit: 0, endLimit: 50 });
    }
  }

  getMappedUnmappedPrudentList() {
    let data = {
      rtMasterId: 4,
      startLimit: this.startLimit,
      endLimit: this.startLimit + 50,
      isMapped: this.isMapped
    };
    this.supportUpperService.getUnmappedSchemesPrudent(data).subscribe(res => {
      console.log("this is unmapped Prudent schemes::::::::::", res);
      this.isLoading = false;
      let dataTable: any[] = [];
      this.prudentList = res.njSchemeMasterList;
      this.totalPrudentCount = res.count;
      res.njSchemeMasterList.forEach(item => {
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
          njNav: item.nav,
          isMapped: this.isMapped,
          id: item.id,
          transactionDate: item.transactionDate,
          isSchemeSelected: false,
          mutualFundSchemeMasterId: (this.isMapped == true) ? item.mutualFundSchemeMasterId : '',
        });
        // if (this.isMapped == true) {
        //   dataTable.forEach(element => {
        //     element.schemeName = 
        //     element.mutualFundSchemeMasterId = item.mutualFundSchemeMasterId

        //   });
        // }
      });
      console.log("this is some data::::::", dataTable);
      this.dataTable = dataTable;
      this.dataSource.data = dataTable;
      this.schemeControl.setValue('');
      if (this.isMapped == true) {
        this.displayedColumns = ['name', 'schemeName', 'schemeCode', 'amficode', 'map'];

      } else {
        this.displayedColumns = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
      }

    }, err => {
      console.error(err);
    });
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
    console.log('close');
  }

  ngOnDestroy(): void {
    if (this.schemeControlSubs) {
      this.schemeControlSubs.unsubscribe();
    }
    if (this.searchSchemeControlSubs) {
      this.searchSchemeControlSubs.unsubscribe();
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
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
  { name: '', nav: '', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },
]