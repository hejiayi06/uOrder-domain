import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/apis/auth.service';
import { MessageService } from 'src/app/share/components/message/message.service';

@Component({
  selector: 'uo-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  loading: boolean = false;
  isSend: boolean = false;
  forgetPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  get email() {
    return this.forgetPasswordForm.get('email');
  }
  constructor(
    private fb: FormBuilder,
    private authServe: AuthService,
    private cdr: ChangeDetectorRef,
    private messageServe: MessageService
  ) {}

  ngOnInit(): void {}
  onSubmit(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.authServe.forgotPassword(this.forgetPasswordForm.value).subscribe(
      (res) => {
        console.log('forgotPassword :>> ', res);
        if (res && res.data && res.data.value) {
          this.isSend = true;
          this.messageServe.success(
            'A password reset link was sent to your email. Click the link in the email to create a new password.'
          );
        } else {
          this.isSend = false;
          this.messageServe.danger('Something wrong!');
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
}
