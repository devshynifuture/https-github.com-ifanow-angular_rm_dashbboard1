import { EventService } from './../../../../../Data-service/event.service';
import { BackofficeFolioMappingService } from './bckoffice-folio-mapping.service';
import { AuthService } from './../../../../../auth-service/authService';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SelectFolioMapComponent } from './select-folio-map/select-folio-map.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections';

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
  advisorId: string;
  isLoading: boolean = false;
  unmappedDataSource: any;
  parentId;
  start;
  end;
  limit = 15;
  selection = new SelectionModel<any>(true, []);
  offset = 0;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('unmappedTableSort', { static: false }) unmappedTableSort: MatSort;
  selectedFolioCount: any = 0;
  showMappingBtn = false;

  constructor(
    private backOfcFolioMapService: BackofficeFolioMappingService,
    private eventService: EventService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initPoint();
  }

  initPoint(): void {
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getParentId();
    this.unmappedDataSource = new MatTableDataSource(ELEMENT_DATA);
    this.getMutualFundFolioList(0);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows;
    if (this.unmappedDataSource && this.unmappedDataSource.data.length > 0) {
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
      this.unmappedDataSource.data.forEach((row, index) => {
        this.selectedFolioCount += (index + 1);
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
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getMutualFundFolioList(this.finalUnmappedList.length);
        // this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
      }

    }
  }

  getMutualFundFolioList(offset): void {
    const data = {
      advisorId: this.advisorId,
      parentId: this.parentId,
      offset,
      limit: 300,
      searchQuery: 0
    }

    this.isLoading = true;

    this.backOfcFolioMapService.getMutualFundUnmapFolio(data)
      .subscribe(res => {
        this.isLoading = false;
        console.log(res);
        if (res && res.length > 0) {
          this.finalUnmappedList = this.finalUnmappedList.concat(res);
          this.unmappedDataSource.data = this.finalUnmappedList;
          this.unmappedDataSource.sort = this.unmappedTableSort;
          this.hasEndReached = false;
          this.infiniteScrollingFlag = false;
        } else {
          this.isLoading = false;
          this.infiniteScrollingFlag = false;
          this.unmappedDataSource.data = (this.finalUnmappedList.length > 0) ? this.finalUnmappedList : [];
        }
      }, err => { console.error(err); this.isLoading = false })
  }

  toggleSelectionOfRow(event, row) {
    if (event) {
      this.selection.toggle(row)
    }
  }

  selectingRows(row) {
    console.log(row);
    this.showMappingBtn = true;
    this.selection.isSelected(row);
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