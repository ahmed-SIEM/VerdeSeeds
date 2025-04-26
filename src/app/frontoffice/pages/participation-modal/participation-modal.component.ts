import { Component, Input } from '@angular/core';
import { ParticipationService } from '../../services/ParticipationService.service';

@Component({
  selector: 'app-participation-modal',
  templateUrl: './participation-modal.component.html',
  styleUrls: ['./participation-modal.component.css']
})
export class ParticipationModalComponent {
  @Input() formation: any;
  @Input() onConfirm!: () => void;
  @Input() onCancel!: () => void;

  constructor(public ParticipationService: ParticipationService) {}
}
