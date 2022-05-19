import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/shared/services/Course/course.service';
import { UserService } from 'src/app/shared/services/User/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentHandler: any = null;
 
  success: boolean = false;
  
  failure:boolean = false
  price!: String
  courselink! : String;
  course: any[] =[];
  serverErrorMessages!: string;
  courseid!: Number;
  id!: Number;
  totalamount!: Number;
  constructor(private userService: UserService, private cookieService:CookieService, private router: Router,  private courseService: CourseService, private toastr: ToastrService) { }

  ngOnInit() {
    this.invokeStripe();
    this.price = this.cookieService.get('price');
  this.courselink =  localStorage.getItem('course')!;
 this.id= this.userService.getuserfromPayload();
  this.courseService.getCourse().subscribe((res:any) => {
    this.course=res;
    for (let index = 0; index < res.length; index++) {
      
      
    }
  })

  }
 
  makePayment(amount: number) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51KzDD9SFGZJvDt6T5PYxVdISqGCEgSryilWyYltL8rDeTFauqOWEJyATnmuQbDOIGSwiVZYxqlxFbnXdu3q10bxB00XLWYamq6',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        paymentstripe(stripeToken);
      },
    });
 
    const paymentstripe = (stripeToken: any) => {
      this.userService.payment(stripeToken, Number(this.price)).subscribe((data: any) => {
        console.log(data);
        if (data.data === "success") {
              //this.courseService.courseEnrollCount(this.courselink).subscribe((res) => {
            
          //})
         // this.courseService.sendConfirmationMail(this.courselink);
          this.userService.getUserProfile().subscribe((res:any) => {
              for (let index = 0; index < res.length; index++) {
                if(res[index].userid == this.id)  
                {
                  this.totalamount = res[index].totalamount;
                  console.log(res[index].totalamount);
                  
                }              
              }
          })
         
          
           this.userService.postUserCourse(this.courselink, this.id).subscribe((res) => {
            this.toastr.success('Enrollment successful','Success');
          setTimeout(() => {
            this.router.navigate(['user/dashboard']);
          }, 3000);
          
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
        else {
          this.failure = true
        }
      });
    };
 
    paymentHandler.open({
      name: 'LearnNow!',
      description: "Payment for course enrollmen",
      currency: "inr",
      paymentMethods: ['card'],
      amount: Number(this.price) ,
    });
  }
 
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51KzDD9SFGZJvDt6T5PYxVdISqGCEgSryilWyYltL8rDeTFauqOWEJyATnmuQbDOIGSwiVZYxqlxFbnXdu3q10bxB00XLWYamq6',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };
 
      window.document.body.appendChild(script);
    }
  }
}