import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from 'src/app/_services'
import { MatchItems } from 'src/app/_helpers';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  userForm: FormGroup;
  id: string;
  loading = false;
  submitted = false;
  isAddMode: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      emailAddress: ['', Validators.email],
      password: ['', passwordValidators],
      confirmPassword: ['', passwordValidators]
    }, {
      validator: MatchItems('password', 'confirmPassword')
    });

    if (!this.isAddMode) {
      this.accountService.getById(this.id)
        .pipe(first())
        //.subscribe(x => this.userForm.patchValue(x));
        .subscribe({
          next: (x) => {
            this.userForm.patchValue(x);
          },
          error: error => {
            this.toastr.error(error);
          }
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.accountService.register(this.userForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('User added successfully!');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.toastr.error(error);
          this.loading = false;
        }
      });
  }

  private updateUser() {
    this.accountService.update(this.id, this.userForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('User updated successfully!');
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.toastr.error(error);
          this.loading = false;
        }
      });
  }

}
