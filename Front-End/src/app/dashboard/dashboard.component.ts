import { Component } from "@angular/core";

import { AgChartOptions, PixelSize } from "ag-charts-community";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent {

  public chartOptions: AgChartOptions;
  // private chartTheme = {}

  constructor () {
    this.chartOptions = {
      theme: 'ag-polychroma',
      // Data: Data to be displayed in the chart
      height: 200 as PixelSize,
      padding: { right: 0 as PixelSize, left: 0 as PixelSize },
      data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
      ],
      // Series: Defines which chart type and data to use
      series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }]
    };
  }
}