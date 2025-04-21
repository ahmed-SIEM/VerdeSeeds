import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.css']
})
export class CalendarPopupComponent implements OnInit {
  @Input() events: any[] = [];
  @Output() closePopup = new EventEmitter<void>();

  calendarOptions!: CalendarOptions;
  selectedEvent: any = null;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: this.events,
      eventClick: (info) => {
        this.selectedEvent = {
          title: info.event.title,
          start: info.event.startStr,
          end: info.event.endStr,
          id: info.event.id
        };
      }
    };
  }

  close(): void {
    this.closePopup.emit();
  }
}
