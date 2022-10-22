import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Alumno_i } from 'src/app/models/alumnos.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() in_students!: Alumno_i[];
  @Input() in_admin?: boolean;

  @Output() out_students: EventEmitter<any> = new EventEmitter<any>();

  listStudents!: Alumno_i[];
  isAdmin?: boolean;

  constructor() {}

  ngOnInit(): void {
    this.listStudents = this.in_students;
    this.isAdmin = this.in_admin;
  }

  sendList($event: Alumno_i[]): void {
    this.out_students.emit($event);
  }

}
