import { Component, OnInit, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-gmail-form',
  templateUrl: './delete-gmail-form.component.html',
  styleUrls: ['./delete-gmail-form.component.css']
})
export class DeleteGmailFormComponent implements OnInit {
  form!: FormGroup;
  serverResponse: string = '';

  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    // Build the form using FormBuilder
    this.form = this.formBuilder.group({
      email_id    : '',
      search_query: ''
    });
  }

  confirmDelete() {
    if (confirm("Are you sure you want to delete the emails?")) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    // Get the user input values from the form
    const email = this.form.value.email_id;
    const query = this.form.value.search_query;
    
    // Send an HTTP request to the backend server to execute the Python script
    this.http.post('http://127.0.0.1:5000/delete-gmails', { email, query }).subscribe(
      (response) => {
        // Handle successful response from server
        this.serverResponse = response.toString();
        console.log(response);
      },
      (error) => {
        // Handle error response from server
        console.error(error);
      }
    );
  }

  showConfirmation(): void {
    // Get the user input values from the form
    const email = this.form.value.email_id;
    const query = this.form.value.search_query;

    // Open a confirmation dialog box with the values of email_id and search_query
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { email_id: email, search_query: query }
    });

    // When the user clicks the 'Yes' button, execute the script
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onSubmit();
      }
    });
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Delete?</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete emails with the following criteria?</p>
      <p><strong>Email:</strong> {{ data.email_id }}</p>
      <p><strong>Search Query:</strong> {{ data.search_query }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">No</button>
      <button mat-button [mat-dialog-close]="true">Yes</button>
    </div>
  `
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}


