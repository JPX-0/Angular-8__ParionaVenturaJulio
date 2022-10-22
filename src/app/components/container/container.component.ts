import { Component, OnInit } from '@angular/core';
import { Alumno_i } from 'src/app/models/alumnos.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  listStudents: Alumno_i[] = [];
  isAuthenticated?: boolean;
  isAdmin?: boolean;

  constructor() { }

  ngOnInit(): void {}

  updateList($event: Alumno_i[]): void {
    this.listStudents = $event;
  }

  save_auth($event: boolean): void {
    this.isAuthenticated = $event;
  }
  save_admin($event: boolean): void {
    this.isAdmin = $event;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.isAdmin = undefined;
  }

}
