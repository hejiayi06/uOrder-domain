import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifyArrayComponent } from './modify-array.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModifyCheckComponent } from './modify-check/modify-check.component';



@NgModule({
  declarations: [ModifyArrayComponent, ModifyCheckComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[ModifyArrayComponent,ModifyCheckComponent],
})
export class ModifyArrayModule { }
