d3.select('canvas').call(pathgl).selectAll("circle")
.data(pathgl.sim.force(16).repeat())
.enter().append("circle")
.attr('r', function (d,i) { return d.x()(d,i) })
.attr('cx', function (d,i) { return d.x()(d,i) })
.attr('cy', function (d,i) { return d.y()(d,i) })
.attr('fill', function () { return 'hsl(' + (Math.random() * 240 + 120) + ',100%, 50%)' })
