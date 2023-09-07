d3.json('data/data.json').then(data => {
    drawTable(data);

    d3.select("#orderByTime").on("click", function() {
      data.sort((a, b) => d3.ascending(a.tempo, b.tempo));
      drawTable(data);
    });

    d3.select("#orderByPlayers").on("click", function() {
      data.sort((a, b) => d3.ascending(a.giocatori, b.giocatori));
      drawTable(data);
    });
});

function drawTable(data) {
    const rowHeight = 40;  // altezza di ogni riga
    const marginBottom = 10;  // margine che hai impostato nel CSS
    const totalHeight = rowHeight + marginBottom;

    let rows = d3.select("#table")
      .selectAll(".row")
      .data(data, d => d.nome)
      .join(
        enter => enter.append("div").classed("row", true),
        update => update,
        exit => exit.remove()
      );

    rows.attr('data-rank', (d, i) => i)
        .transition()
        .duration(1000)
        .style("transform", d => `translateY(${d3.select(`[data-rank="${rows.data().indexOf(d)}"]`).attr('data-rank') * totalHeight}px)`);

    rows.selectAll(".column")
        .data(d => [d.nome, d.anno, d.giocatori, d.tempo, d.eta, d.complessita])
        .join("div")
        .classed("column", true)
        .text(d => d);

    d3.select("#table").style("height", `${data.length * totalHeight}px`);
}
