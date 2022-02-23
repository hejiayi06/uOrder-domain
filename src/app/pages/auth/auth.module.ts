import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SimpleHeaderModule } from 'src/app/layout/simple-header/simple-header.module';
import { FooterModule } from 'src/app/layout/footer/footer.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialiteComponent } from './socialite/socialite.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    SocialiteComponent,
  ],
  imports: [
    CommonModule,
    SimpleHeaderModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
  ],
  exports: [SignInComponent, SignUpComponent, ForgotPasswordComponent],
})
export class AuthModule {}
