import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-service/authService';
import { ProcessTransactionService } from 'src/app/component/protect-component/AdviserComponent/transactions/overview-transactions/doTransaction/process-transaction.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-notes-activity',
  templateUrl: './notes-activity.component.html',
  styleUrls: ['./notes-activity.component.scss']
})
export class NotesActivityComponent implements OnInit {

  isAdvisorSection = true;
  filteredStates: any;
  familyMemberData: any;
  selectedName: any;
  listOfNotes: any;
  emailBody: string = "";
  selectedNote: any;
  noteData: any;
  notes: any;
  date: Date;
  clientData: any;


  constructor(private peopleService: PeopleService,
    public dialog: MatDialog,
    public eventService: EventService,
    private fb: FormBuilder,
    public processTransaction: ProcessTransactionService,) { }

  ngOnInit() {
    this.date = new Date()
    this.getNotes();
    this.getdataForm("")
    this.clientData = AuthService.getClientData();
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
  clearNote() {
    this.emailBody = ""
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
      }, err => {
        console.error(err);
      })
  }
  selectNote(note) {
    console.log('selectedNote', note)
    this.selectedNote = note
    this.notes.controls.subject.setValue(note.subject)
    this.emailBody = note.content
  }
  addNotes(note) {
    let obj = {
      id: null,
      advisorId: 5441,
      clientId: 96138,
      clientName: this.clientData.name,
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
        this.peopleService.deleteNotes(this.noteData.id).subscribe(
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
    });
  }
}
