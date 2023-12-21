import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutService } from 'src/app/services/apis/checkout.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { ModalCateringMenuComponent } from '../cateringmenu/cateringmenu.component';

@Component({
  selector: 'uo-modal-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.scss'],
})
export class ModalCateringComponent implements OnInit {
  modalType!: number;
  addressId!: number;
  menu:any;
  merchantId!: number;
  coupon!: string;
  loading: boolean = false;
  cateringForm:FormGroup;
  receiveoption:string = "delivery";
  staff:string = "yes";
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private checkout:CheckoutService,
    private messageServe:MessageService,
    private modalService: NgbModal
  ) {
    this.cateringForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      date: [''],
      time: [''],
      guest: [''],
      receiveoptions: ['',[Validators.required]],
      staff: ['',[Validators.required]],
      interest:[''],
      service:[[]]
    });
  }

  ngOnInit(): void {}
  errFunc(err: any): void {
    this.loading = false;
    this.cdr.detectChanges();
    this.activeModal.close(false);
  }
  onchangeReceiveOption(e:any,name:string): void{
    e.preventDefault();
    this.cateringForm.get(name)?.setValue(e.target.value);
  }
  onchangeReceiveOptionMutiple(e:any,name:string): void{
    let temp = this.cateringForm.get(name)?.value
    if(e.target.checked === true){
      temp.push(e.target.value)
    }else{
      temp = temp.filter((v:any) => {
        return v !== e.target.value
      })
    }
    console.log(temp);
    this.cateringForm.get(name)?.setValue(temp);
  }
  checkcheckbox(value:string,name:string): boolean{
    return this.cateringForm.get(name)?.value.includes(value) ? true : false;
  }
  onOpenMenu(): void{
    const modalRef = this.modalService.open(ModalCateringMenuComponent, {
      centered: true,
      scrollable: true,
    });
    // modalRef.componentInstance.menu = this.menu
    modalRef.componentInstance.menuChanged.subscribe((updatedMenu:any) => {
      // Handle the updated menu data in the parent component
      this.menu = updatedMenu;
      let temp = "";
      for(let v of updatedMenu["categories"]){
        for(let k of v["menu_list"]){
          if(k['checked'])
          temp = temp + k['name'] + ', ';
        }
      }
      this.cateringForm.get('interest')?.setValue(temp)
      // You can also update the form or perform any other actions
    });
    modalRef.closed.subscribe((res) => {
      console.log('close catering');

    });
    console.log('open catering');
  }
  onSubmit(): void {
    console.log(this.cateringForm.value);
    // this.loading = true;
    this.cdr.detectChanges();
    this.checkout.placeCatering(this.cateringForm.value).subscribe(
      (res) => {
        this.messageServe.info('Submit');
        console.log('res :>> ', res);
        if (res.data.value) {
          // this.activeModal.close(true);
        } else {
          this.messageServe.danger('Something wrong!');
        }
        this.loading = false;
      },
      (err) => {
        //this.errFunc(err);
      }
    );
  }
}
