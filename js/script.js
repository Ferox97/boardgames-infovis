d3.json('data/data.json').then(initialData => {
  let data = initialData;

  let yearMin = d3.min(data, d => d.anno);
  let yearMax = d3.max(data, d => d.anno);

  let playerMin = d3.min(data, d => d.giocatoriMin);
  let playerMax = d3.max(data, d => d.giocatoriMax);

  let durationMin = d3.min(data, d => d.tempoMin);
  let durationMax = d3.max(data, d => d.tempoMax);

  let ageMin = d3.min(data, d => d.eta);
  let ageMax = d3.max(data, d => d.eta); 

  let complexityMin = d3.min(data, d => d.complessita);
  let complexityMax = d3.max(data, d => d.complessita);

  populateYearDropdowns(yearMin, yearMax);
  populatePlayerDropdowns(playerMin, playerMax);
  populateDurationDropdowns(durationMin, durationMax);
  populateAgeDropdowns(ageMin, ageMax);
  populateComplexityDropdowns(complexityMin, complexityMax);
  
  drawTable(data);
  drawChart(data);

d3.select("#yearDropdownMin").on("change", function() {
    yearMin = +this.value;
    if (yearMin > yearMax) {
        yearMax = yearMin;
        d3.select("#yearDropdownMax").property("value", yearMax);
    }
    filterData();
});

d3.select("#yearDropdownMax").on("change", function() {
    yearMax = +this.value;
    if (yearMax < yearMin) {
        yearMin = yearMax;
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

  d3.select("#durationDropdownMin").on("change", function() {
    durationMin = +this.value;
    if (durationMin > durationMax) {
        durationMax = durationMin;
        d3.select("#durationDropdownMax").property("value", durationMax);
    }
    filterData();
});

d3.select("#durationDropdownMax").on("change", function() {
    durationMax = +this.value;
    if (durationMax < durationMin) {
        durationMin = durationMax;
        d3.select("#durationDropdownMin").property("value", durationMin);
    }
    filterData();
});

d3.select("#ageDropdownMin").on("change", function() {
    ageMin = +this.value;
    filterData();
});

d3.select("#complexityDropdownMin").on("change", function() {
    complexityMin = +this.value;
    if (complexityMin > complexityMax) {
        complexityMax = complexityMin;
        d3.select("#complexityDropdownMax").property("value", complexityMax);
    }
    filterData();
});

d3.select("#complexityDropdownMax").on("change", function() {
    complexityMax = +this.value;
    if (complexityMax < complexityMin) {
        complexityMin = complexityMax;
        d3.select("#complexityDropdownMin").property("value", complexityMin);
    }
    filterData();
});

function populateComplexityDropdowns(min, max) {
    const dropdownMin = d3.select("#complexityDropdownMin");
    const dropdownMax = d3.select("#complexityDropdownMax");

    for (let i = min; i <= max; i += 0.01) {
        dropdownMin.append("option").attr("value", i.toFixed(2)).text(i.toFixed(2));
        dropdownMax.append("option").attr("value", i.toFixed(2)).text(i.toFixed(2));
    }
    

    dropdownMin.property("value", min);
    dropdownMax.property("value", max);
}

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

  function populateDurationDropdowns(min, max) {
    const dropdownMin = d3.select("#durationDropdownMin");
    const dropdownMax = d3.select("#durationDropdownMax");

    for (let i = min; i <= max; i++) {
        dropdownMin.append("option").attr("value", i).text(i);
        dropdownMax.append("option").attr("value", i).text(i);
    }

    dropdownMin.property("value", min);
    dropdownMax.property("value", max);
}

function populateAgeDropdowns(min, max) {
    const dropdownMin = d3.select("#ageDropdownMin");

    for (let i = min; i <= max; i++) {
        dropdownMin.append("option").attr("value", i).text(i);
    }

    dropdownMin.property("value", min);
}



  function filterData() {
      data = initialData.filter(game => 
          game.anno >= yearMin && game.anno <= yearMax && 
          game.giocatoriMax <= playerMax && game.giocatoriMin >= playerMin &&
          game.tempoMax <= durationMax && game.tempoMin >= durationMin &&
          game.eta >= ageMin &&
          game.complessita >= complexityMin && game.complessita <= complexityMax 
      );
      drawTable(data);
      drawChart(data);
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
              d.descrizione, 
              `${d.giocatoriMin} - ${d.giocatoriMax}`,
              d.tempoMin === d.tempoMax ? `${d.tempoMin}` : `${d.tempoMin} - ${d.tempoMax}`,
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

// Mostra il pop-up quando si fa clic su un'immagine
d3.select("#table").on("click", function(event) {
  const target = event.target;
  if (target.tagName === 'IMG') {
      const imageUrl = target.getAttribute('src');
      d3.select("#popupImage").attr("src", imageUrl);
      d3.select("#imagePopup").style("display", "flex");
  }
});

// Nascondi il pop-up quando si fa clic sullo sfondo
d3.select("#imagePopup").on("click", function(event) {
  if (event.target === this) {
      d3.select("#imagePopup").style("display", "none");
  }
});

let svg; 

function drawChart(data) {
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 760 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    if (!svg) { // Se svg non esiste, crealo
        svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    const counts = d3.rollup(data, v => v.length, d => d.anno);
    let dataArray = Array.from(counts, ([key, value]) => ({key, value}));

    dataArray = dataArray.sort((a, b) => +a.key - +b.key);

    x.domain(dataArray.map(d => d.key));
    y.domain([0, d3.max(dataArray, d => d.value)]);

    const barWidth = x.bandwidth();

    // Aggiorna gli assi
    svg.selectAll(".axis--x").remove();
    svg.selectAll(".axis--y").remove();

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(Math.max(d3.max(dataArray, d => d.value), 1)).tickFormat(d3.format("d")))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Numero di giochi");

        // Aggiorna le barre
        const bars = svg.selectAll(".bar")
        .data(dataArray);

        bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("y", height)
        .attr("width", barWidth) 
        .attr("height", 0)
        .merge(bars) 
        .transition()
        .duration(1000)
        .attr("x", d => x(d.key)) 
        .attr("width", barWidth) 
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));

        bars.exit().remove(); 

}





