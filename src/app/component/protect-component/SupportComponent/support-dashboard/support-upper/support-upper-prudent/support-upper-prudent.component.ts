import { Subscription } from 'rxjs';
import { EventService } from './../../../../../../Data-service/event.service';
import { SupportUpperService } from './../support-upper.service';
import { SubscriptionInject } from './../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, PageEvent } from '@angular/material';
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

  constructor(
    public supportUpperService: SupportUpperService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.isLoading = true;
    this.getMappedUnmappedPrudentList();
    // this.getMappedUnmappedCount();

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
              this.isLoadingForDropDown = false;
            }),
          )
        )
      )
      .subscribe(data => this.onResponseHandlerAfterSearchingSchemes(data));

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
          this.prudentList = data;
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
          this.onResponseHandlerAfterSearchingSchemes(data)
        }
      });
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
      this.errorMsg = 'No Data Found';
    } else {
      this.errorMsg = '';
    }
    console.log(this.filteredSchemes);
  }

  setmapUnmap(event) {
    console.log(event);
    this.isMapped = event.value == 1 ? false : true;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.schemeControl.setValue('');
    this.getMappedUnmappedPrudentList();
  }

  unMapMappedPrudentScheme(element) {
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
          this.getMappedUnmappedPrudentList()
        }
      })
  }

  mapUnmappedPrudentScheme(element) {
    let obj = {
      id: element.id,
      mutualFundSchemeMasterId: element.mutualFundSchemeMasterId,
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
          this.eventService.openSnackBar('umap successfully', 'Dismiss');
        } else {
          this.getMappedUnmappedPrudentList()
          this.eventService.openSnackBar('umap successfully', 'Dismiss');
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
  showSuggestionsBasedOnSchemeName(element) {
    console.log(element);
    this.selectedElement = element;
    this.isLoadingForDropDown = true;
    let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(element);
    this.apiCallingStack.push(threeWords);
    if (this.apiCallingStack[1] !== threeWords) {
      this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 })
        .subscribe(res => {
          this.apiCallingStack = [];
          this.isLoadingForDropDown = false;
          this.filteredSchemes = res;
          console.log(res);
          if (this.supportUpperService.checkIfDataNotPresentAndShowError(res)) {
            this.errorMsg = 'No Data Found';
          } else {
            this.errorMsg = '';
          }
        });
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
    if (value === '') {
      if (this.selectedElement) {
        let threeWords = this.supportUpperService.getThreeWordsOfSchemeName(this.selectedElement);
        if (this.apiCallingStack[1] !== threeWords) {
          return this.supportUpperService.getFilteredSchemes({ scheme: threeWords, startLimit: 0, endLimit: 50 });
        }
      } else {
        return this.supportUpperService.getFilteredSchemes({ scheme: value, startLimit: 0, endLimit: 50 });
      }
    } else {
      return this.supportUpperService.getFilteredSchemes({ scheme: value, startLimit: 0, endLimit: 50 });
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
          nav: item.nav,
          schemeName: (this.isMapped == true) ? item.mutualFundSchemeName : '',
          schemeCode: item.schemeCode,
          amfiCode: item.amfiCode,
          navTwo: '',
          navDate: '',
          njCount: '',
          map: '',
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