var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
	.select(".chart")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var circleGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(timesData, chosenXAxis) {
	// create scales
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(timesData, d => d[chosenXAxis]) * 0.8,
			d3.max(timesData, d => d[chosenXAxis]) * 1.2
		])
		.range([0, width]);

	return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(timesData, chosenYAxis) {
	// create scales
	var yLinearScale = d3.scaleLinear()
		.domain([d3.min(timesData, d => d[chosenYAxis]) * 0.8,
			d3.max(timesData, d => d[chosenYAxis]) * 1.2
		])
		.range([height, 0]);

	return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
	var bottomAxis = d3.axisBottom(newXScale);

	xAxis.transition()
		.duration(1000)
		.call(bottomAxis);

	return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxes2(newYScale, yAxis) {
	var leftAxis = d3.axisLeft(newYScale);

	yAxis.transition()
		.duration(1000)
		.call(leftAxis);

	return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

	circlesGroup.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[chosenXAxis]));

	return circlesGroup;
}

function renderCirclesText(textGroup, newXScale, chosenXAxis) {

	textGroup.transition()
		.duration(1000)
		.attr("x", d => newXScale(d[chosenXAxis]));

	return textGroup;
}

function renderCirclesG(circlesG, newXScale, chosenXAxis) {

	circlesG.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[chosenXAxis]));

	return circlesG;
}

// function used for updating circles group with a transition to
// new circles
function yrenderCircles(circlesGroup, newYScale, chosenYAxis) {

	circlesGroup.transition()
		.duration(1000)
		.attr("cy", d => newYScale(d[chosenYAxis]));

	return circlesGroup;
}

function yrenderCirclesText(textGroup, newYScale, chosenYAxis) {

	textGroup.transition()
		.duration(1000)
		.attr("y", d => newYScale(d[chosenYAxis]));

	return textGroup;
}

