import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { MatchItems } from 'src/app/_helpers';
import { AccountService } from 'src/app/_services'


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    
  ) { }

  ngOnInit(): void {
    console.log("registration component loading");
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', Validators.email],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MatchItems('password', 'confirmPassword')
    });
  }
  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.register(this.registrationForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Registration successful!');
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: error => {
          this.toastr.error(error, 'Registration failed.');
          this.loading = false;
        }
      });

  }

}
