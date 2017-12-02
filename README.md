# AussieBroadband-Usage-Charter v0.2
Unofficial Chrome extension to chart AussieBroadband usage.
**Note:** This is completely unsupported by AussieBroadband, and is essentially a more client side version of [MyAussie Usage Graphs](https://github.com/TimLChan/MyAussie-Usage-Graphs). 


## Getting Started ##
So how do you use this? 

 1. Download the repo as a .ZIP
 2. Extract to any location
 3. Follow the [Load Unpacked Extensions](https://developer.chrome.com/extensions/getstarted#unpacked) guide from Chrome

Aaaaaand, you're done!


## Customisation ##
You can change what you want included in the extension, whether it be removing the labels, or removing the charts

**Removing Bar Chart X-Axis**

![Remove X-Axis Labels](https://i.imgur.com/6EdUPIF.png)
1. To remove labels on the bar chart, look for the function "buildBarChart" in AussieBB.js
2. Look for "display" in the "xAxes" 
3. Change from "true" to "false"
4. Save the file and reload the extension from chrome://extensions/

**Removing Bar or Donut Chart**

![Removing Donut Chart](https://i.imgur.com/qGicADx.png)
1. To remove one (or both) of the charts, head straight to the top of AussieBB.js
2. Next to the chart you want to remove, add "//" without quotations
3. Save the file and reload the extension from chrome://extensions/

----------

Screenshot
----------
![Usage Charted for AussieBB](https://i.imgur.com/k6xt26b.png)
----------


----------


## Acknowledgments ##

 - [WeidiZhang](https://github.com/weidizhang/) for the base Chrome Extension
 - [ChartJS](http://www.chartjs.org/) for the awesome charting JS library
 - [TabletoJSON](https://github.com/lightswitch05/table-to-json) for their table to JSON JS library


----------
## Changelog ##
 
 - v0.2 - Updated to not display the usage graph on the login page, added in donut chart
 - v0.1 - Initial release

