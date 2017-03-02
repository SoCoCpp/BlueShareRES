

function init()
{
	http_request = new XMLHttpRequest();
	try{
	   // Opera 8.0+, Firefox, Chrome, Safari
	   http_request = new XMLHttpRequest();
	}catch (e){
	   // IE
	   try{
		  http_request = new ActiveXObject("Msxml2.XMLHTTP");
			
	   }catch (e) {
		
		  try{
			 http_request = new ActiveXObject("Microsoft.XMLHTTP");
		  }catch (e){
			 // Something went wrong
			 alert("Your browser's JavaScript cannot access a proper XML HTTP request interface.");
			 return false;
		  }
	   }
	}

	http_request.onreadystatechange = function()
	{
	   if (http_request.readyState == 4)
			updateData(JSON.parse(http_request.responseText));
	}
	http_request.open("GET", "RESTaggingData.json?t=" + Date.now(), true);
	http_request.send();
}

function escapetxt(txt) // URL encoding used for CSV octet stream generation
{
	txt = "" + txt;
	return txt.replace(/"/g, '%22').replace(/'/g, '%27').replace(/\#/g, '%23').replace(/\&/g, '%26').replace(/\ /g, '%20');
}

function updateData(data)
{
	var i;
	//var csv = "data:application/octet-stream,votes%2Cname%2Ctag%2Ccolor%2Clink%0A";
	var html = "<table><tr><th>&#35;</th><th>votes</th><th>Name</th><th>Tag</th><th>Link</th></tr>";
	var cnt = 0;
	var cntMin = 0; // 10540 total, you have to add page navigaition by hand yourself. I used save web page completed, then editted each by hand.
	var cntMax = 0; // min 0, max 0 for all. Page 1 min 0, max 2108. Page 2 min 2108, max 4216. Page 3 min 4216, max 6324, Page 4 min 6324, max 8432. Page 5 min 8432, max 99999
	var excols = "";
	for (name in data)
	{
		if (cntMin == cntMax || (cnt >= cntMin && cnt < cntMax))
		{
			var color = "";
			var votes = "&nbsp;";
			var tag = "&nbsp;";
			var link = "&nbsp;";
			
			if (data[name].hasOwnProperty("color"))
				color = " style='color:" + data[name]["color"] + ";'";
			if (data[name].hasOwnProperty("votes"))
				votes = data[name]["votes"];
			if (data[name].hasOwnProperty("tag"))
				tag = data[name]["tag"];
			if (data[name].hasOwnProperty("link"))
			{
				link = data[name]["link"];
				var linkParts = link.split("/");
				var linkTitle = "";
				var linkSub = "";
				if (linkParts.length >= 7 && link.startsWith("http"))
					linkTitle = "(/" + linkParts[3] + "/" + linkParts[4] + ") " + linkParts[7];
				else linkTitle = "(link)";
				link = "<a href='" + link + "'>" + linkTitle + "</a>";
			}
			html += "<tr" + color + ">";
			html += "<td>" + cnt + "</td><td>" + votes + "</td><td>" + name + "</td><td>" + tag + "</td><td>" + link + "</td>";
			html += "</tr>";
			
			//---- CSV generation -----
			/*
			if (votes == "&nbsp;") votes = "";
			if (tag == "&nbsp;") tag = "";
			color = "";
			link = "";
			if (data[name].hasOwnProperty("color"))
				color = data[name]["color"];
			if (data[name].hasOwnProperty("link"))
				link = data[name]["link"];
			
			csv += escapetxt(votes) + "%2C" + escapetxt(name) + "%2C" + escapetxt(tag) + "%2C" + escapetxt(color) + "%2C" + escapetxt(link) + "%0A";
			*/
			//-------------
		}
		
		cnt++;
	 
	}
	html += "</table>";
	//html += "<br/>Count: " + cnt + "<br/>";
	document.getElementById("out").innerHTML = html;
	
	//document.getElementById("csv").innerHTML = "<a href='" + csv + "' download='res.csv'>&lt;Download CSV&gt;</a>";

}
