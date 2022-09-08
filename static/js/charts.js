/*  In this function we're getting a handle on the selection object in the browser page (selDataset) , we're displaying
the data from the json file to the console, and then we're accessing just the names dictionary from the json and looping through it
and loading the selection drop-down object with those values.   We're appending, text, and the property of the text is the value */

//FUNCTION INIT----------------------------------------------------------//

function init() {
  var selector = d3.select("#selDataset");

  d3.json("static/data/samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
  
    //loop through the array and load the drop down box
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
   
   //get the first ID in the drop down box - the one that will automatically display when the page loads
    var firstID = sampleNames[0];    
   //call the optionChanged function when page first displays to force display of demo info and charts for first item in drop-down box
   optionChanged(firstID);
})}

 

//CALL INIT----------------------------------------------------------//
/* we're calling the init function here which will load the dropdown and display the demo info and charts for the initial ID value that displays
in the dropdown*/

init();


//FUNCTION BUILD METADATA-------------------------------------------//

//Here we're populating the demographics panel 
//We're storing the metadata dictionary in the var metadata, we're filtering that data to get only the group of demographic data that matches the ID sent in by the call
//to the function, we're saving that to an array, and then we're looping through that array, and appending those values to the demographic panel.

function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var myArray = Object.entries(result).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
//in the line below, we're using d3 to get a handle on the html panel object with the id sample-metadata
    var PANEL = d3.select("#sample-metadata");

Object.entries(result).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
    PANEL.html("");
    PANEL.append("h6").text("ID:  " + result.id);
    PANEL.append("h6").text("ETHNICITY:  " + result.ethnicity);
    PANEL.append("h6").text("GENDER:  " + result.gender);
    PANEL.append("h6").text("AGE:  " + result.age);
    PANEL.append("h6").text("LOCATION:  " + result.location);
    PANEL.append("h6").text("BLOOD TYPE:  " + result.bbtype);
    PANEL.append("h6").text("FREQUENCY:  " + result.wfreq);

  });
} 

//FUNCTION BUILD CHARTS-------------------------------------------//

   // 1. Create the buildCharts function.  This function will be called at the end of the code and passed a sample ID
function buildCharts(sample_id) {
   // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
   // 3. Create a variable that holds the samples array just like in the metadata function, but this time access the samples dictionary instead of the
   //names dictionary. 
    var sample = data.samples;
   // 4. Create a variable that filters the samples for the object with the desired person ID number.
    var sampleArray = sample.filter(sampleObj => sampleObj.id == sample_id);
    console.log(sampleArray);
   // 5. Create a variable that holds the first sample in the array.
    var result1 = sampleArray[0];
    
   //There are three groups of data (otu_ids, otu_labels and sample values and we need to create variables to store each
   //6. Create variables that hold the otu_ids (y-ticks), otu_labels (hover text), and sample_values (x).

    var id = result1.otu_ids;
    var labels = result1.otu_labels;
    var values= result1.sample_values;


//BAR CHART//

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = id.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
   
    // now get the x values (sample amounts) and the hover text(labels)
    var values_top10 = values.slice(0, 10).reverse();
    var labels_top10 = labels.slice(0, 10).reverse();
    console.log("yticks - sample values");
    console.log(yticks);
    console.log("text values top 10");
    console.log(values_top10);

      // 8. Create the trace for the bar chart
        var bar_data = [{
          
          x: values_top10,
          y: yticks ,
          text: labels_top10,
          type: 'bar',
          orientation: 'h'
      }];  


     // 9. Create the layout for the bar chart. 
      var bar_layout = {
          title: "Top 10 Bacteria Cultures Found"
      };

     // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar', bar_data, bar_layout)
     
//SCATTER(BUBBLE) CHART//
      //1.  Create the trace for the bubble chart.
      var bubbleData = [{
      x : id,
      y : values,
      text : labels,
      mode : 'markers',
      marker : {
      color : id,
      size: values,
      opacity:values
      } 
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: { title: "OTU IDs" },
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

//GAUGE CHART//

   // 1. Create a variable that holds the metadata array. 
     var metadata = data.metadata;
    // 2. Create a variable that filters the metadata for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample_id);
    //  Create a variable that holds the first metadata in the array.
    var result2 = metadataArray[0];  
 

    // 3. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: parseFloat(result2.wfreq),
      title: { text: "Belly Button Washing Frequency (Scrubs per Week)" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: 'lightgray'},
        axis: { range: [null, 9] },
        steps: [
            { range: [0, 2], color: 'greenyellow' },
            { range: [2,4], color: 'lawngreen' },
            { range: [4,6], color: 'lime' },
            { range : [6,8], color: 'limegreen'},
            { range : [8,9], color: 'green'}
        ],
    }}
     
    ];
    
    // 4. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 }
     
    };

    // 5. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
};

//FUNCTION OPTION CHANGED------------------------------------------------------//
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
} 