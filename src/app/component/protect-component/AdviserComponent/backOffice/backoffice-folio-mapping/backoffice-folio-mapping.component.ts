import { FormControl } from '@angular/forms';
import { EventService } from './../../../../../Data-service/event.service';
import { BackofficeFolioMappingService } from './bckoffice-folio-mapping.service';
import { AuthService } from './../../../../../auth-service/authService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectFolioMapComponent } from './select-folio-map/select-folio-map.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-backoffice-folio-mapping',
  templateUrl: './backoffice-folio-mapping.component.html',
  styleUrls: ['./backoffice-folio-mapping.component.scss']
})
export class BackofficeFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'schemeName', 'number', 'investName'];
  dataSource;
  hasEndReached: boolean;
  infiniteScrollingFlag: boolean;
  finalUnmappedList: any = [];
  isLoading: boolean = false;
  unmappedDataSource: any;
  parentId;
  limit = 300;
  selection = new SelectionModel<any>(true, []);
  offset = 0;
  offsetList = 0;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('unmappedTableSort', { static: false }) unmappedTableSort: MatSort;
  selectedFolioCount: any = 0;
  showMappingBtn = false;
  searchForm: FormControl;
  isFromSearch = false;
  searchFormValue: any = '';
  searchError: boolean = false;
  searchErrorMessage: string = '';
  finalUnmappedListSearch: any = [];
  hasEndReachedSearch: boolean = false;

  constructor(
    private backOfcFolioMapService: BackofficeFolioMappingService,
    private eventService: EventService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initPoint();
  }

  initPoint(): void {
    this.searchForm = new FormControl();
    this.parentId = AuthService.getParentId();
    this.unmappedDataSource = new MatTableDataSource([]);
    this.getMutualFundFolioList(0);
    this.setValueChangesForSearch();
  }

  setValueChangesForSearch(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap(value => this.getBackofficeFolioUnmapSearchQuery(value))
      ).subscribe(res => {
        if (res) {
          this.changeDataTableAfterApi(res)
        } else {
          this.searchError = true;
          this.searchErrorMessage = 'No results';
        }
      });

  }

  getBackofficeFolioUnmapSearchQuery(value) {
    if (value !== '') {
      const data = {
        parentId: this.parentId,
        offset: this.offsetList,
        limit: 300,
        searchQuery: value
      }
      this.isFromSearch = true;
      this.searchFormValue = value;
      return this.backOfcFolioMapService.getMutualFundUnmapFolioSearchQuery(data)
    } else {
      this.isFromSearch = false;
      this.finalUnmappedList = [];
      this.finalUnmappedListSearch = [];
      return this.backOfcFolioMapService.getMutualFundUnmapFolio({
        parentId: this.parentId,
        offset: 0,
        limit: 300
      })
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows;
    if (this.unmappedDataSource) {
      numRows = this.unmappedDataSource.data.length;
    } else {
      numRows = 0;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.showMappingBtn = false;
      this.selection.clear();
      this.selectedFolioCount = 0;
    } else {
      this.showMappingBtn = true;
      this.selectedFolioCount = 0;
      this.unmappedDataSource.data.forEach((row, index) => {
        this.selectedFolioCount++;
        this.selection.select(row)
      });
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onWindowScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (this.isFromSearch) {
        if (!this.hasEndReachedSearch) {
          this.infiniteScrollingFlag = true;
          this.hasEndReachedSearch = true;
          let data = {
            parentId: this.parentId,
            searchQuery: this.searchFormValue,
            offset: this.offsetList,
            limit: 300
          }
          this.backOfcFolioMapService.getMutualFundUnmapFolioSearchQuery(data)
            .subscribe(res => {
              if (res) {
                this.changeDataTableAfterApi(res);
              } else {
                this.searchError = true;
                this.searchErrorMessage = "No Data Found";
              }
            })
          // this.getMutualFundFolioList(this.finalUnmappedListSearch.length);
        }
      } else if (!this.isFromSearch) {
        if (!this.hasEndReached) {
          this.infiniteScrollingFlag = true;
          this.hasEndReached = true;
          this.getMutualFundFolioList(this.finalUnmappedList.length);
        }
      }
    }
  }

  getMutualFundFolioList(offset): void {
    const data = {
      parentId: this.parentId,
      offset,
      limit: 300
    }
    this.isLoading = true;
    this.backOfcFolioMapService.getMutualFundUnmapFolio(data)
      .subscribe(res => this.changeDataTableAfterApi(res),
        err => {
          console.error(err);
          this.isLoading = false;
          this.unmappedDataSource.data = null;
        })
  }

  changeDataTableAfterApi(res) {
    this.isLoading = false;
    console.log(res);
    if (res && res.length > 0) {
      if (this.isFromSearch) {
        this.finalUnmappedListSearch = this.finalUnmappedListSearch.concat(res);
        this.unmappedDataSource.data = this.finalUnmappedListSearch;
        this.offsetList = this.finalUnmappedListSearch.length;
        this.hasEndReachedSearch = false;
      } else {
        this.finalUnmappedList = this.finalUnmappedList.concat(res);
        this.unmappedDataSource.data = this.finalUnmappedList;
        this.hasEndReached = false;
      }
      this.unmappedDataSource.sort = this.unmappedTableSort;

    } else {
      this.isLoading = false;
      if (this.isFromSearch) {
        this.unmappedDataSource.data = (this.finalUnmappedListSearch.length > 0) ? this.finalUnmappedListSearch : null;
      } else {
        this.unmappedDataSource.data = (this.finalUnmappedList.length > 0) ? this.finalUnmappedList : null;
      }
    }
    this.infiniteScrollingFlag = false;
    this.offset = this.unmappedDataSource.data.length;
  }

  toggleSelectionOfRow(event, row) {
    if (event) {
      this.selection.toggle(row);
      if (this.selection.isSelected(row)) {
        this.selectedFolioCount++;
      } else {
        this.selectedFolioCount--;
      }
      if (this.selection.isEmpty()) {
        this.showMappingBtn = false;
      } else {
        this.showMappingBtn = true;
      }
    }
  }

  selectingRows(row) {
    return this.selection.isSelected(row);
  }

  openFolio() {
    const dialogRef = this.dialog.open(SelectFolioMapComponent, {
      width: '663px',
      //height: '679px',
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}


export interface PeriodicElement {
  position: string;
  schemeName: string;
  number: string;
  investName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '', schemeName: '', number: '', investName: '' },
  { position: '', schemeName: '', number: '', investName: '' },
  { position: '', schemeName: '', number: '', investName: '' },
];