

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


function updateData(data)
{
	var i;
	var html = "<table><tr><th>&#35;</th><th>votes</th><th>Name</th><th>Tag</th><th>Link</th></tr>";
	var cnt = 0;
	var cntMin = 0;
	var cntMax = 0; // 10540 total, 5 pages: 0, 2108, 4216, 6324, 8432
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
				color = " style='color:" + data[name]["color"] + ";'"
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
		}
		
		cnt++;
	 
	}
	html += "</table>";
	//html += "<br/>Count: " + cnt + "<br/>";
	document.getElementById("out").innerHTML = html;
}
