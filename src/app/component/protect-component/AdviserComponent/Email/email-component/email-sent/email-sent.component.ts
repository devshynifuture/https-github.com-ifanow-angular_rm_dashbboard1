import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { EmailServiceService } from '../../email-service.service';
import { EmailInterfaceI } from '../email.interface';

const ELEMENT_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'sent Hydrogen', weight: 1.0079, symbol: 'H', isRead: false },
  { position: 2, name: 'sent Helium', weight: 4.0026, symbol: 'He', isRead: false },
  { position: 3, name: 'sentLithium', weight: 6.941, symbol: 'Li', isRead: false },
  { position: 4, name: 'sent Beryllium', weight: 9.0122, symbol: 'Be', isRead: false },
  { position: 5, name: 'sent Boron', weight: 10.811, symbol: 'B', isRead: false },
  { position: 6, name: 'sent Carbon', weight: 12.0107, symbol: 'C', isRead: false },
  { position: 7, name: 'sent Nitrogen', weight: 14.0067, symbol: 'N', isRead: false },
  { position: 8, name: 'sent Oxygen', weight: 15.9994, symbol: 'O', isRead: false },
  { position: 9, name: 'sent Fluorine', weight: 18.9984, symbol: 'F', isRead: false },
  { position: 10, name: 'sent Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
];



@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {
  constructor(
    private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    private router: Router) { }

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
    this.emailService.refreshList('sent');
  }
}
