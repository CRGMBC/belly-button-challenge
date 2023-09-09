//1.Use the D3 library to read in from the URL 
//link to URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  //create a variable to store the data in
//(advice from TA's)
let data;

// Initialize the page with the fetched data
function init() {

   
    d3.json(url).then(function(jsonData){
       console.log(jsonData) ;
        data = jsonData; 

        let dropdownMenu = d3.select("#selDataset");
        //console.log(data);
        //create all the arrays (dictionarys to use in the charts)
            let names = data.names;
    
        //iterate through the names array and append an option for each test subject ID to the dropdown menu
        names.forEach((id) => {
            dropdownMenu.append("option").text(id).property("value", id);
        });

// Assign the first name to name variable 
    //(resetting the data to be used in your visualizations whenever the dropdown menu selection changes)
    let id = names[0];

    // Call the functions to make the demographic panel, bar chart, and bubble chart
    demographic(data.metadata, id);
    barchart(data.samples, id);
    bubblechart(data.samples, id);

    })
   
}

// 2.Create a horizontal bar chart 
function barchart(samples, selectedValue) {
   
    // Filter data where id = selected value 
    let filteredData = samples.filter((sample) => sample.id === selectedValue);

    // Assign the first object (dictionary) to the obj variable 
    let obj = filteredData[0];

    //  Trace for the data for the horizontal bar chart (see Thurs night zoom session)
    let trace = [{
        // Slice the top 10 and reverse for descending order (Tues night zoom)
        x: obj.sample_values.slice(0,10).reverse(),
        y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
        text: obj.otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
        }];

        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace);
}

//3.    Create a bubble chart that displays each sample.
// Make the bubble chart
function bubblechart(samples,selectedValue) {
    // Retrieve all sample data
    //let samples = data.samples;
  
    // Filter based on the value of the sample
    let filteredData = samples.filter((sample) => sample.id === selectedValue);
  
    // Assign the first object (dictionary) to the obj variable
    let obj = filteredData[0];
  
    // Trace for the data for the bubble chart
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

// Call Plotly to plot the data in a bubble chart
Plotly.newPlot("bubble", trace, layout);
}
  

//4.    Display the sample metadata, i.e., an individual's demographic information.
// Filter data where id = selected value 
function demographic(metadata, selectedValue) {
    //let metadata = data.metadata;

    // Filter data where id = selected value 
    let filteredData = metadata.filter((meta) => meta.id == selectedValue);

    // Assign the first object (dictionary) to the obj variable 
    let obj = filteredData[0];

    // Clear the children in div with id sample-metadata
    d3.select("#sample-metadata").html("");

    // Append each key-value pair to the demographics panel
    // This is adding each pair as an h5 child element to the div with id sample-metadata
    Object.entries(obj).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
}

// Update plots when option changed
function optionChanged(selectedValue) {
   // console.log(data);
  demographic(data.metadata,selectedValue);
  barchart(data.samples,selectedValue);
  bubblechart(data.samples,selectedValue);
}

// Call the init function to initialize the page
init();


