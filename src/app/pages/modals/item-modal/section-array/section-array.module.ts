import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionCheckComponent } from './section-check/section-check.component';
import { SectionArrayComponent } from './section-array.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionSizerComponent } from './section-sizer/section-sizer.component';



@NgModule({
  declarations: [
    SectionCheckComponent,
    SectionArrayComponent,
    SectionSizerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    SectionCheckComponent,
    SectionArrayComponent,
    SectionSizerComponent
  ]
})
export class SectionArrayModule { }
