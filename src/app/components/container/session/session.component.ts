import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Alumno_i } from 'src/app/models/alumnos.model';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  @Input() in_students: Alumno_i[] = [];

  @Output() out_auth: EventEmitter<any> = new EventEmitter<any>();
  @Output() out_admin: EventEmitter<any> = new EventEmitter<any>();

  hide = true;
  session = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {}

  when_error(ref: string, validator: any): boolean {
    return !validator ? this.session.get(ref)?.errors : this.session.get(ref)?.errors?.[validator];
  }

  login(): void {
    const emailFound = this.in_students.find(alumno => alumno.info.email == this.session.value.email);
    if(this.session.value.email == "admin.test@gmail.com" && this.session.value.password == "admin.test") {
      this.out_auth.emit(true);
      this.out_admin.emit(true);
    }
    else if(emailFound && this.session.value.password == "user.test") {
      this.out_auth.emit(true);
      this.out_admin.emit(false);
    }
    this.session.reset();
  }

}
