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
        this.drawCharts();
      });
  }

  resetSettlementChart(): void {}

  drawCharts(): void {
    this.countryChart = dc.rowChart("#countryChart");
    const countryDim = this.data.dimension(d => {
      return d.Country;
    });
    const countryGroup = countryDim.group();
    this.countryChart
      .dimension(countryDim)
      .group(countryGroup)
      .elasticX(true);

    dc.renderAll();
  }
}
