import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { MatTableDataSource, MatTable } from '@angular/material/table';

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


const PRIMARY_DATA: EmailInterfaceI[] = [
  {
    position: 1, name: 'primary data 1', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 2, name: 'primary data 2', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 3, name: 'primary data 3', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 4, name: 'primary data 4', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 5, name: 'primary data 5', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 6, name: 'primary data 6', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 7, name: 'primary data 7', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 8, name: 'primary data 8', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 9, name: 'primary data 9', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 10, name: 'primary data 10', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 11, name: 'primary data 11', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 12, name: 'primary data 12', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 13, name: 'primary data 13', symbol: 'PR', weight: 980.990, isRead: false
  },
  {
    position: 14, name: 'primary data 14', symbol: 'PR', weight: 980.990, isRead: false
  },

];

const PROMOTION_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'promotion data 1', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 2, name: 'promotion data 2', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 3, name: 'promotion data 3', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 4, name: 'promotion data 4', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 5, name: 'promotion data 5', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 6, name: 'promotion data 6', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 7, name: 'promotion data 7', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 8, name: 'promotion data 8', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 9, name: 'promotion data 9', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 10, name: 'promotion data 10', symbol: 'PROMO', weight: 947.00, isRead: false },
  { position: 11, name: 'promotion data 11', symbol: 'PROMO', weight: 947.00, isRead: false },
];

const SOCIAL_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'social data 1', symbol: 'social', weight: 947.00, isRead: false },
  { position: 2, name: 'social data 2', symbol: 'social', weight: 947.00, isRead: false },
  { position: 3, name: 'social data 3', symbol: 'social', weight: 947.00, isRead: false },
  { position: 4, name: 'social data 4', symbol: 'social', weight: 947.00, isRead: false },
  { position: 5, name: 'social data 5', symbol: 'social', weight: 947.00, isRead: false },
  { position: 6, name: 'social data 6', symbol: 'social', weight: 947.00, isRead: false },
  { position: 7, name: 'social data 7', symbol: 'social', weight: 947.00, isRead: false },
  { position: 8, name: 'social data 8', symbol: 'social', weight: 947.00, isRead: false },
  { position: 9, name: 'social data 9', symbol: 'social', weight: 947.00, isRead: false },
  { position: 10, name: 'social data 10', symbol: 'social', weight: 947.00, isRead: false },
  { position: 11, name: 'social data 11', symbol: 'social', weight: 947.00, isRead: false },
  { position: 12, name: 'social data 12', symbol: 'social', weight: 947.00, isRead: false },
];

const FORUM_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'forum data 1', symbol: 'forum', weight: 947.00, isRead: false },
  { position: 2, name: 'forum data 2', symbol: 'forum', weight: 947.00, isRead: false },
  { position: 3, name: 'forum data 3', symbol: 'forum', weight: 947.00, isRead: false },
]

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

  getPrimaryDataList() {
    this.dataSource = new MatTableDataSource(PRIMARY_DATA);
  }

  getPromotionDataList() {
    this.dataSource = new MatTableDataSource(PROMOTION_DATA)
  }

  getSocialDataList() {
    this.dataSource = new MatTableDataSource(SOCIAL_DATA);
  }

  getForumDataList() {
    this.dataSource = new MatTableDataSource(FORUM_DATA);
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
