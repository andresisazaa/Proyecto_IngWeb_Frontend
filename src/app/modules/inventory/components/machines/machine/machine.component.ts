import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MachinesService } from 'src/app/core/services/machines.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html'
})
export class MachineComponent implements OnInit {
  machine: any;
  constructor(
    private route: ActivatedRoute,
    private machinesService: MachinesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params.id);
      this.machinesService.getMachineById(id).subscribe((machine) => {
        this.machine = machine;
      });
    });
  }
}