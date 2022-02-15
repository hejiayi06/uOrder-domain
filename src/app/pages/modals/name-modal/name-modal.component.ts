import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uo-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['./name-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameModalComponent implements OnInit {
  nameForm = this.fb.group({
    name: ['', [Validators.required]],
  });
  get name() {
    return this.nameForm.get('name');
  }
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}
  ngOnInit(): void {}
  update(): void {
    this.activeModal.close(this.name!.value);
  }
}
