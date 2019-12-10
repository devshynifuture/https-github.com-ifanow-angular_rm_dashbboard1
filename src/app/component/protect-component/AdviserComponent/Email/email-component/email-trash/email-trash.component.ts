import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { EmailServiceService } from './../../email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { EmailInterfaceI } from '../email.interface';

const ELEMENT_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'trash Hydrogen', weight: 1.0079, symbol: 'H', isRead: false },
  { position: 2, name: 'trash Helium', weight: 4.0026, symbol: 'He', isRead: false },
  { position: 3, name: 'trashLithium', weight: 6.941, symbol: 'Li', isRead: false },
  { position: 4, name: 'trash Beryllium', weight: 9.0122, symbol: 'Be', isRead: false },
  { position: 5, name: 'trash Boron', weight: 10.811, symbol: 'B', isRead: false },
  { position: 6, name: 'trash Carbon', weight: 12.0107, symbol: 'C', isRead: false },
  { position: 7, name: 'trash Nitrogen', weight: 14.0067, symbol: 'N', isRead: false },
  { position: 8, name: 'trash Oxygen', weight: 15.9994, symbol: 'O', isRead: false },
  { position: 9, name: 'trash Fluorine', weight: 18.9984, symbol: 'F', isRead: false },
  { position: 10, name: 'trash Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
];



@Component({
  selector: 'app-email-trash',
  templateUrl: './email-trash.component.html',
  styleUrls: ['./email-trash.component.scss']
})
export class EmailTrashComponent implements OnInit {
  constructor(private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<EmailInterfaceI>(ELEMENT_DATA);
  selection = new SelectionModel<EmailInterfaceI>(true, []);

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
    this.router.navigate(['admin', 'emails', 'inbox', 'view']);
  }

  doRefresh() {
    this.emailService.refreshList('trash');
  }
}
