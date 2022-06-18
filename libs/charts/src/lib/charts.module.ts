import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalbarchartComponent } from './dashboardcharts/verticalbarchart/verticalbarchart.component';
import { DonutchartComponent } from './dashboardcharts/donutchart/donutchart.component';
import { HorizontalbarchartComponent } from './dashboardcharts/horizontalbarchart/horizontalbarchart.component';
import { LinechartComponent } from './dashboardcharts/linechart/linechart.component';
import { GroupedverticalbarchartComponent } from './dashboardcharts/groupedverticalbarchart/groupedverticalbarchart.component';
import { StackedbarchartComponent } from './dashboardcharts/stackedbarchart/stackedbarchart.component';
import { LinebarchartComponent } from './dashboardcharts/linebarchart/linebarchart.component';
import { PenalisationComponent } from './dashboardcharts/penalisation/penalisation.component';
import { NewdonutchartComponent } from './dashboardcharts/newdonutchart/newdonutchart.component';
import { MultilineComponent } from './dashboardcharts/multiline/multiline.component';
import { WeeklyovertimeComponent } from './dashboardcharts/weeklyovertime/weeklyovertime.component';
import { MultiseriesComponent } from './dashboardcharts/multiseries/multiseries.component';
import { PenalinstanceComponent } from './dashboardcharts/penalinstance/penalinstance.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    VerticalbarchartComponent,
    DonutchartComponent,
    HorizontalbarchartComponent,
    LinechartComponent,
    GroupedverticalbarchartComponent,
    StackedbarchartComponent,
    LinebarchartComponent,
    PenalisationComponent,
    NewdonutchartComponent,
    MultilineComponent,
    WeeklyovertimeComponent,
    MultiseriesComponent,
    PenalinstanceComponent,
  ],
  exports: [
    DonutchartComponent,
    VerticalbarchartComponent,
    HorizontalbarchartComponent,
    LinechartComponent,
    GroupedverticalbarchartComponent,
    StackedbarchartComponent,
    LinebarchartComponent,
    PenalisationComponent,
    NewdonutchartComponent,
    MultilineComponent,
    WeeklyovertimeComponent,
    MultiseriesComponent,
    PenalinstanceComponent
  ],
})
export class ChartsModule {}
