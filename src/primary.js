// Fetching data from the provided API endpoint
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .then(res => res.json())
  .then(res => {
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
      .then(res2 => res2.json())
      .then(res2 => {
        // Calling the dataSet function with the fetched data as parameters
        return dataSet(res, res2)
      })
  })

// Function that creates the map and legend
dataSet = (US, edu) => {

  // Setting initial values for padding and scale based on screen size
  let Ppadding = 0
  let checker = 0
  let scaleChecker = 1
  let paddingMD = 60

  if (document.getElementById("master").clientWidth < 800) {
    Ppadding = 60;
    checker = 1;
    paddingMD = 0;
    scaleChecker = 0;
  }

  // Setting the height and width of the SVG container based on screen size
  let h = document.getElementById("master").clientHeight + 400 * scaleChecker + 400 * checker;
  let w = document.getElementById("master").clientWidth;
  let legendInBetween = 22

  // Setting the color scale for the map
  let colors = ["#4A1486", "#66269A", "#8239AC", "#9D51BD", "#B66CCC", "#CD87D9", "#E0A2E5", "#EEBDED"]

  // Appending an SVG element to the HTML with the specified height and width
  let svg = d3
    .select("#master")
    .append("svg")
    .attr("id", "svg")
    .attr("height", h)
    .attr("width", w + paddingMD)

  // Selecting the counties data from the US object
  let counties = US.objects.counties

  // Adding a tooltip element to the HTML to display information on hover
  let tooltip = d3.select("#master").append("div").attr("id", "tooltip").style("width", w / 9 + "px").style("display", "none")

  // Creating the map by appending a path element for each county with data attributes for tooltips and color
  let map = svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(US, counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", (d, i) => edu[i].fips)
    .attr("data-education", (d, i) => edu[i].bachelorsOrHigher)
    .attr("d", d3.geoPath())
    .attr("fill", (d, i) => {
      let result = edu.filter(obj => obj.fips == d.id)
      let education = result[0].bachelorsOrHigher
      if (education > 70) {
        return colors[0]
      } else if (education > 60) {
        return colors[1]
      } else if (education > 50) {
        return colors[2]
      } else if (education > 40) {
        return colors[3]
      } else if (education > 30) {
        return colors[4]
      } else if (education > 20) {
        return colors[5]
      } else if (education > 10) {
        return colors[6]
      } else if (education > 0) {
        return colors[7]
      }
    })
    .on("mouseover", (d, i) => {
      let result = edu.filter(obj => obj.fips == i.id)
      tooltip
        .style("display", "inline")
        .style("top", (d.pageY - h / 9) * scaleChecker + (d.pageY - h / 4.5) * checker + "px")
        .style("left", d.pageX - w / 20 + "px")
        .html(`${result[0]['area_name']}, ${result[0].state}, ${result[0].bachelorsOrHigher}%`); console.log(result[0].bachelorsOrHigher)
    }
    )
    .on("mouseout", d => tooltip.style("display", "none"));

  svg
    .append("path")
    .attr("class", " states")
    .attr("d", d3.geoPath()(topojson.mesh(US, US.objects.states, (a, b) => a !== b)))

  // Define x-axis for legend
  let xScale = d3.scaleLinear(); // create a linear scale
  let eduPercent = edu.map(d => d.bachelorsOrHigher) // get an array of education percentages
  let xMin = d3.min(eduPercent); // get the minimum value of education percentages
  let xMax = d3.max(eduPercent); // get the maximum value of education percentages

  let xAxis = undefined
  xScale.domain([0, 80]).range([0, (h / 2) * scaleChecker + (h / 4) * checker])
  if (document.getElementById("master").clientWidth > 800) {
    xAxis = d3.axisRight(xScale).tickFormat(x => x + "%").tickSize(14); console.log(5) // create an axis for larger screens
  } else {
    xAxis = d3.axisTop(xScale).tickFormat(x => x + "%").tickSize(14) // create an axis for smaller screens
  }

  // Create the legend
  var legendContainer = svg.append('g').attr('id', 'legend')
  let legend = legendContainer
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("width", (h / 4 * checker) / 7.6 + 14 * scaleChecker)
    .attr("height", (d, i) => (14 * checker) + ((h / 2 - xScale(i)) / 7.3) * scaleChecker)
    .attr("x", (d, i) => paddingMD * scaleChecker * 20 + h / 2.45 * checker - xScale(i * 10) * checker)
    .attr("y", (d, i) => h / 1.299 * scaleChecker + (Ppadding * 7.77 * checker) - xScale(i * 10) * scaleChecker)
    .attr("fill", x => x)

  legendContainer
  .append("g")
  .attr("transform", "translate("
  + (paddingMD * scaleChecker * 20 + h / 5.25 * checker)
  + "," + ((scaleChecker * h / 3) + (Ppadding * 8 * checker))
  + ")").call(xAxis).attr("id", "legend")
}