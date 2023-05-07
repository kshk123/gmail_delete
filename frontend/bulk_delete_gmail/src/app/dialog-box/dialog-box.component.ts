import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  clearForm: () => void;
}

@Component({
  selector: 'app-dialog-box',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      {{ data.message }}
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onOKClick()">OK</button>
    </div>
  `,
})
export class DialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onOKClick(): void {
    this.data.clearForm();
    this.dialogRef.close();
  }
}

