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
  isMainLoading: any;
  isLoading: boolean;
  objForDelete: any;
  searchQuery: any;
  visibleToClient: boolean = true;
  before: any;
  activeOnSelect: boolean = false;
  hideOwner: boolean = false;
  showCheckBox: boolean = false;
  checkAdmin: boolean = false;

  constructor(private peopleService: PeopleService,
    public dialog: MatDialog,
    public eventService: EventService,
    private fb: FormBuilder,
    public processTransaction: ProcessTransactionService, ) { }

  ngOnInit() {
    this.listOfNotes = []
    this.objForDelete = []
    this.date = new Date()
    this.getNotes();
    this.getdataForm("")
    this.clientData = AuthService.getClientData();
  }
  getdataForm(data) {
    this.notes = this.fb.group({
      subject: [(!data.ownershipType) ? '' : (data.subject) + '', [Validators.required]],
    });


  }

  getFormControl(): any {
    return this.notes.controls;
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

  clearNote() {
    this.emailBody = ""
    this.selectedNote = undefined
    this.notes.controls.subject.setValue('')
  }
  showToClient(value) {
    this.visibleToClient = value.checked
  }
  getNotes() {
    this.isLoading = true
    let obj = {
      clientId: AuthService.getClientId(),
      limit: -1,
      offset: 0,
      searchQuery: (this.searchQuery) ? this.searchQuery : '',
    }
    this.peopleService.getNotes(obj)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.isLoading = false
          this.before = res
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
      })
  }
  selectNote(note) {
    console.log('selectedNote', note)
    this.selectedNote = note
    this.notes.controls.subject.setValue(note.subject)
    this.emailBody = note.content
    this.checkAdmin = note.visibleToClient
    this.listOfNotes.forEach(element => {
      if (element.id == note.id) {
        element.activeOnSelect = true
      } else {
        element.activeOnSelect = false
      }

    });
  }
  onSearchChange(value) {
    this.searchQuery = value
    if (this.searchQuery.length > 3) {
      this.getNotes()
    } else if (this.searchQuery.length == "") {
      this.getNotes()
    }
  }
  addNotes(note) {
    let obj = {
      id: null,
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId(),
      clientName: this.clientData.name,
      subject: this.notes.controls.subject.value,
      content: this.emailBody,
      updatedTime: new Date(),
      visibleToClient: this.visibleToClient
    }
    if (this.notes.invalid) {
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
  editNotes() {
    let obj = {}

  }
  saveData(data) {
    this.emailBody = data;
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
}
