import { Component, TemplateRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationPopupComponent {
  @ViewChild('confirmationPopup') confirmationPopup!: TemplateRef<any>;
  modalRef!: BsModalRef;
  @Output() confirmationEvent = new EventEmitter<boolean>();
  public type: string = 'danger';
  public message: string = '';

  constructor ( private modalService: BsModalService ) {

  }

  openModal(type: string, message: string) {
    this.type = type;
    this.message = message
    this.modalRef = this.modalService.show(this.confirmationPopup, { class: 'modal-lg', backdrop: 'static' });
  }

  confirm(): void {
    this.confirmationEvent.emit(true);
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}