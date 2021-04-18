import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';

const routes: Routes = [
  {
    path: '', component: UsersComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'edit/:id', component: AddEditComponent },
      { path: 'add', component: AddEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