function yrenderCirclesG(circlesG, newYScale, chosenYAxis) {

	circlesG.transition()
		.duration(1000)
		.attr("cy", d => newYScale(d[chosenYAxis]));

	return circlesG;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

	if (chosenXAxis === "poverty") {
		var label = "Poverty";
	}
	else if (chosenXAxis === "age") {
		var label = "Age";
	}
	else {
		var label = "Income";
	}
	
	if (chosenYAxis === "healthcare") {
		var labely = "Healthcare";
	}
	else if (chosenYAxis === "smokes") {
		var labely = "Smokes";
	}
	else {
		var labely = "Obesity";
	}

	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function(d) {
			return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`);
		});

	circlesGroup.call(toolTip);

	circlesGroup.on("mouseover", function(data) {
		toolTip.show(data);
	})
		// onmouseout event
		.on("mouseout", function(data, index) {
			toolTip.hide(data);
		});

	return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../data/data.csv", function(err, timesData) {
	if (err) throw err;
	
	//console.log(timesData);

	// parse data
	timesData.forEach(function(data) {
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
		data.age = +data.age;
		data.smokes = +data.smokes;
		data.obesity = +data.obesity;
		data.abbr = data.abbr;
		data.state = data.state;
		data.income = +data.income;
	});

	// xLinearScale function above csv import
	var xLinearScale = xScale(timesData, chosenXAxis);

	// Create y scale function
	var yLinearScale = d3.scaleLinear()
		.domain([0, d3.max(timesData, d => d.healthcare)])
		.range([height, 0]);

	// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// append x axis
	var xAxis = circleGroup.append("g")
		.classed("x-axis", true)
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	// append y axis
	var yAxis = circleGroup.append("g")
		.classed("y-axis", true)
		//.attr("transform", `translate(0, 0)`)
		.call(leftAxis);

	// append y axis
	/*circleGroup.append("g")
		.call(leftAxis)
		.append("title");*/

	// append initial circles
	var circlesGroup = circleGroup.selectAll("circle")
		.data(timesData)
		.enter()	
		.append("g")
		.attr("class", "dot");

	var circlesG = circlesGroup.append("circle")
		.attr("class", "newblue")
		.attr("cx", d => xLinearScale(d[chosenXAxis]))
		.attr("cy", d => yLinearScale(d[chosenYAxis]))
		.attr("r", 15)
		.attr("fill", "LightBlue")
		.attr("opacity", ".5");
		
	var textGroup = circlesGroup.append("text")
		.attr("x", d => xLinearScale(d[chosenXAxis]))
		.attr("y", d => yLinearScale(d[chosenYAxis]))
		.attr('text-anchor', 'middle')
		.attr('alignment-baseline', 'middle')
		.style('font-size', '10')
		.text(function(data) {return data.abbr});

	// Create group for	 3 x- axis labels
	var labelsGroup = circleGroup.append("g")
		.attr("transform", `translate(${width / 2}, ${height + 20})`);

	var povertyLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 20)
		.attr("value", "poverty") // value to grab for event listener
		.classed("active", true)
		.text("In Poverty (%)");

	var ageLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 40)
		.attr("value", "age") // value to grab for event listener
		.classed("inactive", true)
		.text("Age (median)");
		
	var incomeLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 60)
		.attr("value", "income") // value to grab for event listener
		.classed("inactive", true)
		.text("Household Income (median)");

	// append y axis
	/*circleGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.classed("axis-text", true)
		.text("Lacks Healthcare (%)");*/
	
	// Create group for	 3 y- axis labels
	var ylabelsGroup = circleGroup.append("g");
		//.attr("transform", `translate(${width / 2}, ${height + 20})`);
		
	var healthcareLabel = ylabelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("value", "healthcare") // value to grab for event listener
		.attr("dy", "1em")
		.classed("axis-text", true)
		.classed("active", true)
		.text("Lacks Healthcare (%)");
		
	var smokesLabel = ylabelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 20 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("value", "smokes") // value to grab for event listener
		.attr("dy", "1em")
		.classed("axis-text", true)
		.classed("inactive", true)
		.text("Smokes (%)");
		
	var obesityLabel = ylabelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 40 - margin.left)
		.attr("x", 0 - (height / 2))
		.attr("value", "obesity") // value to grab for event listener
		.attr("dy", "1em")
		.classed("axis-text", true)
		.classed("inactive", true)
		.text("Obesity (%)");


	// updateToolTip function above csv import
	var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
	var circlesG = updateToolTip(chosenXAxis, circlesG);

	// x axis labels event listener
	labelsGroup.selectAll("text")
		.on("click", function() {
			// get value of selection
			var value = d3.select(this).attr("value");
			if (value !== chosenXAxis) {

				// replaces chosenXaxis with value
				chosenXAxis = value;
				console.log(chosenXAxis);

				// console.log(chosenXAxis)

				// functions here found above csv import
				// updates x scale for new data
				xLinearScale = xScale(timesData, chosenXAxis);

				// updates x axis with transition
				xAxis = renderAxes(xLinearScale, xAxis);

				// updates circles with new x values
				circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
				
				circlesG = renderCirclesG(circlesG, xLinearScale, chosenXAxis);
				
				textGroup = renderCirclesText(textGroup, xLinearScale, chosenXAxis);
				
				// updates tooltips with new info
				circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

				// changes classes to change bold text
				if (chosenXAxis === "age") {
					ageLabel
						.classed("active", true)
						.classed("inactive", false);
					povertyLabel
						.classed("active", false)
						.classed("inactive", true);
					incomeLabel
						.classed("active", false)
						.classed("inactive", true);
				}
				else if (chosenXAxis === "poverty") {
					ageLabel
						.classed("active", false)
						.classed("inactive", true);
					povertyLabel
						.classed("active", true)
						.classed("inactive", false);
					incomeLabel
						.classed("active", false)
						.classed("inactive", true);
				}
				else {
					ageLabel
						.classed("active", false)
						.classed("inactive", true);
					povertyLabel
						.classed("active", false)
						.classed("inactive", true);
					incomeLabel
						.classed("active", true)
						.classed("inactive", false);
				}
			}
		});
		
		// y axis labels event listener
	ylabelsGroup.selectAll("text")
		.on("click", function() {
			// get value of selection
			var yvalue = d3.select(this).attr("value");
			if (yvalue !== chosenYAxis) {

				// replaces chosenYaxis with value
				chosenYAxis = yvalue;

				console.log(chosenYAxis)

				// functions here found above csv import
				// updates y scale for new data
				yLinearScale = yScale(timesData, chosenYAxis);

				// updates y axis with transition
				yAxis = renderAxes2(yLinearScale, yAxis);

				// updates circles with new y values
				circlesGroup = yrenderCircles(circlesGroup, yLinearScale, chosenYAxis);
				
				circlesG = yrenderCirclesG(circlesG, yLinearScale, chosenYAxis);
				
				textGroup = yrenderCirclesText(textGroup, yLinearScale, chosenYAxis);
				
				// updates tooltips with new info
				circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

				// changes classes to change bold text
				if (chosenYAxis === "healthcare") {
					healthcareLabel
						.classed("active", true)
						.classed("inactive", false);
					smokesLabel
						.classed("active", false)
						.classed("inactive", true);
					obesityLabel
						.classed("active", false)
						.classed("inactive", true);
				}
				else if (chosenYAxis === "smokes") {
					healthcareLabel
						.classed("active", false)
						.classed("inactive", true);
					smokesLabel
						.classed("active", true)
						.classed("inactive", false);
					obesityLabel
						.classed("active", false)
						.classed("inactive", true);
				}
				else {
					healthcareLabel
						.classed("active", false)
						.classed("inactive", true);
					smokesLabel
						.classed("active", false)
						.classed("inactive", true);
					obesityLabel
						.classed("active", true)
						.classed("inactive", false);
				}
			}
		});
});
