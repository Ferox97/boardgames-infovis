d3.json('data/data.json').then(initialData => {
  let data = initialData;

  let yearMin = d3.min(data, d => d.anno);
  let yearMax = d3.max(data, d => d.anno);

  let playerMin = d3.min(data, d => d.giocatoriMin);
  let playerMax = d3.max(data, d => d.giocatoriMax);

  populateYearDropdowns(yearMin, yearMax);
  populatePlayerDropdowns(playerMin, playerMax);
  
  drawTable(data);

  d3.select("#yearDropdownMin").on("change", function() {
      yearMin = +this.value;
      if (yearMin >= yearMax) {
          yearMax = yearMin + 1;
          d3.select("#yearDropdownMax").property("value", yearMax);
      }
      filterData();
  });

  d3.select("#yearDropdownMax").on("change", function() {
      yearMax = +this.value;
      if (yearMax <= yearMin) {
          yearMin = yearMax - 1;
          d3.select("#yearDropdownMin").property("value", yearMin);
      }
      filterData();
  });

  d3.select("#playerDropdownMin").on("change", function() {
      playerMin = +this.value;
      if (playerMin >= playerMax) {
          playerMax = playerMin + 1;
          d3.select("#playerDropdownMax").property("value", playerMax);
      }
      filterData();
  });

  d3.select("#playerDropdownMax").on("change", function() {
      playerMax = +this.value;
      if (playerMax <= playerMin) {
          playerMin = playerMax - 1;
          d3.select("#playerDropdownMin").property("value", playerMin);
      }
      filterData();
  });

  function populateYearDropdowns(min, max) {
      const dropdownMin = d3.select("#yearDropdownMin");
      const dropdownMax = d3.select("#yearDropdownMax");

      for (let i = min; i <= max; i++) {
          dropdownMin.append("option").attr("value", i).text(i);
          dropdownMax.append("option").attr("value", i).text(i);
      }

      dropdownMin.property("value", min);
      dropdownMax.property("value", max);
  }

  function populatePlayerDropdowns(min, max) {
      const dropdownMin = d3.select("#playerDropdownMin");
      const dropdownMax = d3.select("#playerDropdownMax");

      for (let i = min; i <= max; i++) {
          dropdownMin.append("option").attr("value", i).text(i);
          dropdownMax.append("option").attr("value", i).text(i);
      }

      dropdownMin.property("value", min);
      dropdownMax.property("value", max);
  }


  function filterData() {
      data = initialData.filter(game => 
          game.anno >= yearMin && game.anno <= yearMax && 
          game.giocatoriMax <= playerMax && game.giocatoriMin >= playerMin
      );
      drawTable(data);
  }

  function drawTable(data) {
      const rowHeight = 105;
      const marginBottom = 10;
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
          .data(d => [
              { type: 'image', value: `./Immagini/${d.nome}.webp` },
              d.nome,
              d.anno,
              `${d.giocatoriMin} - ${d.giocatoriMax}`,
              `${d.tempoMin} - ${d.tempoMax}`,
              d.eta,
              d.complessita
          ])
          .join("div")
          .classed("column", true)
          .html(d => {
              if (d.type === 'image') {
                  return `<img src="${d.value}" alt="${d.nome}">`;
              }
              return d;
          });

      d3.select("#table").style("height", `${data.length * totalHeight}px`);
  }
});
