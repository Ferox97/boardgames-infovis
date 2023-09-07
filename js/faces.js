// Carico il file json contenuto nella stessa cartella
fetch('data/data.json')
.then(response => response.json())
.then(data => {
    // Creo delle scale per mappare i dati nel range che mi serve
    var faceScale = d3.scaleLinear().domain([1, 10]).range([10, 140]);
    var noseScale = d3.scaleLinear().domain([1, 10]).range([10, 70]);
    var eyeScale = d3.scaleLinear().domain([1, 10]).range([5, 30]);
    var mouthScale = d3.scaleLinear().domain([1, 10]).range([10, 30]);
    var xScale = d3.scaleLinear().domain([0, 4]).range([0, 1500]); // scale per la posizione x
    var yScale = d3.scaleLinear().domain([0, 1]).range([0, 300]); // scale per la posizione y

    // Creo un SVG per ogni faccia
    var svgs = data.map((faceData, i) => {
    var svg = d3.select("body").append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .style("position", "absolute")
        .style("left", `${xScale(i % 5)}px`)
        .style("top", `${yScale(Math.floor(i / 5))}px`);

    // Disegno la faccia
    svg.append("circle")
        .attr("class", "face")
        .attr("cx", 150)
        .attr("cy", 150)
        .attr("r", faceScale(faceData.rotonditaFaccia))
        .on("click", () => reorder("rotonditaFaccia"));

    // Disegno gli occhi
    svg.append("circle")
        .attr("class", "eye")
        .attr("cx", 120)
        .attr("cy", 150 - faceScale(faceData.rotonditaFaccia) + 50) 
        .attr("r", eyeScale(faceData.dimensioneOcchi))
        .on("click", () => reorder("dimensioneOcchi"));
        svg.append("circle")
        .attr("class", "eye")
        .attr("cx", 180)
        .attr("cy", 150 - faceScale(faceData.rotonditaFaccia) + 50) 
        .attr("r", eyeScale(faceData.dimensioneOcchi))
        .on("click", () => reorder("dimensioneOcchi"));


    // Disegno il naso
    svg.append("circle")
        .attr("class", "nose")
        .attr("cx", 150)
        .attr("cy", 150)
        .attr("r", noseScale(faceData.dimensioneNaso))
        .on("click", () => reorder("dimensioneNaso"));

    // Disegno la bocca
    svg.append("ellipse")
        .attr("class", "mouth")
        .attr("cx", 150)
        .attr("cy", 150 + faceScale(faceData.rotonditaFaccia) - 30)
        .attr("rx", mouthScale(faceData.dimensioneBocca) * 1.5)
        .attr("ry", mouthScale(faceData.dimensioneBocca) * 0.8)
        .on("click", () => reorder("dimensioneBocca"));

    return { svg, faceData };
    });

    function reorder(property) {
    svgs.sort((a, b) => a.faceData[property] - b.faceData[property]);

    svgs.forEach((svgObj, i) => {
        svgObj.svg.transition()
        .duration(1000)
        .style("left", `${xScale(i % 5)}px`)
        .style("top", `${yScale(Math.floor(i / 5))}px`);
    });
    }
})
.catch(error => console.error('Error:', error));