import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Alumno_i } from 'src/app/models/alumnos.model';

@Component({
  selector: 'app-abm',
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.css']
})
export class AbmComponent implements OnInit {

  @Input() in_students!: Alumno_i[];
  @Input() in_admin?: boolean;

  @Output() out_students: EventEmitter<any> = new EventEmitter<any>();

  isAdmin?: boolean;

  // Variables para manejar el formulario
  dataStudents = this.formBuilder.group({
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    age: ["", [Validators.required, Validators.min(18)]],
    email: ["", [Validators.required, Validators.email]],
    image: ["", []],
    commission: ["", [Validators.required]],
    status: ["", [Validators.required]],
    courses: new FormArray([new FormControl()])
  });
  openForm: any = { register: false, edit: false };
  saveIdToEdit?: number;

  // Variables para manejar la tabla
  ELEMENT_DATA: any = new MatTableDataSource([]);
  displayedColumns: string[] = ["N°", 'Estudiante', 'Correo', 'Edad', "Configuración"];

  constructor(
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.ELEMENT_DATA.data = this.in_students;
    this.isAdmin = this.in_admin; 
    if(!this.isAdmin) this.displayedColumns = ["N°", 'Estudiante', 'Correo', 'Edad']
  }

  // Funciones genéricas
  generateStudentDTO = (position?: number): Alumno_i => {
    const thisDTO: any = {
      info: {
        firstName: this.dataStudents.value.firstName!,
        lastName: this.dataStudents.value.lastName!,
        age: +this.dataStudents.value.age!,
        email: this.dataStudents.value.email!,
        image: this.dataStudents.value.image!
      },
      data: {
        commission: +this.dataStudents.value.commission!,
        courses: this.dataStudents.value.courses!,
        status: this.dataStudents.value.status!
      }
    }
    if(position) thisDTO.id = this.in_students[position].id;
    else thisDTO.id = this.newId(this.in_students);
    return thisDTO;
  }
  newId(allIDs: Alumno_i[]): number { // Busca el ID maximo existente en el array y le agrega +1.
    const findId = allIDs.map((item: any) => item.id);
    let newId;
    if(findId.length == 0) newId = 1;
    else newId = Math.max.apply(null, findId) + 1;
    return newId;
  }

  // Funciones para identificar el estado actual del formulario
  formIsOpen(): boolean {
    return this.openForm.register || this.openForm.edit;
  }
  toggleForm(typeForm: string, id?: number): void {
    if(typeForm.toLowerCase() == "register" && !this.openForm.edit) this.openForm.register = !this.openForm.register;
    if(typeForm.toLowerCase() == "edit" && !this.openForm.register) {
      this.openForm.edit = !this.openForm.edit;
      if(this.openForm.edit) this.saveIdToEdit = id;
      else this.saveIdToEdit = undefined;
    }
    if(this.saveIdToEdit) {
      const foundIndex: number = this.in_students.findIndex((student: any) => student.id == this.saveIdToEdit);
      this.dataStudents.setValue({
        firstName: this.in_students[foundIndex].info.firstName,
        lastName: this.in_students[foundIndex].info.lastName,
        age: (this.in_students[foundIndex].info.age).toString(),
        email: this.in_students[foundIndex].info.email,
        image: this.in_students[foundIndex].info.image,
        commission: (this.in_students[foundIndex].data.commission).toString(),
        status: this.in_students[foundIndex].data.status,
        courses: this.in_students[foundIndex].data.courses
      })
    } else this.dataStudents.setValue({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        image: "",
        commission: "",
        status: "",
        courses: [""]
    })
  }
  editing(id: number): boolean {
    if(this.saveIdToEdit) {
      if(id == this.saveIdToEdit) return false;
      return true;
    }
    return false;
  }

  // Funciones para manejar el ABM
  createUser(): void {
    this.in_students.push(this.generateStudentDTO());
    this.ELEMENT_DATA.data = this.in_students;
    this.dataStudents.reset();
    this.openForm.register = false;
    this.out_students.emit(this.in_students);
  }
  editUser(): void {
    if(this.saveIdToEdit) {
      const foundIndex: number = this.in_students.findIndex((student: any) => student.id == this.saveIdToEdit);
      if(foundIndex >= 0) this.in_students[foundIndex] = this.generateStudentDTO(foundIndex);
      this.ELEMENT_DATA.data = this.in_students;
    }
    this.dataStudents.reset();
    this.openForm.edit = false;
    this.saveIdToEdit = undefined;
    this.out_students.emit(this.in_students);
  }
  deleteUser(id: number): void {
    const foundIndex: number = this.in_students.findIndex((student: any) => student.id == id);
    if(foundIndex >= 0) this.in_students.splice(foundIndex, 1);
    this.ELEMENT_DATA.data = this.in_students;
    this.out_students.emit(this.in_students);
  }

  // Función para renderizar texto dinámico
  typeData(): string {
    return this.openForm.register ? "Regitrar":  this.openForm.edit && "Editar";
  }

  // Funciones para manejar los errores en las entradas
  when_error(ref: string, validator: any): boolean {
    return !validator ? this.dataStudents.get(ref)?.errors : this.dataStudents.get(ref)?.errors?.[validator];
  }
  when_touched(ref: string): boolean {
    return this.dataStudents.get(ref)?.touched!;
  }

  // Funciones para manejar los cursos
  get this_courses(): FormArray {
    return this.dataStudents.get("courses") as FormArray;
  }
  addCourse(): void {
    this.this_courses.push(new FormControl());
  }
  removeCourse(): void {
    this.this_courses.removeAt([this.this_courses].length);
  }

}