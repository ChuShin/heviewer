(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(t,e,a){t.exports=a(45)},21:function(t,e,a){},22:function(t,e,a){},45:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),c=a(6),o=a.n(c),l=(a(21),a(7)),u=a(8),s=a(14),i=a(9),f=a(10),p=(a(22),a(13)),d=a(12),m=a.n(d),v=a(57),y=a(53),b=a(54),h=a(59),g=a(55),k=a(4),O=a(56),j=a(58),F=20,E=20,x=50,A=20,w=1600-A-E,B=400-F-x,C=5e6;function S(){}function z(t,e,a,n){var r=["#FF24009F","#E567179F","#FDD0179F","#5FFB179F","#4EE2EC9F","#0041C29F","#E3319D9F"],c=(a-t)/e,o=(n-t)/e;return c<=-2&&o<=-2?r[0]:c<-2&&o>-2&&o<2?r[1]:c<=-2&&o>=2?r[2]:c>-2&&c<2&&o<-2?r[3]:c>-2&&c<2&&o>-2&&o<2?r[4]:c>-2&&c<2&&o>2?r[5]:c<=-2&&o>=2?r[6]:c<-2&&o>-2&&o<2?r[7]:c>2&&o>2?r[8]:void 0}var D=function(t){var e=t.data,a=Object(n.useRef)(null),c=Object(n.useRef)(null);return Object(n.useEffect)(function(){if(e&&a.current){var t=function(t){var e,a=Object(k.a)().key(function(t){return t.group}).entries(t),n=0,r={};for(e=0;e<a.length;e++){var c=Object(y.a)(a[e].values.map(function(t){return t.pos}));r[a[e].key]={name:a[e].key,chrSize:c,offset:n},n+=c+C}return r.map_size=n,r}(e),n=function(t){var e,a=Object(k.a)().key(function(t){return t.sample}).entries(t),n={};for(e=0;e<a.length;e++)n[a[e].key]={name:a[e].key,mean:Object(b.a)(a[e].values.map(function(t){return t.covA+t.covB}))/2,sd:Object(h.a)(a[e].values.map(function(t){return t.covA}))/2};return n}(e);console.log(t),console.log(n);var r=Object(O.a)().domain([0,t.map_size]).range([0,w-E]),o=Object(O.a)().domain([0,300]).range([0,B]),l=Object(g.a)(a.current);l=l.append("g").attr("transform","translate(".concat(A,", ").concat(F,")"));var u=Object(j.a)().scale(r).ticks(5);l.append("g").attr("transform","translate(50, ".concat(B-x,")")).style("font","16px helvetica").call(u),Object(k.a)().key(function(t){return t.sample}).key(function(t){return t.group}).entries(e).forEach(function(e,a){var u=e.key,s=e.values,i=o("".concat(F+20*a));l.append("text").attr("class","y label").attr("x",r(0)).attr("y",i+20).text(u),s.forEach(function(a,o){var s=a.values.map(function(t){return[t.pos,z(n[u].mean,n[u].sd,t.covA,t.covB)]}),f=r(t[a.key].offset);l.append("g").attr("transform","translate(50,0)").append("rect").attr("rx",2).attr("ry",2).attr("x",f).attr("y",i).attr("width",r(t[a.key].chrSize)).attr("height",20).style("fill","#FF2400AF").style("fill-opacity",.1).on("click",function(){!function(t,e,a,n,r){var c=Object(g.a)(t.current);c.selectAll("*").remove();var o=r.key;r.values.forEach(function(t,r){var l=t.values.map(function(t){return[t.covA,t.pos]}),u=t.values.map(function(t){return[-1*t.covB,t.pos]}),s=a[o].mean,i=e(n[t.key].offset)+100,f=Object(O.a)().domain([-3*s,3*s]).range([-60,60]);c.append("g").attr("transform","translate(0,"+B+")").call(Object(j.b)(f));var p=Object(O.a)().domain([0,6e7]).range([0,B]);c.append("g").call(Object(j.b)(p)),c.append("g").attr("transform","translate(50,0)").selectAll("dot").data(l).enter().append("circle").attr("cx",function(t){return i+f(t[0])}).attr("cy",function(t){return p(t[1])}).attr("r",1.5).style("fill",function(t){return t[0]>80?"#69b3a2":t[0]<10?"#9933a2":"#808080"}),c.append("g").attr("transform","translate(50,0)").selectAll("dot").data(u).enter().append("circle").attr("cx",function(t){return i+f(t[0])}).attr("cy",function(t){return p(t[1])}).attr("r",1.5).style("fill",function(t){return t[0]<-80?"#9933a2":t[0]>-10?"#69b3a2":"#808080"}),c.append("line").attr("transform","translate(50,0)").attr("x1",i).attr("y1",p(0)).attr("x2",i).attr("y2",p(n[t.key].chrSize)).style("stroke","black").style("stroke-width",2),c.append("line").attr("transform","translate(50,0)").attr("x1",i+f(s)).attr("y1",p(0)).attr("x2",i+f(s)).attr("y2",p(n[t.key].chrSize)).style("stroke","#9933a2").style("stroke-width",2),c.append("line").attr("transform","translate(50,0)").attr("x1",i-f(s)).attr("y1",p(0)).attr("x2",i-f(s)).attr("y2",p(n[t.key].chrSize)).style("stroke","#69b3a2").style("stroke-width",2)})}(c,r,n,t,e)}),l.append("g").attr("transform","translate(50,0)").selectAll("line").data(s).enter().append("line").style("stroke",function(t){return t[1]}).attr("chrGroup",a.key).attr("value",function(t){return t[0]}).attr("x1",function(t){return f+r(t[0])}).attr("y1",function(t){return i}).attr("x2",function(t){return f+r(t[0])}).attr("y2",function(t){return i+20}).attr("stroke-width",1)})}),l.append("g").attr("class","bar-header").attr("transform","translate(0, ".concat(F,")")).append("text").append("tspan").text("HE")}},[e]),r.a.createElement("div",null,r.a.createElement("svg",{className:"GGLinear",onClick:S,width:w+A+E,height:B+F+x,ref:a}),r.a.createElement("svg",{className:"GGDot",onClick:S,width:w+A+E,height:B+F+x,ref:c}))};function G(t){return{sample:t.sample,group:t.group,pos:+t.pos,geneA:t.geneA,covA:parseFloat(t.covA),geneB:t.geneB,covB:parseFloat(t.covB)}}var N=function(){var t=Object(n.useState)(null),e=Object(p.a)(t,2),a=e[0],c=e[1];return Object(n.useEffect)(function(){Object(v.a)("./data/bna_he.csv",G).then(function(t){c(t)})},[]),null===a?r.a.createElement(m.a,{type:"Oval",color:"#00BFFF",height:100,width:100,timeout:1e5}):r.a.createElement(D,{data:a})},L=function(t){function e(){return Object(l.a)(this,e),Object(s.a)(this,Object(i.a)(e).apply(this,arguments))}return Object(f.a)(e,t),Object(u.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-header"},r.a.createElement("h2",null,"dashboard")),r.a.createElement(N,null))}}]),e}(n.Component),_=function(t){t&&t instanceof Function&&a.e(3).then(a.bind(null,60)).then(function(e){var a=e.getCLS,n=e.getFID,r=e.getFCP,c=e.getLCP,o=e.getTTFB;a(t),n(t),r(t),c(t),o(t)})};o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(L,null)),document.getElementById("root")),_()}},[[16,1,2]]]);
//# sourceMappingURL=main.4556d3c4.chunk.js.map