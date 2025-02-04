const renderAudits = (user) => {
    const auditRatio = user.auditRatio.toFixed(1);
    const doneAudits = user.totalUp / 1000;
    const done = Math.round(doneAudits);
    const receivedAudits = user.totalDown / 1000;
    const received = Math.round(receivedAudits);

    var max = done;
    var dataSet = [received, done];
    if (max < received) {
        max = received;
    }

    var progressElement = document.querySelector(".sv");
    progressElement.innerHTML = `<h1>Audit Ratio: ${auditRatio}</h1>`;


    var width = 300;
    var height = 220;
    var padding = 2;

    var svg = d3.select(".sv").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("rect")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr({
            x: function (d, i) { return i * (width / dataSet.length); },
            y: function (d) { return height - (d / max) * 200; },
            width: width / dataSet.length - padding,
            height: function (d) { return ((d) / max) * 200; },
            fill: function (d) { return "rgba(0, 255 , 255, " + ((d / 4) / (max / 4)); }
        });

        svg.append("text")
        .text(`Received: ${dataSet[0]} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 Done: ${dataSet[1]}`) 
        .attr({
            "text-anchor": "middle",
            x: 130, 
            y: height - 5,  
            "font-size": 16,
            "fill": "#000",
            "font-weight": "bold"
        });

};