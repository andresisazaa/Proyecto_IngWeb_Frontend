import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../../../core/services/report.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartComponent } from 'angular-google-charts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  public charts = [
    {
      title: 'Ventas en pesos colombianos (COP) por empleado',
      type: 'PieChart',
      data: [[]],
      roles: [],
    },
    {
      title: 'Compras en pesos colombianos (COP) por empleado',
      type: 'ColumnChart',
      data: [[]],
      roles: [],
    },
  ];

  @ViewChild('chart', {})
  public chart: GoogleChartComponent;

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.reportService.getSalesPointOfSaleStatistic().subscribe((data) => {
      this.charts[0].data = data.map((sale) => {
        return [sale.pointOfSale, sale.total];
      });
    });

    this.reportService.getPurchasesPointOfSaleStatistic().subscribe((data) => {
      this.charts[1].data = data.map((purchase) => {
        return [purchase.pointOfSale, purchase.total];
      });
    });
  }

  downloadFile() {
    this.reportService.getBudgetReport().subscribe(
      (row) => {
        const element = window.document.createElement('a');
        element.href = window.URL.createObjectURL(
          new Blob([row], { type: 'application/vnd.ms-excel' })
        );
        element.download = 'Reporte_financiero.xlsx';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      (err) => console.log(err)
    );
  }
}
