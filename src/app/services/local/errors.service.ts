import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/share/components/message/message.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  constructor(private messageServe: MessageService, private router: Router) {}
  errorHandler(err: any): void {
    if (err.error.message) {
      this.messageServe.danger(err.error.message);
    } else {
      this.messageServe.danger('No data found!');
    }
    if (err.error.message == 'Unauthenticated.') {
      this.router.navigateByUrl('sign-in');
    }
  }
}
