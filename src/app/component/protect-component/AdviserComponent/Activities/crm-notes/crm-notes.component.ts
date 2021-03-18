import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { Subscription, Observable } from 'rxjs';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { startWith, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProcessTransactionService } from '../../transactions/overview-transactions/doTransaction/process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from '../../../common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-crm-notes',
  templateUrl: './crm-notes.component.html',
  styleUrls: ['./crm-notes.component.scss']
})
export class CrmNotesComponent implements OnInit {

  isAdvisorSection = true;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  filteredStates: any;
  stateCtrl = new FormControl('', [Validators.required]);
  familyMemberData: any;
  selectedName: any;
  listOfNotes: any;
  emailBody: string = "";
  selectedNote: any;
  noteData: any;
  notes: any;
  date: Date;
  isLoading: any;
  isMainLoading: any;
  clientId: any;
  objForDelete: any;
  searchQuery: any;
  activeOnSelect: boolean = false;
  hideOwner: boolean = false;
  showCheckBox: boolean = false;
  checkAdmin: boolean = false;
  clientInfo: any;
  getOrgData: any;
  userInfo: any;
  reportDate: Date;
  fragmentData = { isSpinner: false };
  returnValue: Subscription;
  subject: any;
  showContent: "";
  clientName: any;
  showContentPDf: any;
  @ViewChild('tableEl', { static: false }) tableEl: ElementRef;
  @Input() finPlanObj: any;
  @Output() loaded = new EventEmitter();//emit financial planning innerHtml reponse
  subjectPDF: any;
  sendTags: string;


  constructor(private peopleService: PeopleService,
    public dialog: MatDialog,
    public eventService: EventService,
    private utilService: UtilService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    public processTransaction: ProcessTransactionService, ) {
    this.clientInfo = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
    this.reportDate = new Date()
  }

