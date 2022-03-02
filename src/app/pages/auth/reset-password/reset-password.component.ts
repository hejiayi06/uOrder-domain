import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/apis/auth.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { ConfirmedValidator } from 'src/app/share/validatorFns/confirm-password';

@Component({
  selector: 'uo-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  loading: boolean = false;
  resetPasswordForm: FormGroup = this.fb.group(
    {
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      // token:[this.route.snapshot.data['auth'].token],
      token: [this.route.snapshot.params['token']],
      signature: [this.route.snapshot.params['signature']],
    },
    { validator: ConfirmedValidator('password', 'confirm_password') }
  );
  passwordToggle: boolean = true;
  confirmPasswordToggle: boolean = true;

  get password() {
    return this.resetPasswordForm.get('password');
  }
  get confirm_password() {
    return this.resetPasswordForm.get('confirm_password');
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authServe: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageServe: MessageService
  ) {}

  ngOnInit(): void {
    console.log('this.route :>> ', this.route);
  }
  resetPassword(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.authServe
      .resetPassword(
        this.resetPasswordForm.value,
        this.route.snapshot.data['auth']['user_id']
      )
      .subscribe(
        (res) => {
          if (res.data.item) {
            this.messageServe.success('Reset password successfully!');
            this.loading = false;
            this.cdr.markForCheck();
            this.router.navigateByUrl('/sign-in');
          } else {
            this.messageServe.danger('Something wrong!');
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
  }
}
