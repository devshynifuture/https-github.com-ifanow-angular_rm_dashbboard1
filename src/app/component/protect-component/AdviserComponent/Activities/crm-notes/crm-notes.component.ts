import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { Subscription, Observable } from 'rxjs';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { startWith, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProcessTransactionService } from '../../transactions/overview-transactions/doTransaction/process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from '../../../common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

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
  isMainLoading: any;


  constructor(private peopleService: PeopleService,
    public dialog: MatDialog,
    public eventService: EventService,
    private fb: FormBuilder,
    public processTransaction: ProcessTransactionService,) { }

  ngOnInit() {
    this.date = new Date()
    this.getNotes();
    this.getdataForm("")
  }
  getdataForm(data) {
    this.notes = this.fb.group({
      subject: [(!data.ownershipType) ? '' : (data.subject) + '', [Validators.required]],
      clientName: [(!data.clientName) ? '' : (data.clientName) + '', [Validators.required]],
    });


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
    this.emailBody = ""
    this.notes.controls.subject.setValue('')
  }
  getNotes() {
    let obj = {
      advisorId: 5441,
      limit: -1,
      offset: 0
    }
    this.peopleService.getNotes(obj)
      .subscribe(res => {
        console.log(res);
        this.listOfNotes = res
        this.listOfNotes.forEach(element => {
          element.content = element.content.replace(/<\/?p[^>]*>/g, "");
        });
        console.log(this.listOfNotes);

      }, err => {
        console.error(err);
        this.listOfNotes = []
      })
  }
  selectNote(note) {
    console.log('selectedNote', note)
    this.stateCtrl.setValue('');
    this.selectedNote = note
    this.notes.controls.subject.setValue(note.subject)
    this.notes.controls.clientName.setValue(note.clientName)
    this.stateCtrl.setValue(note.clientName)
    this.emailBody = note.content
  }
  addNotes(note) {
    let obj = {
      id: null,
      advisorId: 5441,
      clientId: 96138,
      clientName: this.stateCtrl.value.name,
      subject: this.notes.controls.subject.value,
      content: this.emailBody,
      updatedTime: new Date()
    }
    if (!this.selectedNote) {
      this.peopleService.addNotes(obj)
        .subscribe(res => {
          console.log(res);
          this.eventService.openSnackBar("Note save successfully!", "DISMISS");
          this.getNotes()
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
        }, err => {
          console.error(err);
        })
    }

  }
  editNotes() {
    let obj = {}

  }
  saveData(data) {
    this.emailBody = data;
  }

  deleteNotes(note, value) {
    this.noteData = note;
    let obj = { id: note.id }
    const dialogData = {
      data: value,
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
        this.peopleService.deleteNotes(obj).subscribe(
          data => {
            //  this.deletedData(data);
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
      this.getNotes()
      this.clearNote()
    });
  }
  ownerDetails(value) {
    this.selectedName = value.name;
    this.familyMemberData = value;
  }
}
