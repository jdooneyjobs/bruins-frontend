import { Component, OnInit } from '@angular/core';
import { PlayersApiService } from '../players-service/players-api.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent implements OnInit {

  player: any;
  playersData: any;
  playerStatsByYear: any;
  comparedPlayerStatsByYear: any;
  dataChart: any;
  dataCanvas: any;
  chosenStat:number[]=[];
  comparedChosenStat:number[]=[];
  statYears:string[]=[];
  statYears2:string[]=[];
  statList: any;
  statSelection:string = '';

  teams: any;

  selectedTeam: any;

  compareGate:boolean =  false;
  compareClicked:boolean =  false;

  //Selected player Stats
  playerStats: any;
  name: string='';
  season: string='';
  position: string = '';
  age: any;
  number: any;
  height: any;
  weight: any;
  city: any;

  assists: any;
  blockedShots: any;
  games:any;
  goals:any;
  hits:any;
  totalTimeOnIce:any;
  avgTimeOnIcePerGame:any;
  plusMinus:any;
  points:any;
  penaltyMinutes:any;
  powerPlayGoals:any;
  powerPlayPoints:any;
  shortHandedGoals: any;
  shortHandedPoints: any;
  gameWinningGoals:any;
  overTimeGoals: any;
  shotPct:any;
  shots:any;
  faceOffPct:any;
  timeOnIce:any; 
  timeOnIcePerGame:any;
  powerPlayTimeOnIce:any;
  powerPlayTimeOnIcePerGame:any;
  shortHandedTimeOnIce:any;
  shortHandedTimeOnIcePerGame:any;

  //Second (compared) player bio
  name2:any;
  position2:any;
  age2:any;
  height2:any;
  weight2:any;
  city2:any;
  number2:any;



  constructor(private playersApi: PlayersApiService) { }

  ngOnInit(): void {
    this.dataCanvas=document.getElementById('canvas');
    Chart.register(...registerables);
    this.playersApi.getPlayersByTeam(6).subscribe(res =>{
      this.playersData = res;
    },
    (err) => console.error(err),  
    ()=>{
      this.playersData = this.playersData.data;
      this.initializeChart();
      this.updateStats(this.playersData[0].id);
      // this.initializeChart();
      
    });

    this.playersApi.getTeams().subscribe(res =>{
      this.teams = res;
    },
    (err)=>console.error(err),
    ()=>{
      this.selectedTeam=this.teams[5].id;
    });    
   
  }

  //Updates players in horizontal table view when team is changed
  updatePlayers(teamId: number):void{
    console.log(teamId);
    this.playersApi.getPlayersByTeam(teamId).subscribe(res =>{
      this.playersData = res;
    },
    (err) => console.error(err),
    ()=>{
      this.playersData = this.playersData.data;
      this.updateStats(this.playersData[0].id);
    });
    this.clearStatView();
    this.season='';
  }

  //Updates data in lower stat view when "Show All Stats" button is pressed
  updateStats(playerId: number):void{
    console.log(playerId);
    this.playersApi.getPlayer(playerId).subscribe(res =>{
      this.player = res;
    },
    (err) => console.error(err),
    ()=>{
      //Collect basic player bio data for lower display
      this.name = this.player.fullName;
      this.position = this.player.primaryPosition.name;
      this.age = this.player.currentAge;
      this.height = this.player.height;
      this.weight = this.player.weight;
      this.city = this.player.birthCity;
      this.number= this.player.primaryNumber;
      this.number = this.number;
      this.number = '#' +this.number;
    });

    this.playersApi.getPlayerStats(playerId).subscribe(res =>{
      this.playerStats=res;
      this.playerStats= this.playerStats[0].splits[0];


    },
    (err) => console.error(err),
    () =>{
      try {

        //Collect player stats for lower display
        this.season = this.playerStats.season;
        this.season = this.season.slice(0,4) + '-' + this.season.slice(4);
        this.playerStats=this.playerStats.stat;
        this.games=this.playerStats.games;

        this.goals=this.playerStats.goals;
        this.assists=this.playerStats.assists;
        this.blockedShots=this.playerStats.blocked;
        this.hits=this.playerStats.hits;
        this.totalTimeOnIce=this.playerStats.timeOnIce;
        this.avgTimeOnIcePerGame=this.playerStats.timeOnIcePerGame;
        this.plusMinus=this.playerStats.plusMinus;
        this.points=this.playerStats.points;
        this.penaltyMinutes =this.playerStats.penaltyMinutes ;
        this.powerPlayGoals =this.playerStats.powerPlayGoals ;
        this.powerPlayPoints =this.playerStats.powerPlayPoints ;
        this.shortHandedGoals =this.playerStats.shortHandedGoals ;
        this.shortHandedPoints =this.playerStats.shortHandedPoints ;
        this.gameWinningGoals =this.playerStats.gameWinningGoals ;
        this.shotPct =this.playerStats.shotPct ;
        this.shots =this.playerStats.shots ;
        this.faceOffPct =this.playerStats.faceOffPct ;
        this.powerPlayTimeOnIce=this.playerStats.powerPlayTimeOnIce;
        this.powerPlayTimeOnIcePerGame=this.playerStats.powerPlayTimeOnIcePerGame;
        this.shortHandedTimeOnIce=this.playerStats.shortHandedTimeOnIce;
        this.shortHandedTimeOnIcePerGame=this.playerStats.shortHandedTimeOnIcePerGame;
        this.overTimeGoals=this.playerStats.overTimeGoals;

      } catch (error) {
        this.season = "No Data for 2021";
        this.clearStats();
      }

      this.playersApi.getPlayerStatsByYear(playerId).subscribe(res=>{
        this.playerStatsByYear = res;
      },
      (err)=> console.error(err),
      ()=>{
        this.playerStatsByYear = this.playerStatsByYear[0].splits
        this.statList = Object.keys(this.playerStatsByYear[0].stat);
        this.statSelection=this.statList[0];
        this.updateChart();
        this.compareGate = true;
        this.compareClicked = false;
      });
    }
    );
  }

  //Runs when + Compare Player button is pressed, collects data for new player and calls updateChart()
  comparePlayer(playerId: number): void{
    document.getElementById("comparedPlayerBio")!.style.visibility = 'visible';
    console.log(playerId);
    this.playersApi.getPlayer(playerId).subscribe(res =>{
      this.player = res;
    },
    (err) => console.error(err),
    ()=>{
      //Collect basic player bio data for lower display
      this.name2 = this.player.fullName;
      this.position2 = this.player.primaryPosition.name;
      this.age2 = this.player.currentAge;
      this.height2 = this.player.height;
      this.weight2 = this.player.weight;
      this.city2 = this.player.birthCity;
      this.number2= this.player.primaryNumber;
      this.number2 = this.number2;
      this.number2 = '#' +this.number2;

      this.playersApi.getPlayerStatsByYear(playerId).subscribe(res=>{
        this.comparedPlayerStatsByYear = res;
      },
      (err)=> console.error(err),
      ()=>{
        this.comparedPlayerStatsByYear = this.comparedPlayerStatsByYear[0].splits
        this.compareClicked = true;
        this.updateChart();
      });
    });
  }

  //Clears everything in the lower data view
  clearStatView():void{
    this.compareGate = false;
    this.compareClicked = false;
    this.statList=[];
    this.clearSelection();
    this.clearStats();
    this.clearChart();
  }

   //Clears all data in stat table
  clearStats():void{
    this.games=null;
    this.goals=null;
    this.assists=null;
    this.blockedShots=null;
    this.hits=null;
    this.totalTimeOnIce=null;
    this.avgTimeOnIcePerGame=null;
    this.plusMinus=null;
    this.points=null;
    this.penaltyMinutes =null;
    this.powerPlayGoals =null;
    this.powerPlayPoints =null;
    this.shortHandedGoals =null;
    this.shortHandedPoints =null;
    this.gameWinningGoals =null;
    this.shotPct =null;
    this.shots =null;
    this.faceOffPct =null;
    this.powerPlayTimeOnIce=null;
    this.powerPlayTimeOnIcePerGame=null;
    this.shortHandedTimeOnIce=null;
    this.shortHandedTimeOnIcePerGame=null;
    this.overTimeGoals=null;
  }

  //Clear selected player(s) data
  clearSelection():void{
    this.number=null;
    this.name='';
    this.position='';
    this.height='';
    this.weight='';
    this.age=null;
    this.city='';

    this.number2=null;
    this.name2='';
    this.position2='';
    this.height2='';
    this.weight2='';
    this.age2=null;
    this.city2='';

    document.getElementById("comparedPlayerBio")!.style.visibility = 'hidden';
  }

  //Clears everything in the chart
  clearChart():void{
    this.dataChart.data.datasets[0].label="Select a Player";
    this.chosenStat = [];
    this.dataChart.data.datasets[0].data=this.chosenStat;
    this.dataChart.data.datasets[1].label="Select a Player";
    this.comparedChosenStat = [];
    this.dataChart.data.datasets[1].data=this.comparedChosenStat;
    this.dataChart.data.labels=null;
    this.dataChart.update();
  }

  //Updates chart data for one or both players
  updateChart():void{
    this.chosenStat=[];
    this.comparedChosenStat=[];
    this.statYears=[];
    this.statYears2=[];
    var tempYear='';
    var tempIndex=-1;
    for(var i=0;i<this.playerStatsByYear.length;i++){

      if(this.playerStatsByYear[i].stat[this.statSelection] == NaN){
        this.chosenStat.push(0);
      }
      else{
        if(this.statSelection=='penaltyMinutes'){
          if(tempYear==this.playerStatsByYear[i].season){
            this.chosenStat[tempIndex]= this.chosenStat[tempIndex]+parseInt(this.playerStatsByYear[i].stat[this.statSelection]);
          }
          else{
            this.statYears.push(this.playerStatsByYear[i].season.slice(0,4) + '-' + this.playerStatsByYear[i].season.slice(4));
            this.chosenStat.push(parseInt(this.playerStatsByYear[i].stat[this.statSelection]))
            tempIndex++;
            tempYear=this.playerStatsByYear[i].season;
          }
        }
        else{
          if(tempYear==this.playerStatsByYear[i].season){
            this.chosenStat[tempIndex]= this.chosenStat[tempIndex]+this.playerStatsByYear[i].stat[this.statSelection];
          }
          else{
            this.statYears.push(this.playerStatsByYear[i].season.slice(0,4) + '-' + this.playerStatsByYear[i].season.slice(4));
            this.chosenStat.push(this.playerStatsByYear[i].stat[this.statSelection])
            tempIndex++;
            tempYear=this.playerStatsByYear[i].season;
          }
        }
      }

    }

    if(this.compareGate ==true && this.compareClicked==true){
      tempYear='';
      tempIndex=-1;
      for(var i=0;i<this.comparedPlayerStatsByYear.length;i++){
        if(this.comparedPlayerStatsByYear[i].stat[this.statSelection] == NaN){
          this.comparedChosenStat.push(0);
        }
        else{
          if(this.statSelection=='penaltyMinutes'){
            if(tempYear==this.comparedPlayerStatsByYear[i].season){
              this.comparedChosenStat[tempIndex]= this.comparedChosenStat[tempIndex]+parseInt(this.comparedPlayerStatsByYear[i].stat[this.statSelection]);
            }
            else{
              this.statYears2.push(this.comparedPlayerStatsByYear[i].season.slice(0,4) + '-' + this.comparedPlayerStatsByYear[i].season.slice(4));
              this.comparedChosenStat.push(parseInt(this.comparedPlayerStatsByYear[i].stat[this.statSelection]))
              tempIndex++;
              tempYear=this.comparedPlayerStatsByYear[i].season;
            }
          }
          else{
            if(tempYear==this.comparedPlayerStatsByYear[i].season){
              this.comparedChosenStat[tempIndex]= this.comparedChosenStat[tempIndex]+this.comparedPlayerStatsByYear[i].stat[this.statSelection];
            }
            else{
              this.statYears2.push(this.comparedPlayerStatsByYear[i].season.slice(0,4) + '-' + this.comparedPlayerStatsByYear[i].season.slice(4));
              this.comparedChosenStat.push(this.comparedPlayerStatsByYear[i].stat[this.statSelection])
              tempIndex++;
              tempYear=this.comparedPlayerStatsByYear[i].season;
            }
          }
        }
  
      }
      this.dataChart.data.datasets[1].label= this.name2 + " " +this.statSelection.charAt(0).toUpperCase() + this.statSelection.slice(1);

      var sortedComparedChosenStat = [];
      for(var i=0; i<this.statYears.length;i++){
        for(var j=0;j<this.statYears2.length;j++){
          if(this.statYears[i]==this.statYears2[j]){
            sortedComparedChosenStat.push(this.comparedChosenStat[j]);
            break;
          } 
        }
      }


      this.dataChart.data.datasets[1].data=sortedComparedChosenStat;
    }

    this.dataChart.data.datasets[0].label= this.name + " " +this.statSelection.charAt(0).toUpperCase() + this.statSelection.slice(1);
    this.dataChart.data.datasets[0].data=this.chosenStat;
    this.dataChart.data.labels=this.statYears;
    this.dataChart.update();
  }

  //Initializes data chart
  initializeChart(): void{
    
    this.dataChart = new Chart(this.dataCanvas, {
      type: 'bar',
      data: {
          labels: this.statYears,
          datasets: [{
              label: this.statSelection,
              data: this.chosenStat,
              backgroundColor: [
                  'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                  'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
          },
          {
            label: this.statSelection,
            data: this.comparedChosenStat,
            backgroundColor: [
                'rgba(224, 102, 102)'
            ],
            borderColor: [
                'rgba(228, 48, 48)'
            ],
            borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

}
