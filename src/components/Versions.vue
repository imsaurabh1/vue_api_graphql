<template>
    <div class="container">
      <h4> Data Visualization - Multi Line Chart</h4>
      <Bar v-if="loaded" :data="chartData" />
      <div style="width: 1000px;"><canvas id="versions"></canvas></div>
      <br>
      <h4> Data Visualization - Line Chart</h4>
      <div style="width: 1000px;"><canvas id="versionsLineChart"></canvas></div>
      <br>
      <hr>
      <br>
      <h4> Data - Tabular Format - Last 50 Records sorted by Creation Date</h4>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
            <th scope="col">Name</th>
            <th scope="col">dockerTag</th>
            <th scope="col">changelog</th>
            <th scope="col">retired</th>
            <th scope="col">maturity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in chartData" v-bind:key="value.id"> 
            <th scope="row">{{value.id}}</th>
            <td>{{value.created_at}}</td>
            <td>{{value.updated_at}}</td>
            <td>{{value.name}}</td>
            <td>{{value.dockerTag}}</td>
            <td>{{value.changeLog}}</td>
            <td>{{value.retired}}</td>
            <td>{{value.channel.maturity}}</td>
  
          </tr>
        </tbody>
      </table>     
    </div> 
  </template>
  
  <script>
  import Chart from 'chart.js/auto'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
      name: 'Versions',
      data() {
        return {
          chartData: [],
        };
    },
  
    async mounted(){
      console.log('Component Mounted');
      this.getData() 
    
    }      
  ,
    methods :{
      async getData() {
      //fetch query using POST to get last 50 records sorted by 'created_at'  
      const res = await fetch('api/graphql', {
      method: 'POST',
      headers: {
        "Access-Control-Allow-Origin": "*",           //to avoid CORS error
        'Content-Type': 'application/json',
        "identifier": process.env.VUE_AUTH_USERNAME,  //Authentication identifier
        "password":  process.env.VUE_AUTH_PASSWORD    //Authentication password
      },
      body: JSON.stringify({
        query: `
              query getVersions {
              versions(
                limit: 50
                sort: "created_at:desc"
              )
              {
                  id
                  created_at
                  updated_at
                  name
                  dockerTag
                  changelog
                  retired
                  channel{
                      maturity
                  }
              }
          }
          `
      }),
  })
  
  const finalRes = await res.json();
  console.log(finalRes)
  
  //storing all versions to chartData for HTML table usage
  this.chartData = finalRes.data.versions;
  
  //Chart element for multi line graph
  new Chart(
      document.getElementById('versions'),
      {
        type: 'line',
        data: {
          labels: finalRes.data.versions.map(row => row.created_at),
          datasets: [
            {
              label: 'Alpha', // Line 1 of the graph - Alpha
              data: finalRes.data.versions.map(row => {if(row.channel['maturity'] === 'alpha') return 'alpha'}) ,
              borderColor:'#00a950',
              
            },
            {
              label: 'Beta', // Line 2 of the graph - Beta
              data: finalRes.data.versions.map(row => {if(row.channel['maturity'] === 'beta') return 'beta'}),
              borderColor:'#f53794',
             
            },
            {
              label: 'Stable', // Line 3 of the graph - Stable
              data: finalRes.data.versions.map(row => {if(row.channel['maturity'] === 'stable') return 'stable'}),
              borderColor:'#4dc9f6',
             
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Multi Line Chart  [X - Created At | Y - Maturity]'
            }
          },
          scales: {
            y: {
              type: 'category',
              labels: ['alpha', 'beta', 'stable'],
              display: true,
              position: 'left',
            },
            y1: {
              type: 'category',
              labels: ['alpha', 'beta', 'stable'],
              display: true,
              position: 'right',
              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            }
        }
      },    
    }
    );
  
    //Chart element for Single Line Graph
    new Chart(
      document.getElementById('versionsLineChart'),
      {
        type: 'line',
        data: {
          labels: finalRes.data.versions.map(row => row.created_at),
          datasets: [
            {
              label: 'Maturity',
              data: finalRes.data.versions.map(row => row.channel.maturity) ,
              borderColor:'#00a950',
              
            },          
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Line Chart  [X - Created At | Y - Maturity]'
            }
          },
          scales: {
            y: {
              type: 'category',
              labels: ['alpha', 'beta', 'stable'],
              display: true,
              position: 'left',
            },
            y1: {
              type: 'category',
              labels: ['alpha', 'beta', 'stable'],
              display: true,
              position: 'right',
              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            }
        }
      },    
    }
    )  
    
    
      }
    }
    
  }
  </script>
  
  <style>
    h3 {
      margin-bottom: 5%;
    }
  </style>