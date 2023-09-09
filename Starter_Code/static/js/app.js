//1.Use the D3 library to read in from the URL 
// Define the URL for the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// Create/initialize a variable to store the fetched data in
let data;

// Define/create a function to initialize the page and to fetch the data.
function init() { 
  d3.json(url).then(function(jsonData){
    console.log(jsonData) ;
    data = jsonData; 

    // Create a dropdown menu and populate it with options
    let dropdownMenu = d3.select("#selDataset");
    let names = data.names;
    
    // Iterate through the names array and append an option for each test subject ID to the dropdown menu
    names.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id);
});

    // Set the default selected value
    //(The variable "id" is being set to the first element in the names array, 
    // which effectively sets the default selected value in your dropdown menu to be the first record when the page loads)
    let id = names[0];

    //Call the functions to make the demographic panel, bar chart, and bubble chart
    demographic(data.metadata, id);
    barchart(data.samples, id);
    bubblechart(data.samples, id);
 }) 
}

// 2.Create a horizontal bar chart 
// Define (create) a function for the barchart to be created and display data selected via the dropdown selected value
function barchart(samples, selectedValue) {
  // Filter data based on the selected value 
  // (filtering data based on a selected value and extracting the first filtered object for further processing)
  let filteredData = samples.filter((sample) => sample.id === selectedValue);
  let obj = filteredData[0];

  //  Define trace data for the horizontal bar chart (see Thurs night zoom session)
  let trace = [{
    // Slice the top 10 and reverse for descending order (Tues night zoom)
    x: obj.sample_values.slice(0,10).reverse(),
    y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
    text: obj.otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
    }];

   // Use Plotly to create the bar chart
    Plotly.newPlot("bar", trace);
}

//3. Create a bubble chart that displays each sample.
//create a function for the bubblechart to be created and display data selected via the dropdown selected value
function bubblechart(samples,selectedValue) {
  // Filter data based on the selected value
  // (filtering data based on a selected value and extracting the first filtered object for further processing)
  let filteredData = samples.filter((sample) => sample.id === selectedValue);
  let obj = filteredData[0];
  
  // Define trace data for the bubble chart
  let trace = [
    {
    x: obj.otu_ids,
    y: obj.sample_values,
    text: obj.otu_labels,
    mode: "markers",
    marker: {
      size: obj.sample_values,
      color: obj.otu_ids,
      colorscale: "Sunset",
    },
  },
];
  
  // Apply the x-axis legend to the layout
  let layout = {
    xaxis: { title: "OTU ID" },
  };

  // Use Plotly to create the bubble chart
  Plotly.newPlot("bubble", trace, layout);
}
  

//4. Display the sample metadata, i.e., an individual's demographic information.
// Define (create) a function for displaying demographic information
function demographic(metadata, selectedValue) {  
  // Filter metadata based on the selected value
  let filteredData = metadata.filter((meta) => meta.id == selectedValue);
  let obj = filteredData[0];

  // Clear existing content in the sample-metadata div
  d3.select("#sample-metadata").html("");

  // Append each key-value pair as an h5 element to display the information
  Object.entries(obj).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
}

// Update plots when option changed in the dropdown selector
function optionChanged(selectedValue) {
  demographic(data.metadata,selectedValue);
  barchart(data.samples,selectedValue);
  bubblechart(data.samples,selectedValue);
}

// Call the init function to initialize the page
// (setting up the initial state and behavior of your web page when it first loads (or reloads when refreshed))
init();
