$(function () {
	if (!document.querySelector("#login")) {
		$('table').before('<canvas id="monthTotal"></canvas><canvas id="monthChart"></canvas>');
		var aussieData = convertData();
		buildBarChart(aussieData);
		buildDonutChart(aussieData);
	}

});


function convertData() {
	//Get rid of the table head which displays "Internet Data"
	$('thead').remove();
	//Return the table as data
	var asd = JSON.stringify($("table").tableToJSON({
		ignoreEmptyRows: true
	}));
	return JSON.parse(asd);
}



//Charting functions
function toDate(dateStr) {
	var parts = dateStr.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

function nextDate(dateStr) {
	var parts = dateStr.split("-");
	return new Date(parts[2], parts[1], parts[0] - 1);
}

function buildBarChart(data) {

	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var usagedate = [];
	var usagedownload = [];
	var usageupload = [];
	var tempDate;

	//Load the newly created JSON data into arrays for the date, download, and upload
	for (i = 0; i < data.length - 3; i++) {
		if (data[i].Date.length !== 10) {} else {
			// parse the date into a nicer* format. Code via https://stackoverflow.com/a/1643468
			tempDate = toDate(data[i].Date);
			usagedate.push(tempDate.getDate() + "-" + monthNames[tempDate.getMonth()]);
			usagedownload.push(data[i].Download.replace(" GB", ""));
			usageupload.push(data[i].Upload.replace(" GB", ""));
		}
	}


	var ctx = document.getElementById('monthChart').getContext('2d');

	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'bar',

		// The data for our dataset
		data: {
			labels: usagedate,
			datasets: [{
					label: "Download",
					backgroundColor: '#5ac49f',
					data: usagedownload,
				},
				{
					label: "Upload",
					backgroundColor: '#308768',
					data: usageupload,
				}
			]
		},

		// Configuration options go here
		options: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text: "Daily Usage"
			},
			tooltips: {
				enabled: true,
				mode: "x",
				callbacks: {
					title: function (tooltipItem, data) {
						return 'Date: ' + data.labels[tooltipItem[0].index];
					},

					label: function (tooltipItems, data) {
						return data["datasets"][tooltipItems.datasetIndex]["label"] + ": " + tooltipItems.yLabel + ' GB';
					},
				}
			},
			scales: {
				yAxes: [{

					ticks: {
						callback: function (value, index, values) {
							return value + " GB";
						}
					},
					stacked: true
				}],

				xAxes: [{
					//Change X-Axis display settings here
					display: true,
					stacked: true,
					ticks: {
						autoSkip: false
					}
				}]




			}
		}
	});

}

function buildDonutChart(data) {
	var totalusage = '';
	var usageleft = '';
	var daysthismonth = '';
	var dayselapsed;
	var daysremaining;
	var percentusage;

	var sliceddata = data.slice(-2);
	totalusage = sliceddata[0].Download;
	totalusage = totalusage.replace(" GB", "");
	usageleft = sliceddata[1].Download;
	usageleft = usageleft.replace(" GB", "");

	percentusage = Math.floor((totalusage / (parseInt(totalusage) + parseInt(usageleft))) * 100);

	daysthismonth = data[0].Date;
	daysthismonth = ((nextDate(daysthismonth) - toDate(daysthismonth)) / 86400000) + 1;
	dayselapsed = (data.length - 3);
	daysremaining = daysthismonth - dayselapsed;



	var ctx = document.getElementById('monthTotal').getContext('2d');
	var myDoughnutChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			datasets: [{
					labels: ["Used", "Remaining"],
					data: [totalusage, usageleft],
					backgroundColor: ["#36a2eb", "#77b4dd"]
				},
				{
					labels: ["Elapsed", "Remaining"],
					data: [dayselapsed, daysremaining],
					backgroundColor: ["#36a2eb", "#77b4dd"]

				}
			]
		},
		options: {
			legend: {
				position: 'top',
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem, data) {
						var dataindex = tooltipItem.datasetIndex;
						var dataset = data.datasets[dataindex];
						var index = tooltipItem.index;
						if (dataindex === 0) {
							return dataset.labels[index] + ': ' + dataset.data[index] + " GB";
						} else {
							return dataset.labels[index] + ': ' + dataset.data[index] + " Days";
						}

					}
				}
			},
			elements: {
				center: {
					text: percentusage + '% used',
					color: '#46BFBD', // Default is #000000
					fontStyle: 'Arial', // Default is Arial
					sidePadding: 20 // Defualt is 20 (as a percentage)
				}
			}
		}
	});
}

Chart.pluginService.register({
	beforeDraw: function (chart) {
		if (chart.config.options.elements.center) {
			//Get ctx from string
			var ctx = chart.chart.ctx;

			//Get options from the center object in options
			var centerConfig = chart.config.options.elements.center;
			var fontStyle = centerConfig.fontStyle || 'Arial';
			var txt = centerConfig.text;
			var color = centerConfig.color || '#000';
			var sidePadding = centerConfig.sidePadding || 20;
			var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
			//Start with a base font of 30px
			ctx.font = "30px " + fontStyle;

			//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
			var stringWidth = ctx.measureText(txt).width;
			var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

			// Find out how much the font can grow in width.
			var widthRatio = elementWidth / stringWidth;
			var newFontSize = Math.floor(30 * widthRatio);
			var elementHeight = (chart.innerRadius * 2);

			// Pick a new font size so it will not be larger than the height of label.
			var fontSizeToUse = Math.min(newFontSize, elementHeight);

			//Set font settings to draw it correctly.
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
			var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
			ctx.font = fontSizeToUse + "px " + fontStyle;
			ctx.fillStyle = color;

			//Draw text in center
			ctx.fillText(txt, centerX, centerY);
		}
	}
});