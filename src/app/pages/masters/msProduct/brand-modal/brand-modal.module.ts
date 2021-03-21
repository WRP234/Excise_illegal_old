import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandModalComponent } from './brand-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [BrandModalComponent],
  exports: [
    BrandModalComponent
  ]
})
export class BrandModalModule { }
