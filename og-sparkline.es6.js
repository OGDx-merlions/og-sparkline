(function() {
  Polymer({
    is: 'og-sparkline',
    properties: {
      /**
       * @property width
       */
      width: {
        type: Number,
        value: 200
      },
      /**
       * @property height
       */
      height: {
        type: Number,
        value: 200
      },
      /**
       * @property showXAxis
       */
      showXAxis: {
        type: Boolean,
        value: false
      },
      /**
       * @property showYAxis
       */
      showYAxis: {
        type: Boolean,
        value: false
      },
      /**
       * @property axisWidth
       */
      axisWidth: {
        type: Number,
        value: 1.5
      },
      /**
       * @property axisColor
       */
      axisColor: {
        type: String,
        value: 'lightgray'
      },
      /**
       * @property lineWidth
       */
      lineWidth: {
        type: Number,
        value: 2.5
      },
      /**
       * @property lineColor
       */
      lineColor: {
        type: String,
        value: 'steelblue'
      },
      /**
       * @property chartData
       */
      chartData: {
        type: Array,
        observer: '_chartDataChanged'
      },
      /**
       * @property curPosition
       */
      curPosition: {
        type: Array,
        value: function() {
          return [];
        }
      },
      /**
       * @property curPositionColor
       */
      curPositionColor: {
        type: String,
        value: 'steelblue'
      },
      /**
       * @property curPositionRadius
       */
      curPositionRadius: {
        type: Number,
        value: 4
      },
      /**
       * @property hideTicks
       */
      hideTicks: {
        type: Boolean,
        value: false
      }
    },
    _chartDataChanged: function() {
      this.scopeSubtree(this.$.chartArea, true);
      var d3 = Px.d3;
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 10, bottom: 15, left: 0},
          width = +this.width - margin.left - margin.right,
          height = +this.height - margin.top - margin.bottom;

      if(!this.svg) {
        this.svg = d3.select(this.$.chartArea).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
      }

      // set the ranges
      var xScale = d3.scaleLinear().range([0, width]);
      var yScale = d3.scaleLinear().range([height, 0]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return xScale(d[0]); })
          .y(function(d) { return yScale(d[1]); });

      var svg = this.svg;

      var data = this.chartData;
      // format the data
      data.forEach(function(d) {
          d[0] = +d[0];
          d[1] = +d[1];
      });

      // Scale the range of the data
      xScale.domain(d3.extent(data, function(d) { return d[0]; }));
      yScale.domain([0, d3.max(data, function(d) { return d[1]; })]);

      var chartPath = this.svg.append("path")
          .data([data])
            .attr("fill", "none")
            .attr("stroke", this.lineColor)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", +this.lineWidth)
            .attr("d", valueline);

      // Add the X Axis
      if(this.showXAxis && this.hideTicks) {
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(function(d) {return ''}).tickSize(0));
      } else if(this.showXAxis){
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
      }

      // Add the Y Axis
      if(this.showYAxis && this.hideTicks) {
        this.svg.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d) {return ''}).tickSize(0));
      } else if(this.showYAxis){
        this.svg.append("g")
            .call(d3.axisLeft(yScale));
      }
      if(this.curPosition && this.curPosition.length) {
        this.svg.selectAll("circle")
          .data([this.curPosition])
          .enter()
            .append("circle")
            .attr("cx", function(d) {return xScale(+d[0])})
            .attr("cy", function(d) {return yScale(+d[1])})
            .attr("r", this.curPositionRadius)
            .attr("fill", this.curPositionColor);
      }
      this.svg.selectAll("path.domain")
       .style("stroke", this.axisColor)
       .style("stroke-width", this.axisWidth);
    }
  });
})();
