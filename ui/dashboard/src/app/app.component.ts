import { Component, OnInit } from "@angular/core";
import * as dc from "dc";
import { HttpClient } from "@angular/common/http";
import * as crossfilter from "crossfilter";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  countryChart: dc.RowChart;
  customerChart: dc.RowChart;
  data;
  all;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .post("http://localhost:8888/druid/v2/sql", {
        query: "SELECT * FROM archive"
      })
      .subscribe((result: any) => {
        this.data = crossfilter(result);
        this.all = this.data.groupAll();
        this.drawCountryChart();
        this.drawCustomerChart();
        this.render();
      });
  }

  resetCountryChart(): void {
    this.countryChart.filterAll();
    dc.redrawAll();
  }

  drawCountryChart(): void {
    this.countryChart = dc.rowChart("#countryChart");
    const countryDim = this.data.dimension(d => {
      return d.Country;
    });
    const countryGroup = countryDim.group();
    this.countryChart
      .cap(10)
      .width(500)
      .height(300)
      .dimension(countryDim)
      .group(countryGroup)
      .elasticX(true);
  }

  resetCustomerChart(): void {
    this.customerChart.filterAll();
    dc.redrawAll();
  }

  drawCustomerChart(): void {
    this.customerChart = dc.rowChart("#customerChart");
    const customerDim = this.data.dimension(d => {
      return d.sum_CustomerID;
    });
    const customerGroup = customerDim.group();
    this.customerChart
      .cap(10)
      .width(500)
      .height(300)
      .dimension(customerDim)
      .group(customerGroup)
      .elasticX(true);
  }

  render(): void {
    dc.renderAll();
  }
}
