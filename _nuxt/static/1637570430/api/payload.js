__NUXT_JSONP__("/api", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z){return {data:[{document:{slug:"api",title:"REST API",position:9,toc:[{id:p,depth:q,text:D},{id:E,depth:m,text:F},{id:G,depth:m,text:H},{id:I,depth:m,text:J},{id:K,depth:m,text:L},{id:M,depth:q,text:N},{id:O,depth:m,text:P},{id:Q,depth:m,text:R},{id:S,depth:q,text:T}],body:{type:"root",children:[{type:b,tag:e,props:{},children:[{type:a,value:"Deputy Server exposes a set of RESTFUL APIs that are useful for manipulating mocks and retrieving request records from\nths server."}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"The API server is started on the same port as the UI server. "},{type:b,tag:g,props:{},children:[{type:a,value:"http:\u002F\u002Flocalhost:8081"}]}]},{type:a,value:c},{type:b,tag:r,props:{id:p},children:[{type:b,tag:h,props:{href:"#mocks",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:D}]},{type:a,value:c},{type:b,tag:n,props:{id:E},children:[{type:b,tag:h,props:{href:"#list",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:F}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"GET http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks"}]},{type:a,value:" will list all the configured mocks on the server"}]},{type:a,value:c},{type:b,tag:n,props:{id:G},children:[{type:b,tag:h,props:{href:"#create",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:H}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"POST http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks"}]},{type:a,value:U}]},{type:a,value:c},{type:b,tag:s,props:{className:[t]},children:[{type:b,tag:u,props:{className:[v,w]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:d,props:{className:[f,x]},children:[{type:a,value:y}]},{type:a,value:c},{type:b,tag:d,props:{className:[f,z]},children:[{type:a,value:A}]},{type:a,value:V},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:B}]},{type:a,value:C},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:"'\n[\n  {\n    \"requests\": {\n      \"path\": \"\u002Fhi\"\n    }\n  },\n  {\n    \"requests\": {\n      \"path\": \"\u002Fhalo\"\n    }\n  }\n]\n'"}]},{type:a,value:c}]}]}]},{type:a,value:c},{type:b,tag:n,props:{id:I},children:[{type:b,tag:h,props:{href:"#update",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:J}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"PUT http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks"}]},{type:a,value:U}]},{type:a,value:c},{type:b,tag:s,props:{className:[t]},children:[{type:b,tag:u,props:{className:[v,w]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:d,props:{className:[f,x]},children:[{type:a,value:y}]},{type:a,value:c},{type:b,tag:d,props:{className:[f,z]},children:[{type:a,value:A}]},{type:a,value:V},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:B}]},{type:a,value:C},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:"'\n[\n  {\n    \"id\": \"mock-id-1\",\n    \"requests\": {\n      \"path\": \"\u002Fhi\"\n    }\n  },\n  {\n    \"id\": \"mock-id-2\",\n    \"requests\": {\n      \"path\": \"\u002Fhalo\"\n    }\n  }\n]\n'"}]},{type:a,value:c}]}]}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:W},{type:b,tag:h,props:{href:X},children:[{type:a,value:p}]},{type:a,value:Y}]},{type:a,value:c},{type:b,tag:n,props:{id:K},children:[{type:b,tag:h,props:{href:"#delete",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:L}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"DELETE http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks\u002F"}]},{type:a,value:" will delete the mock with the specified body id:"}]},{type:a,value:c},{type:b,tag:s,props:{className:[t]},children:[{type:b,tag:u,props:{className:[v,w]},children:[{type:b,tag:g,props:{},children:[{type:b,tag:d,props:{className:[f,x]},children:[{type:a,value:y}]},{type:a,value:c},{type:b,tag:d,props:{className:[f,z]},children:[{type:a,value:A}]},{type:a,value:" -X DELETE http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks -H "},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:B}]},{type:a,value:C},{type:b,tag:d,props:{className:[f,o]},children:[{type:a,value:"'\n{\n    \"id\": \"mock-id-1\"\n}\n'"}]},{type:a,value:c}]}]}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:W},{type:b,tag:h,props:{href:X},children:[{type:a,value:p}]},{type:a,value:Y}]},{type:a,value:c},{type:b,tag:r,props:{id:M},children:[{type:b,tag:h,props:{href:"#records",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:N}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"The server stores all the received requests alongside the matched mocks in memory"}]},{type:a,value:c},{type:b,tag:n,props:{id:O},children:[{type:b,tag:h,props:{href:"#list-records",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:P}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"GET http:\u002F\u002Flocalhost:8081\u002Fapi\u002Frecords"}]},{type:a,value:" will list all the records received by the server"}]},{type:a,value:c},{type:b,tag:n,props:{id:Q},children:[{type:b,tag:h,props:{href:"#clear-records",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:R}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"POST http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fclear"}]},{type:a,value:" will clear all the records received by the server"}]},{type:a,value:c},{type:b,tag:r,props:{id:S},children:[{type:b,tag:h,props:{href:"#reset-records--mocks",ariaHidden:i,tabIndex:j},children:[{type:b,tag:d,props:{className:[k,l]},children:[]}]},{type:a,value:T}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:g,props:{},children:[{type:a,value:"POST http:\u002F\u002Flocalhost:8081\u002Fapi\u002Freset"}]},{type:a,value:" will delete all the records and mocks"}]}]},dir:"\u002Fen",path:"\u002Fen\u002Fapi",extension:".md",createdAt:Z,updatedAt:Z,to:"\u002Fapi",category:""},prev:{title:"Mocking Definition",path:"\u002Fen\u002Fmocking",to:"\u002Fmocking"},next:{title:"Testing",path:"\u002Fen\u002Fassertions",to:"\u002Fassertions"}}],fetch:{},mutations:[]}}("text","element","\n","span","p","token","code","a","true",-1,"icon","icon-link",3,"h3","string","mocks",2,"h2","div","nuxt-content-highlight","pre","language-shell","line-numbers","comment","# Responds with a 201","function","curl","'content-type=application\u002Fjson'"," -d ","Mocks","list","List","create","Create","update","Update","delete","Delete","records","Records","list-records","List Records","clear-records","Clear Records","reset-records--mocks","Reset Records & Mocks"," will create new mocks on the server, for example:"," -X POST http:\u002F\u002Flocalhost:8081\u002Fapi\u002Fmocks -H ","see more about ","guide.md"," here","2021-11-22T08:39:06.731Z")));