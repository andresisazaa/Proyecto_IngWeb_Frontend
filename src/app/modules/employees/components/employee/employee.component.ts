import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Job } from 'src/app/shared/models/job.model';
import { PointOfSale } from 'src/app/shared/models/pointOfSale.model';
import { forkJoin, Subscription, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeesService } from 'src/app/core/services/employees.service';
import { PointsOfSaleService } from 'src/app/core/services/points-of-sale.service';
import { JobsService } from 'src/app/core/services/jobs.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  jobs: Job[] = [];
  pointsOfSale: PointOfSale[] = [];
  employee: any;
  id: number;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private fb: FormBuilder,
    private pointsOfSaleService: PointsOfSaleService,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = Number(params.id);
      this.getFormData().subscribe(([employee, jobs, pointsOfSale]) => {
        this.employee = employee;
        this.jobs = jobs;
        this.pointsOfSale = pointsOfSale;
        this.employeeForm = this.createEmployeeForm();
      });
    });
  }

  getFormData() {
    const jobs$ = this.jobsService.getJobs();
    const pos$ = this.pointsOfSaleService.getPointsOfSale();
    const employee$ = this.employeesService.getEmployeeById(this.id);
    return forkJoin([employee$, jobs$, pos$]);
  }

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      name: [
        { value: this.employee.name, disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],
      document: [
        { value: this.employee.document, disabled: true },
        [Validators.required, Validators.maxLength(10)],
      ],
      phone: [this.employee.phone, Validators.maxLength(10)],
      address: [this.employee.address, Validators.maxLength(60)],
      email: [
        { value: this.employee.email, disabled: true },
        [Validators.email, Validators.maxLength(50)],
      ],
      jobId: [this.employee.job.id, Validators.required],
      posId: [this.employee.pointOfSale.id, Validators.required],
    });
  }

  getJobs(): void {
    this.jobsService.getJobs().subscribe((jobs) => {
      this.jobs = jobs;
    });
  }

  getPointsOfSale(): void {
    this.pointsOfSaleService.getPointsOfSale().subscribe((pointsOfSale) => {
      this.pointsOfSale = pointsOfSale;
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }
    const newEmployee = {
      phone: this.employeeForm.value.phone,
      address: this.employeeForm.value.address,
      jobId: Number(this.employeeForm.value.jobId),
      posId: Number(this.employeeForm.value.posId),
    };
    Swal.showLoading();
    this.employeesService.updateEmployee(this.id, newEmployee).subscribe(
      (employee) => {
        Swal.hideLoading();
        Swal.fire({
          icon: 'info',
          text: `${employee['message']}`,
        });
      },
      (error) => {
        Swal.hideLoading();
        Swal.fire({
          icon: 'error',
          title: '¡Ocurrió un error!',
          text: `${error.message}`,
        });
      }
    );
  }
}
