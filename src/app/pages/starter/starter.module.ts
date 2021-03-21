import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { StarterComponent } from './starter.component';
import { MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatIconModule } from '@angular/material';
const routes: Routes = [{
	path: '',
	component: StarterComponent
}];

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		MatStepperModule,
        MatInputModule,
        MatButtonModule,
		MatAutocompleteModule,  
		MatIconModule,
		MatButtonModule,
		RouterModule.forChild(routes)
	],
	declarations: [StarterComponent]
})
export class StarterModule { }