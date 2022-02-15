import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HeaderComponent, ShoppingCartComponent],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  exports: [HeaderComponent, ShoppingCartComponent],
})
export class HeaderModule {}