  ngOnInit() {
    if (this.finPlanObj && this.finPlanObj.data) {
      //this.getNotes();
      this.listOfNotes = []
      this.getdataForm("")
      this.selectNote(this.finPlanObj.data)

    }
    this.objForDelete = []
    this.listOfNotes = []
    this.date = new Date()
    this.getNotes();
    this.getdataForm("")
    this.isLoading = true;
  }
  download(template, tableTitle) {
    //let rows = this.tableEl._elementRef.nativeElement.rows;
    this.fragmentData.isSpinner = true;
    const para = document.getElementById(template);
    const obj = {
      htmlInput: para.innerHTML,
      name: tableTitle,
      landscape: true,
      key: 'showPieChart',
      svg: ''
    };
    var innerHTML = para.innerHTML
    innerHTML = innerHTML.replace("%**TEXT%**REPLACE", this.sendTags)
    let header = null
    this.returnValue = this.utilService.htmlToPdf(header, innerHTML, tableTitle, false, this.fragmentData, 'showPieChart', '', true, 'Notes');
    console.log('return value ====', this.returnValue);
    return obj;
  }
  getdataForm(data) {
    this.notes = this.fb.group({
      subject: [(!data.ownershipType) ? '' : (data.subject) + '', [Validators.required]],
    });


  }
  showToClient(value) {
    if (value.checked == true) {
      this.hideOwner = true
    } else {
      this.hideOwner = false
    }
    this.checkAdmin = value.checked
  }
  getFormControl(): any {
    return this.notes.controls;
  }
  checkOwnerList(value) {
    if (!this.isAdvisorSection) {
      return;
    }
    if (value.length <= 2) {
      this.filteredStates = undefined
      return;
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(1000)).subscribe(
        data => {
          this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
            if (responseArray) {
              this.clientId = responseArray[0].clientId
              if (value.length >= 0) {
                this.filteredStates = responseArray;
              } else {
                this.filteredStates = undefined
              }
            } else {
              this.filteredStates = undefined
              this.stateCtrl.setErrors({ invalid: true })
            }
          }, error => {
            this.filteredStates = undefined
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }
  clearNote() {
    this.selectedNote = undefined
    this.emailBody = ""
    this.notes.controls.subject.setValue('')
    this, this.stateCtrl.setValue('')
    this.checkAdmin = false
    this.hideOwner = false
  }
  selectClient(value) {
    console.log(value)
    this.clientId = value.clientId
  }

  getNotes() {
    this.listOfNotes = []
    this.isLoading = true
    let obj = {
      advisorId: AuthService.getAdvisorId(),
      searchQuery: (this.searchQuery) ? this.searchQuery : '',
      limit: -1,
      offset: 0
    }
    this.peopleService.getNotes(obj)
      .subscribe(res => {
        if (res && res.length > 0) {
          console.log(res);
          this.isLoading = false
          this.listOfNotes = res
          this.listOfNotes.forEach(element => {
            element.showContent = element.content.replace(/(<([^>]+)>)/ig, '');
            element.activeOnSelect = false
            element.checked = false
          });
          console.log(this.listOfNotes);
        } else {
          this.isLoading = false
          this.listOfNotes = []
        }


      }, err => {
        console.error(err);
        this.isLoading = false
        this.listOfNotes = []
      })
    if (this.finPlanObj) {
      this.ref.detectChanges();//to refresh the dom when response come
      var inner = this.tableEl.nativeElement
      var innerHTML = inner.innerHTML
      inner.innerHTML = innerHTML.replace("%**TEXT%**REPLACE", this.sendTags)
      this.loaded.emit(inner);
    }
  }
  selectAll(event) {
    if (event.checked == true) {
      this.showCheckBox = true
      // this.listOfNotes.forEach(element => {
      //   element.checked = true
      //   this.objForDelete.push({ id: element.id })
      // });
    } else {
      this.showCheckBox = false
      // this.listOfNotes.forEach(element => {
      //   element.checked = false
      //   this.objForDelete = []
      // });
    }
  }
  selectNote(note) {
    console.log('selectedNote', note)
    this.stateCtrl.setValue('');
    this.selectedNote = note
    this.subjectPDF = (note.subject) ? note.subject : '-'
    this.showContentPDf = (note.showContent) ? String(note.showContent) : '-'
    this.clientName = note.clientName ? note.clientName : '-'
    this.clientId = note.clientId
    this.notes.controls.subject.setValue(note.subject)
    this.checkAdmin = note.forAdmin
    if (note.clientName) {
      this.hideOwner = false
      this.stateCtrl.setValue(note.clientName)
    } else {
      this.hideOwner = true
      this.stateCtrl.setValue('')
    }
    var para = document.createElement("P");
    para.innerText = note.content;
    document.body.appendChild(para);
    var text = para.innerHTML.replace(/&lt;/g, '<')
    var text1 = text.replace(/&gt;/g, '/>')
    this.sendTags = text1
    this.emailBody = note.content
    this.listOfNotes.forEach(element => {
      if (element.id == note.id) {
        element.activeOnSelect = true
      } else {
        element.activeOnSelect = false
      }

    });
  }
  addNotes(note) {
    let obj = {
      id: null,
      advisorId: AuthService.getAdvisorId(),
      clientId: (this.clientId) ? this.clientId : 0,
      clientName: this.stateCtrl.value,
      subject: this.notes.controls.subject.value,
      content: this.emailBody,
      updatedTime: new Date(),
      forAdmin: this.checkAdmin
    }
    console.log(obj);

    if (this.stateCtrl.invalid && this.checkAdmin == false) {
      this.stateCtrl.setErrors({ invalid: true })
      this.stateCtrl.markAllAsTouched();
      return;
    } else if (this.notes.invalid) {
      this.notes.markAllAsTouched();
      return;
    } else {
      if (!this.selectedNote) {
        this.peopleService.addNotes(obj)
          .subscribe(res => {
            console.log(res);
            this.eventService.openSnackBar("Note save successfully!", "DISMISS");
            this.getNotes()
            this.clearNote()
          }, err => {
            console.error(err);
          })
      } else {
        obj.id = this.selectedNote.id
        this.peopleService.editNotes(obj)
          .subscribe(res => {
            console.log(res);
            this.eventService.openSnackBar("Notes updated successfully!", "DISMISS");
            this.getNotes()
            this.clearNote()
          }, err => {
            console.error(err);
          })
      }
    }


  }
  selectForDelete(value, note) {
    if (this.objForDelete.length == 0) {
      if (value.checked == true) {
        this.objForDelete.push({ id: note.id })
      }
    } else {
      this.objForDelete.forEach((x) => {
        if (x.id != note.id) {
          if (value.checked == true) {
            this.objForDelete.push({ id: note.id })
          }
        }
      })
    }
    this.listOfNotes.forEach(element => {
      if (element.id == note.id) {
        element.checked = value.checked
      }
    });
  }
  editNotes() {
    let obj = {}

  }
  saveData(data) {
    this.emailBody = data;
  }
  onSearchChange(value) {
    this.searchQuery = value
    if (this.searchQuery.length > 3) {
      this.getNotes()
    } else if (this.searchQuery.length == "") {
      this.getNotes()
    }
  }
  deleteNotes(note) {
    if (note != "") {
      this.objForDelete = []
      this.objForDelete.push({ id: note.id })
    }
    const dialogData = {
      data: '',
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        // const obj = {
        //   advisorId: this.advisorId,
        //   id: this.singlePlanData.id
        // };
        this.peopleService.deleteNotes(this.objForDelete).subscribe(
          data => {
            this.getNotes()
            this.clearNote()
            dialogRef.close();
          }
        );

      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ownerDetails(value) {
    this.notes.controls.clientName.setValue(value.name)
    this.selectedName = value.name;
    this.familyMemberData = value;
  }
}
