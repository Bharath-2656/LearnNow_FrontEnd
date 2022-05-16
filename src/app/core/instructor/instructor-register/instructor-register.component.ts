import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/shared/services/Course/course.service';
import { InstructorService } from 'src/app/shared/services/Instructor/instructor.service';
import { UserService } from 'src/app/shared/services/User/user.service';

@Component({
  selector: 'app-instructor-register',
  templateUrl: './instructor-register.component.html',
  styleUrls: ['./instructor-register.component.css']
})
export class InstructorRegisterComponent implements OnInit {
  showSuccessMessage!: boolean;
  serverErrorMessages!: string;
  constructor(public instructorService: InstructorService,private router: Router, private toastr: ToastrService, private courseService: CourseService) { }

  ngOnInit(): void {
    this.resetForm(); 
    var s = document.getElementById("age");
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.instructorService.selectedInstructors = {
      instructorid:"",
      name: "",
      age: 18,
      email: "",
      description: "",
      password: "",
    };
    this.serverErrorMessages = '';
  }
  
    onSubmit(form: NgForm) {
        this.instructorService.postInstructor(form.value).subscribe((res) => {
          this.toastr.success('Registered Successfully','Success');  
          setTimeout(() =>{
            this.router.navigate(['/user/login']);
          }, 2500);  
        // this.instructorService.sendConfirmationMail(form.value).subscribe((res) => {
        // });
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong. Please contact admin.';
      }
    );
    }
}
