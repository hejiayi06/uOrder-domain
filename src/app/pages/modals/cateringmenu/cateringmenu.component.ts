import {
  ChangeDetectorRef,
  Component,
  OnInit,
  EventEmitter, Output
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uo-modal-catering',
  templateUrl: './cateringmenu.component.html',
})
export class ModalCateringMenuComponent implements OnInit {
  menu:any = [];
  @Output() menuChanged: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('Catering')) {
      let temp = JSON.parse(localStorage.getItem('Catering') as string);
      for (let v of temp['categories']) {
        for(let k of v['menu_list']){
          k['checked'] = false;
        }
      }
      this.menu = temp
    }
    this.cdr.detectChanges();
  }

  checkcheckbox(name: string): void {
    for (let v of this.menu['categories']) {
      for(let k of v['menu_list']){
        if(name === k['name'])
        k['checked'] = !k['checked'];
      }
    }
  }
  onSubmit(): void {
    console.log(this.menu);
    this.menuChanged.emit(this.menu);
    this.activeModal.close()
    this.cdr.detectChanges();
  }
}
