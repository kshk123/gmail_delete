import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-gmail-form',
  templateUrl: './delete-gmail-form.component.html',
  styleUrls: ['./delete-gmail-form.component.css']
})
export class DeleteGmailFormComponent implements OnInit {
  form!: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }
  
  ngOnInit(): void {
    // Build the form using FormBuilder
    this.form = this.formBuilder.group({
      email_id    : '',
      search_query: ''
    });
  }

  onSubmit(): void {
    // Get the user input values from the form
    const email = this.form.value.email_id;
    const query = this.form.value.search_query;
    
    // Send an HTTP request to the backend server to execute the Python script
    this.http.post('http://127.0.0.1:5000/delete-gmails', { email, query }).subscribe(
      (response) => {
        // Handle successful response from server
        console.log(response);
      },
      (error) => {
        // Handle error response from server
        console.error(error);
      }
    );
  }
}
