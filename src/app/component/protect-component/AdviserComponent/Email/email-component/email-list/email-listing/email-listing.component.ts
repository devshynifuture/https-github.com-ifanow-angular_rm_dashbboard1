import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { SubscriptionInject } from './../../../../Subscriptions/subscription-inject.service';

import { EmailServiceService } from './../../../email-service.service';
import { EmailInterfaceI } from '../../email.interface';


const ELEMENT_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', isRead: false },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', isRead: false },
  { position: 3, name: 'ithium', weight: 6.941, symbol: 'Li', isRead: false },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', isRead: false },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', isRead: false },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', isRead: false },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', isRead: false },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', isRead: false },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', isRead: false },
  { position: 11, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 12, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 13, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 14, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 15, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 16, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 17, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 18, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 19, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 21, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 22, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 23, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 24, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 25, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 26, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 27, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 28, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 29, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 30, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 31, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 32, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 33, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 34, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 35, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 36, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 37, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 38, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 39, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
  { position: 40, name: 'Neon', weight: 20.1797, symbol: 'Ne', isRead: false },

];


@Component({
  selector: 'app-email-listing',
  templateUrl: './email-listing.component.html',
  styleUrls: ['./email-listing.component.scss']
})
export class EmailListingComponent implements OnInit, OnDestroy {

  constructor(private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  paginatorLength;
  paginatorSubscription;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorSubscription = this.emailService.getPaginatorLength().subscribe(response => {
      console.log('paginator response=>>>>', response);
      this.paginatorLength = response.threadsTotal;
    })
  }

  ngOnDestroy() {
    this.paginatorSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<EmailInterfaceI>(ELEMENT_DATA);
  selection = new SelectionModel<EmailInterfaceI>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EmailInterfaceI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  gotoEmailView(dataObj: Object) {
    this.emailService.sendNextData(dataObj);
    this.router.navigate(['view'], { relativeTo: this.activatedRoute });
  }

  doRefresh() {
    this.emailService.refreshList('inbox');
  }
}
