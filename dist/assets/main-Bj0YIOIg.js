(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}})();const ze=[{id:"wh-a",name:"Warehouse A",short:"WH-A",width:1e3,height:640,nodes:[{id:"dock",name:"Dock Bay",x:90,y:520,kind:"dock"},{id:"corridor-a",name:"Corridor A",x:280,y:420,kind:"checkpoint"},{id:"corridor-b",name:"Corridor B",x:470,y:200,kind:"checkpoint"},{id:"corridor-c",name:"Corridor C",x:430,y:480,kind:"checkpoint"},{id:"junction-d",name:"Junction D",x:640,y:360,kind:"checkpoint"},{id:"zone-a1",name:"Zone A1",x:770,y:180,kind:"poi"},{id:"zone-a2",name:"Zone A2",x:830,y:430,kind:"poi"},{id:"charge-1",name:"Charge Station 1",x:170,y:580,kind:"poi"}],edges:[{a:"dock",b:"corridor-a"},{a:"corridor-a",b:"corridor-b"},{a:"corridor-a",b:"corridor-c"},{a:"corridor-b",b:"junction-d"},{a:"corridor-c",b:"junction-d"},{a:"junction-d",b:"zone-a1"},{a:"junction-d",b:"zone-a2"},{a:"dock",b:"charge-1"}],zones:[{id:"z-rack-1",name:"Rack Row 1",x:60,y:60,w:220,h:180},{id:"z-rack-2",name:"Rack Row 2",x:560,y:60,w:150,h:120},{id:"z-restricted",name:"Restricted — Automation Cell",x:700,y:250,w:130,h:110,danger:!0}],obstacles:[{id:"ob-b1",name:"Blocked passage (pallet)",x:470,y:200,w:70,h:26,kind:"crate"},{id:"ob-m1",name:"Forklift parked",x:250,y:330,w:56,h:34,kind:"vehicle"},{id:"ob-m2",name:"Conveyor unit",x:620,y:480,w:80,h:30,kind:"machine"}]},{id:"industrial",name:"Industrial Facility",short:"IND",width:1e3,height:640,nodes:[{id:"gate",name:"Service Gate",x:80,y:320,kind:"dock"},{id:"hall-n",name:"North Hall",x:300,y:170,kind:"checkpoint"},{id:"hall-s",name:"South Hall",x:300,y:470,kind:"checkpoint"},{id:"press-bay",name:"Press Bay",x:540,y:150,kind:"poi"},{id:"assembly",name:"Assembly Line",x:560,y:460,kind:"checkpoint"},{id:"qa-cell",name:"QA Cell",x:790,y:300,kind:"poi"},{id:"chem-store",name:"Chemical Store",x:820,y:540,kind:"poi"}],edges:[{a:"gate",b:"hall-n"},{a:"gate",b:"hall-s"},{a:"hall-n",b:"press-bay"},{a:"hall-s",b:"assembly"},{a:"press-bay",b:"qa-cell"},{a:"assembly",b:"qa-cell"},{a:"assembly",b:"chem-store"},{a:"hall-n",b:"hall-s"}],zones:[{id:"z-press",name:"Press Safety Zone",x:430,y:60,w:150,h:130,danger:!0},{id:"z-storage",name:"Parts Storage",x:90,y:470,w:160,h:130}],obstacles:[{id:"ob-i1",name:"Coolant spill",x:300,y:320,w:90,h:24,kind:"puddle"},{id:"ob-i2",name:"Machine housing",x:700,y:180,w:60,h:60,kind:"machine"},{id:"ob-i3",name:"Scrap bin",x:520,y:320,w:46,h:36,kind:"crate"}]},{id:"outdoor",name:"Outdoor Inspection Zone",short:"OUT",width:1e3,height:640,nodes:[{id:"base",name:"Base Station",x:100,y:480,kind:"dock"},{id:"perim-w",name:"West Perimeter",x:250,y:300,kind:"checkpoint"},{id:"perim-n",name:"North Perimeter",x:480,y:150,kind:"checkpoint"},{id:"substation",name:"Substation",x:740,y:200,kind:"poi"},{id:"tank-farm",name:"Tank Farm",x:640,y:450,kind:"checkpoint"},{id:"gate-e",name:"East Gate",x:880,y:340,kind:"poi"}],edges:[{a:"base",b:"perim-w"},{a:"perim-w",b:"perim-n"},{a:"perim-n",b:"substation"},{a:"perim-w",b:"tank-farm"},{a:"tank-farm",b:"substation"},{a:"tank-farm",b:"gate-e"},{a:"substation",b:"gate-e"}],zones:[{id:"z-hv",name:"High Voltage Enclosure",x:660,y:120,w:120,h:100,danger:!0},{id:"z-drainage",name:"Drainage Basin",x:330,y:430,w:170,h:120}],obstacles:[{id:"ob-o1",name:"Fallen branch",x:250,y:300,w:64,h:22,kind:"debris"},{id:"ob-o2",name:"Service truck",x:480,y:300,w:60,h:34,kind:"vehicle"},{id:"ob-o3",name:"Mud patch",x:640,y:450,w:70,h:24,kind:"puddle"}]}],P=e=>ze.find(t=>t.id===e)??ze[0];function Mt(e){let t=e>>>0;return function(){t|=0,t=t+1831565813|0;let s=Math.imul(t^t>>>15,1|t);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}let G=Mt(20260929);const xe=e=>e[Math.floor(G()*e.length)],ws=(e,t)=>Math.floor(e+G()*(t-e+1)),wi=["Inspection","Delivery","Patrol","Mapping","Environmental Monitoring","Search","Infrastructure Check"],xi={"wh-a":[{node:"zone-a1",name:"Zone A1"},{node:"zone-a2",name:"Zone A2"},{node:"junction-d",name:"Junction D"},{node:"corridor-b",name:"Corridor B"}],industrial:[{node:"press-bay",name:"Press Bay"},{node:"qa-cell",name:"QA Cell"},{node:"chem-store",name:"Chemical Store"},{node:"assembly",name:"Assembly Line"}],outdoor:[{node:"substation",name:"Substation"},{node:"gate-e",name:"East Gate"},{node:"tank-farm",name:"Tank Farm"},{node:"perim-n",name:"North Perimeter"}]};function Wt(e,t,s){const i=P(e),a=new Map;i.edges.forEach(c=>{a.has(c.a)||a.set(c.a,[]),a.has(c.b)||a.set(c.b,[]),a.get(c.a).push(c.b),a.get(c.b).push(c.a)});const r=new Map([[t,null]]),l=[t];for(;l.length;){const c=l.shift();if(c===s)break;for(const o of a.get(c)??[])r.has(o)||(r.set(o,c),l.push(o))}if(!r.has(s))return[t];const n=[];let d=s;for(;d;)n.unshift(d),d=r.get(d)??null;return n}function xs(e,t,s,i){const a=P(e),r=new Map;a.edges.forEach(o=>{o.a===i||o.b===i||(r.has(o.a)||r.set(o.a,[]),r.has(o.b)||r.set(o.b,[]),r.get(o.a).push(o.b),r.get(o.b).push(o.a))});const l=new Map([[t,null]]),n=[t];for(;n.length;){const o=n.shift();if(o===s)break;for(const v of r.get(o)??[])l.has(v)||(l.set(v,o),n.push(v))}if(!l.has(s))return Wt(e,t,s);const d=[];let c=s;for(;c;)d.unshift(c),c=l.get(c)??null;return d}function be(e,t){const i=P(e).nodes.find(a=>a.id===t);return i?{x:i.x,y:i.y}:{x:50,y:50}}function zt(e,t){let s=0;for(let i=1;i<t.length;i++){const a=be(e,t[i-1]),r=be(e,t[i]);s+=Math.hypot(a.x-r.x,a.y-r.y)}return s}function Mi(){const e=[["R-01","Atlas","wh-a","Corridor A"],["R-02","Nova","wh-a","Zone A2"],["R-03","Scout","industrial","QA Cell"],["R-04","Echo","industrial","South Hall"],["R-05","Rover","outdoor","Base Station"]],t=["idle","idle","charging","idle","online"];return e.map((s,i)=>{const[a,r,l,n]=s,d=[142,118,96,87,64][i],c=[136,111,89,78,55][i],o=be(l,n==="Corridor A"?"corridor-a":n==="Zone A2"?"zone-a2":n==="QA Cell"?"qa-cell":n==="South Hall"?"hall-s":"base");return{id:a,name:r,model:["MX-7 Quadruped","MX-7 Quadruped","TR-4 Wheeled","TR-4 Wheeled","AO-9 Tracked"][i],status:t[i],battery:[78,92,24,61,85][i],location:n,envId:l,signal:[96,99,58,88,91][i],temperature:[38,35,44,41,36][i],speed:0,missionCount:d,successCount:c,lastMaintenance:new Date(Date.now()-[9,21,4,35,15][i]*864e5).toISOString(),healthScore:[96,98,74,90,93][i],lastActivity:new Date(Date.now()-ws(1,40)*6e4).toISOString(),currentMissionId:null,knownStrengths:[],knownIssues:[],learnedPreferences:[],x:o.x,y:o.y}})}let Z=1,Ms=1;function ue(e,t,s,i,a,r,l){return{id:`ev-${Ms++}`,missionId:e,ts:0,kind:s,severity:i,title:a,detail:r,atNode:l}}function ki(){const e=Date.now(),t=864e5,s=[],i=(a,r,l,n,d,c,o,v,m,p,y,w,f)=>{s.push({id:a,robotId:r,missionId:"seed",missionCode:l,category:n,text:d,confidence:c,relevance:o,createdAt:e-v*t,lastRetrievedAt:m===null?null:e-m*t,retrievalCount:p,envId:y,tags:w,origin:"simulated",supersededBy:null,evolution:f})};return i("M-012","R-01","MS-007","Obstacles","Pallet left across Corridor B during early-morning shift change. Required manual abort until cleared by staff.",.72,.66,58,6,11,"wh-a",["corridor-b","obstacle","shift-change"],[{label:"First sighting",ts:e-58*t,text:"Corridor B occasionally blocked.",confidence:.55},{label:"Pattern detected",ts:e-31*t,text:"Corridor B frequently blocked during afternoon operations.",confidence:.74},{label:"Current policy",ts:e-12*t,text:"Prefer Corridor C for Warehouse A missions after 13:00.",confidence:.88}]),i("M-031","R-01","MS-019","Successful Strategies","Rerouted from Corridor B to Corridor C via Junction D; completed Warehouse A inspection without delay.",.93,.81,44,2,18,"wh-a",["corridor-c","reroute","warehouse-a"]),i("M-087","R-01","MS-033","Navigation","Corridor C provides a clear alternative route between Dock Bay and Zone A2 when Corridor B is obstructed.",.9,.87,29,1,22,"wh-a",["corridor-c","alternate-route","warehouse-a"]),i("M-058","R-02","MS-024","Battery","R-02 battery drain increases ~18% when Mapping missions exceed 40 minutes; schedule charge before long mapping tasks.",.81,.7,37,3,9,"wh-a",["battery","mapping"]),i("M-064","R-03","MS-026","Environment","Coolant spill near South Hall junction causes wheel slip; slow to 0.6 m/s and route via North Hall when possible.",.85,.76,33,2,14,"industrial",["coolant","south-hall","slip-hazard"]),i("M-093","R-04","MS-036","Failures","Delivery to Chemical Store failed when Assembly Line conveyor blocked the only planned approach; mission aborted at 70%.",.88,.63,26,8,6,"industrial",["assembly","blocked","delivery-failure"]),i("M-101","R-05","MS-038","Navigation","West Perimeter debris after storms; debris field forces 2-3 minute detour via Tank Farm.",.79,.58,22,5,7,"outdoor",["debris","perimeter","weather"]),i("M-104","R-01","MS-041","Obstacles","Obstacle detected in Corridor B (pallet stack). Corridor C used as alternative; no further issues.",.94,.92,18,0,26,"wh-a",["corridor-b","obstacle","corridor-c","reroute"]),i("M-118","R-01","MS-044","Mission Strategy","For Warehouse A full inspections, start at Zone A1 then Zone A2 via Junction D to minimise backtracking.",.86,.68,14,4,8,"wh-a",["inspection-order","efficiency"]),i("M-127","R-03","MS-047","Safety","Press Bay safety interlock triggers robot pause; wait for operator reset rather than rerouting mid-mission.",.91,.6,11,9,5,"industrial",["press-bay","interlock","safety"]),i("M-133","R-02","MS-049","Operator Preferences","Operator prefers progress pings at each checkpoint instead of continuous streaming during night shifts.",.75,.42,9,null,2,"wh-a",["notifications","night-shift"]),i("M-140","R-05","MS-052","Environment","Mud patch near Tank Farm after rain reduces traction; approach substation via North Perimeter in wet conditions.",.82,.66,6,1,9,"outdoor",["mud","traction","rain"]),i("M-146","R-04","MS-055","Battery","R-04 completed Delivery at critical battery (11%); dock at Charge Station before accepting new missions under 15%.",.77,.55,4,2,4,"industrial",["battery","charging"]),i("M-151","R-01","MS-057","Obstacles","Corridor C was blocked by a conveyor unit during Mission 21; reroute was required back through Corridor B.",.83,.71,2,null,1,"wh-a",["corridor-c","blocked","conflict-candidate"]),i("M-155","R-02","MS-059","Navigation","Rack Row 2 aisle too narrow during restock hours; pass behind Junction D instead.",.8,.61,1,null,1,"wh-a",["racks","restock"]),s}function Si(e,t){var n,d;const s=[],i=Date.now(),a=36e5;for(let c=0;c<24;c++){const o=e[c===0?e.length-1:c%e.length],v=o.envId,m=P(v),p=xe(wi),y=xe(xi[v]),w=(24-c)*(2+G()*5)*a,f=i-w,h=c===0?"active":c===3||c===7?"failed":c===11?"cancelled":"completed";m.nodes.map(_=>_.id);const $=o.envId==="wh-a"?"dock":o.envId==="industrial"?"gate":"base",k=Wt(v,$,y.node),x=18+Math.floor(G()*40),b=h==="completed"?G()>.12?"success":"partial":h==="failed"?"failed":void 0,C=[ue(`m-${Z}`,0,"system","info","Mission created",`Planned ${p.toLowerCase()} route to ${y.name}`)];h!=="cancelled"&&(C.push(ue(`m-${Z}`,.5,"agent","info","Route planned",`${k.length-1} legs via ${k.slice(1,-1).map(_=>{var as;return((as=m.nodes.find($i=>$i.id===_))==null?void 0:as.name)??_}).join(", ")||"direct path"}`)),C.push(ue(`m-${Z}`,1,"sim","info","Mission started",`Robot departed ${(n=m.nodes.find(_=>_.id===$))==null?void 0:n.name}`))),(h==="completed"||h==="failed")&&(C.push(ue(`m-${Z}`,x*.4,"sim",G()>.5?"warning":"info",xe(["Checkpoint reached","Speed reduced near obstacle","Temporary signal drop","Temperature elevated during transit"]))),h==="failed"&&(C.push(ue(`m-${Z}`,x*.7,"sim","critical",xe(["Obstacle blocked planned route","Battery below critical threshold","Communication lost for 4 minutes"]),b==="failed"?"Mission could not continue safely":void 0)),C.push(ue(`m-${Z}`,x*.8,"agent","warning","Abort recommended","No safe alternative available within mission constraints"))),C.push(ue(`m-${Z}`,x,"system",h==="completed"?"success":"critical",h==="completed"?"Mission completed":"Mission failed"))),C.forEach(_=>{_.ts=f+_.id.length*0});const A=t.filter(_=>_.robotId===o.id&&_.envId===v),H=A.slice(0,Math.min(2,A.length)).map(_=>_.id),yi=h==="failed"?[((d=C[C.length-2])==null?void 0:d.title)??"Route blocked"]:G()>.6?["Minor delay — temporary signal drop"]:[];s.push({id:`m-${Z}`,code:`MS-${String(Z).padStart(3,"0")}`,robotId:o.id,type:p,envId:v,destinationNode:y.node,destinationName:y.name,priority:xe(["Low","Normal","Normal","High","Critical"]),mode:G()>.2?"autonomous":"manual",instructions:xe(["Inspect all checkpoints and report anomalies with photos.","Deliver spare parts crate to destination, confirm handover scan.","Patrol the full route twice, log any open doors or leaks.","Build a fresh occupancy map of the destination area.","Record temperature and humidity at each waypoint."]),status:h,outcome:b,progress:h==="completed"?100:h==="active"?42:h==="failed"?ws(55,80):0,createdAt:f-8*6e4,startedAt:f,endedAt:h==="completed"||h==="failed"?f+x*6e4:null,durationSec:x*60,events:C,route:{envId:v,planned:k,current:k,pointIndex:k.length-1},decisions:[],memoryIdsRetrieved:H,memoryIdsCreated:h==="completed"&&G()>.45?[`M-${100+c}`]:[],problems:yi,distanceM:Math.round(zt(v,k)*1.6),plannedVsActualNote:void 0}),Z++}const r=s.find(c=>c.code==="MS-019");r&&(r.memoryIdsRetrieved.includes("M-012")||r.memoryIdsRetrieved.push("M-012"),r.memoryIdsCreated.includes("M-031")||r.memoryIdsCreated.push("M-031"));const l=s[s.length-6];return l&&(l.memoryIdsRetrieved.includes("M-087")||l.memoryIdsRetrieved.push("M-087"),l.memoryIdsCreated.includes("M-104")||l.memoryIdsCreated.push("M-104")),s}function Ii(){const e=Date.now(),t=(s,i,a,r,l,n)=>({id:`al-${s}-${a.replace(/\W+/g,"").slice(0,12)}`,ts:e-s*6e4,severity:i,title:a,detail:r,robotId:l,source:n,reviewed:s>300});return[t(4,"warning","Low battery — R-03","Battery at 24%, below the 30% operating threshold. Charging recommended.","R-03","telemetry"),t(12,"info","Memory retrieved","Memory M-104 (Corridor B obstacle) recalled for Warehouse A mission planning.","R-01","memory"),t(26,"success","Mission completed — MS-059","R-02 finished Rack Row restock navigation.","R-02","mission"),t(47,"critical","Obstacle detected — Corridor B","R-01 detected a pallet blocking Corridor B during inspection.","R-01","mission"),t(58,"warning","Communication warning — R-05","Signal strength dropped to 41% near the drainage basin.","R-05","telemetry"),t(95,"info","Route changed","R-01 rerouted via Corridor C after memory-assisted evaluation.","R-01","mission"),t(140,"warning","Memory conflict detected","M-087 (Corridor C preferred) conflicts with M-151 (Corridor C blocked during Mission 21).",void 0,"memory"),t(220,"critical","Robot offline — R-05","Lost contact for 6 minutes during storm cells; reconnected automatically.","R-05","system"),t(300,"success","Mission completed — MS-055","R-04 delivered parts to Chemical Store via Assembly Line.","R-04","mission"),t(430,"warning","Maintenance required — R-03","Left wheel encoder noise above baseline; inspect within 5 missions.","R-03","system")]}function Ci(){const e=Date.now(),t=[];return[["R-01",9,"Scheduled service","Full diagnostics, wheel alignment, sensor calibration."],["R-02",21,"Firmware update","Upgraded navigation stack to v4.2.1."],["R-03",4,"Battery replacement","Installed new 52Ah pack after capacity test at 71%."],["R-04",35,"Scheduled service","Lidar window cleaned; encoder noise within limits."],["R-05",15,"Track inspection","Replaced left track tensioner after outdoor missions."]].forEach((i,a)=>t.push({id:`pm-${a+1}`,robotId:i[0],ts:e-i[1]*864e5,kind:i[2],notes:i[3]})),t}function Ei(e){const t={};return e.forEach(s=>{const i=[];let a=Math.max(12,s.battery-6);for(let r=24;r>=0;r--)a=Math.min(100,a+(s.status==="charging"?.6:-.15)+G()*.2),i.push({ts:Date.now()-r*10*6e4,battery:Math.round(a*10)/10,speed:s.status==="executing"?.6+G()*.6:0,temperature:s.temperature-2+G()*4,signal:Math.max(20,Math.min(99,s.signal-8+G()*16)),obstacleDistance:s.status==="executing"?.4+G()*3:null,x:s.x,y:s.y});t[s.id]=i}),t}function Ri(){G=Mt(20260929),Z=1,Ms=1;const e=Mi(),t=ki(),s=Si(e,t),i=Ii(),a=Ci(),r=Ei(e),l=s.find(n=>n.status==="active");if(l){const n=e.find(d=>d.id===l.robotId);n&&(n.status="executing",n.currentMissionId=l.id)}return e.forEach(n=>{const d=s.filter(c=>c.robotId===n.id);n.missionCount=Math.max(n.missionCount,d.length+40),n.id==="R-01"?(n.knownStrengths=["Warehouse inspection","Long-distance navigation","Obstacle rerouting"],n.knownIssues=["Battery degradation on missions > 60 min","Occasional lidar sensor warning"],n.learnedPreferences=["Corridor C preferred for Warehouse A","Charging recommended below 20%"]):n.id==="R-03"?(n.knownStrengths=["Industrial patrols","Low-light inspection"],n.knownIssues=["Wheel slip near coolant spills","Battery drains quickly on long routes"],n.learnedPreferences=["Slow to 0.6 m/s near South Hall spill zone"]):n.id==="R-02"?(n.knownStrengths=["Mapping missions","Stable telemetry reporting"],n.knownIssues=["Higher battery drain on Mapping > 40 min"],n.learnedPreferences=["Checkpoint pings instead of continuous streaming at night"]):n.id==="R-04"?(n.knownStrengths=["Delivery handling","Assembly Line navigation"],n.knownIssues=["Arrives at low battery on long deliveries"],n.learnedPreferences=["Dock to charge before accepting missions under 15% battery"]):(n.knownStrengths=["Outdoor perimeter patrols","All-weather tracking"],n.knownIssues=["Signal drops near drainage basin"],n.learnedPreferences=["Use North Perimeter route in wet conditions"])}),{robots:e,missions:s,memories:t,alerts:i,maintenance:a,telemetry:r,seq:{mission:Z,memory:200}}}const Vt="fleetminder.state.v1",Ut="fleetminder.settings.v1";let z,re;const Ve=new Set,Gt=Mt(777),ft={autoAssign:!0,lowBatteryThreshold:30,criticalBatteryThreshold:15,signalWarning:50,maxConcurrentMissions:3,memoryRecallEnabled:!0,memoryAutoSave:!0,memoryMinRelevance:.45,memoryConflictDetection:!0,memoryRetentionDays:180,memoryBackend:"internal",agentPlanningVerbose:!0,agentAutoReroute:!0,agentConfidenceThreshold:.6,simSpeed:1,simEventFrequency:"normal",notificationsMission:!0,notificationsMemory:!0,notificationsBattery:!0,notificationsCritical:!0,operatorName:"K. Ferreira",operatorRole:"Fleet Supervisor",requireReviewForCritical:!0,sessionTimeoutMin:30,telemetryIntervalSec:10};function ks(){const e=Ri();return{robots:e.robots,missions:e.missions,memories:e.memories,alerts:e.alerts,notifications:[],maintenance:e.maintenance,telemetry:e.telemetry,events:[],conflicts:[{id:"cf-1",memoryAId:"M-087",memoryBId:"M-151",topic:"Corridor C usability (Warehouse A)",status:"open",detectedAt:Date.now()-140*6e4}],seqMission:e.seq.mission,seqMemory:e.seq.memory,seqEvent:5e3,seqDecision:100,bootedAt:Date.now(),memRetrievedToday:{day:new Date().toDateString(),count:7}}}function S(){return z||Yt(),z}function D(){return re||Yt(),re}function kt(){try{localStorage.setItem(Vt,JSON.stringify(z)),localStorage.setItem(Ut,JSON.stringify(re))}catch{}}function Yt(){var e;re={...ft};try{const t=localStorage.getItem(Ut);t&&(re={...ft,...JSON.parse(t)})}catch{}try{const t=localStorage.getItem(Vt);if(t){const s=JSON.parse(t);if(s&&Array.isArray(s.robots)&&s.robots.length){z=s,z.memories=(z.memories??[]).map(a=>({...a,origin:"simulated"})),z.notifications=z.notifications??[],z.events=z.events??[],z.conflicts=z.conflicts??[];const i=new Date().toDateString();((e=z.memRetrievedToday)==null?void 0:e.day)!==i&&(z.memRetrievedToday={day:i,count:0});return}}}catch{}z=ks(),kt()}function _e(e){return Ve.add(e),()=>Ve.delete(e)}let Ce=null;function Ss(){Ce||(Ce=setTimeout(()=>{Ce=null,kt()},400))}function ye(){Ce&&(clearTimeout(Ce),Ce=null),kt()}function T(e){const t=S();e(t),Ss(),Ve.forEach(s=>{try{s()}catch{}})}function R(e){re||Yt(),re={...re,...e},Ss(),Ve.forEach(t=>{try{t()}catch{}})}function Is(){try{localStorage.removeItem(Vt),localStorage.removeItem(Ut)}catch{}z=ks(),re={...ft},kt(),Ve.forEach(e=>{try{e()}catch{}})}function Cs(){const e=S();return`MS-${String(e.seqMission).padStart(3,"0")}`}function Ai(){T(e=>{e.seqMission++})}function Es(){const e=S();return`M-${e.seqMemory++}`}function Te(e){return S().robots.find(t=>t.id===e)}function J(){return S().robots}function $e(e,t){T(s=>{const i=s.robots.find(a=>a.id===e);i&&Object.assign(i,t)})}function we(e){return S().missions.find(t=>t.id===e)}function F(){return S().missions}function Ze(){return S().missions.filter(e=>e.status==="active"||e.status==="paused")}function L(e,t){const s=S(),i={...t,id:`ev-${s.seqEvent++}`,missionId:e};return T(a=>{a.events.push(i);const r=a.missions.find(l=>l.id===e);r&&r.events.push(i)}),i}function gt(e){const t=S(),s={...e,id:`ad-${t.seqDecision++}`};return T(i=>{i.seqDecision=i.seqDecision;const a=i.missions.find(r=>r.id===e.missionId);a&&a.decisions.push(s)}),s}function Rs(e,t){T(s=>{const i=s.telemetry[e]??(s.telemetry[e]=[]);i.push(t),i.length>120&&i.splice(0,i.length-120)})}function N(){return S().memories}function Li(e){return S().memories.find(t=>t.id===e)}function _t(e){T(t=>{const s=t.memories.findIndex(i=>i.id===e.id);s>=0?t.memories[s]=e:t.memories.unshift(e)})}function As(e,t=0){if(!e.length)return;const s=Date.now();T(i=>{e.forEach(a=>{const r=i.memories.find(l=>l.id===a);r&&(r.lastRetrievedAt=s,r.retrievalCount++)}),i.memRetrievedToday.count+=t||e.length})}function St(){return S().conflicts}function Ls(e){const t=S(),s={...e,id:`cf-${t.conflicts.length+1}-${Math.floor(Gt()*999)}`};return T(i=>{i.conflicts.unshift(s)}),s}function Ts(e,t,s){T(i=>{const a=i.conflicts.find(r=>r.id===e);if(a&&(a.status="resolved",a.resolvedStrategy=t,a.resolution=s),t==="retire-old"){const r=i.conflicts.find(l=>l.id===e);if(r){const l=i.memories.find(n=>n.id===r.memoryAId);l&&(l.supersededBy=r.memoryBId)}}})}function ce(e){S();const t={...e,id:`al-${Date.now()}-${Math.floor(Gt()*9999)}`,ts:Date.now(),reviewed:!1};return T(s=>{s.alerts.unshift(t),s.alerts.length>120&&s.alerts.pop()}),t}function Ds(e){T(t=>{const s=t.alerts.find(i=>i.id===e);s&&(s.reviewed=!0)})}function Ns(){T(e=>{e.alerts.forEach(t=>{t.reviewed=!0})})}function It(e){S();const t={...e,id:`nt-${Date.now()}-${Math.floor(Gt()*9999)}`,ts:Date.now(),read:!1};return T(s=>{s.notifications.unshift(t),s.notifications.length>60&&s.notifications.pop()}),t}function qs(e){T(t=>{const s=t.notifications.find(i=>i.id===e);s&&(s.read=!0)})}function Ps(){T(e=>{e.notifications.forEach(t=>{t.read=!0})})}function Bs(){T(e=>{e.notifications=[]})}function Ct(){const e=S(),t=e.robots,s=t.filter(c=>c.status!=="offline").length,i=e.missions.filter(c=>c.status==="active").length,a=e.missions.filter(c=>c.status==="completed").length,r=t.filter(c=>c.status==="warning"||c.battery<=D().criticalBatteryThreshold||c.status==="offline").length,l=Math.round(t.reduce((c,o)=>c+o.battery,0)/Math.max(1,t.length)),n=e.missions.filter(c=>c.status==="completed"||c.status==="failed"),d=n.length?Math.round(n.filter(c=>c.outcome==="success").length/n.length*100):100;return{total:t.length,online:s,activeMissions:i,completed:a,attention:r,avgBattery:l,successRate:d,memoriesToday:e.memRetrievedToday.count,paused:e.missions.filter(c=>c.status==="paused").length}}function Ti(){return ze}const Hs=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_SETTINGS:ft,addAlert:ce,addConflict:Ls,addDecision:gt,addNotification:It,addTelemetrySample:Rs,bumpMissionSeq:Ai,clearNotifications:Bs,envList:Ti,fleetStats:Ct,flushPersistence:ye,getActiveMissions:Ze,getConflicts:St,getMemories:N,getMemory:Li,getMission:we,getMissions:F,getRobot:Te,getRobots:J,getSettings:D,getState:S,markAlertReviewed:Ds,markAllAlertsReviewed:Ns,markAllNotificationsRead:Ps,markNotificationRead:qs,mutate:T,nextMemoryId:Es,nextMissionCode:Cs,patchRobot:$e,pushMissionEvent:L,recordMemoryRetrieval:As,resetAllData:Is,resolveConflict:Ts,subscribe:_e,updateSettings:R,upsertMemory:_t},Symbol.toStringTag,{value:"Module"})),Zt=[];function Di(e){Zt.push(e)}function Qt(){const e=location.hash.replace(/^#\/?/,""),[t,s]=e.split("/");return{view:t||"dashboard",param:s}}function I(e){const t=e.startsWith("#")?e:`#/${e}`;location.hash===t?Zt.forEach(s=>{const{view:i,param:a}=Qt();s(i,a)}):location.hash=t}function Ni(){window.addEventListener("hashchange",()=>{const{view:e,param:t}=Qt();Zt.forEach(s=>s(e,t))})}function vt(){return Qt()}const M=(e,t="")=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${t}>${e}</svg>`,os={dashboard:M('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),mission:M('<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>'),play:M('<path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>'),pause:M('<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>'),stop:M('<rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" stroke="none"/>'),sim:M('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3"/>'),fleet:M('<rect x="3" y="5" width="10" height="7" rx="2"/><path d="M6 16h4M5 12v4M11 12v4"/><circle cx="18" cy="15" r="3.5"/><path d="M15 9h6l-2 3"/>'),memory:M('<path d="M12 3a5 5 0 015 5c0 2-1 3-1 5h-8c0-2-1-3-1-5a5 5 0 015-5z"/><path d="M9 16h6M10 19h4"/><circle cx="12" cy="8.5" r="1.6"/>'),history:M('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),analytics:M('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),alert:M('<path d="M12 3l10 17H2z"/><path d="M12 9v5M12 17.5v.5"/>'),agent:M('<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M8 4h8"/><circle cx="9" cy="13" r="1.4" fill="currentColor"/><circle cx="15" cy="13" r="1.4" fill="currentColor"/>'),settings:M('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34h0a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55h0a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v0a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z"/>'),search:M('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),bell:M('<path d="M18 9a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10.3 21a2 2 0 003.4 0"/>'),robot:M('<rect x="5" y="8" width="14" height="10" rx="3"/><circle cx="9.5" cy="13" r="1.3" fill="currentColor"/><circle cx="14.5" cy="13" r="1.3" fill="currentColor"/><path d="M12 8V5M9 5h6"/>'),battery:M('<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M21.5 11v3"/>'),signal:M('<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/>'),temp:M('<path d="M14 14.8V5a2 2 0 10-4 0v9.8a4 4 0 104 0z"/>'),speed:M('<path d="M12 20a8 8 0 118-8" stroke-dasharray="4 3"/><path d="M12 12l5-3"/>'),pin:M('<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),check:M('<path d="M5 13l4 4L19 7"/>'),checkCircle:M('<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5.5"/>'),x:M('<path d="M6 6l12 12M18 6L6 18"/>'),xCircle:M('<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'),warning:M('<path d="M12 3l10 17H2z"/><path d="M12 9v5M12 17.5v.5"/>'),info:M('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>'),brain:M('<path d="M9.5 3A3.5 3.5 0 006 6.5 3.5 3.5 0 004 10a3.5 3.5 0 001.6 2.9A3.5 3.5 0 007 19a3.5 3.5 0 005.5-1h.1A3.5 3.5 0 0018 19a3.5 3.5 0 001.4-6.1A3.5 3.5 0 0021 10a3.5 3.5 0 00-2-3.5A3.5 3.5 0 0014.5 3c-1.6 0-2.4.8-2.5 1.5C11.9 3.8 11.1 3 9.5 3z"/><path d="M12 4.5V21"/>'),link:M('<path d="M10 14a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L11 5.93"/><path d="M14 10a5 5 0 00-7.07 0L4.8 12.12a5 5 0 007.07 7.07L13 18.07"/>'),plus:M('<path d="M12 5v14M5 12h14"/>'),chevronRight:M('<path d="M9 6l6 6-6 6"/>'),chevronDown:M('<path d="M6 9l6 6 6-6"/>'),arrowRight:M('<path d="M4 12h16M13 5l7 7-7 7"/>'),arrowDown:M('<path d="M12 4v16M5 13l7 7 7-7"/>'),refresh:M('<path d="M21 12a9 9 0 11-2.64-6.36"/><path d="M21 3v6h-6"/>'),eye:M('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'),flag:M('<path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/>'),route:M('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8 19h6a4 4 0 000-8H10a4 4 0 010-8h6"/>'),zap:M('<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>'),clock:M('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),users:M('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.6a3.5 3.5 0 010 6.8M21.5 20a6.5 6.5 0 00-4.5-6.1"/>'),wrench:M('<path d="M14.7 6.3a4.5 4.5 0 00-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 006-6L14 13l-3-3z"/>'),activity:M('<path d="M2 12h4l3-8 6 16 3-8h4"/>'),layers:M('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),database:M('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),copy:M('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>'),trash:M('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),download:M('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>'),globe:M('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>'),lock:M('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'),key:M('<circle cx="8" cy="15" r="4.5"/><path d="M11.5 11.5L20 3M16 4l3 3M13 7l3 3"/>'),file:M('<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>'),filter:M('<path d="M3 5h18l-7 8v6l-4-2v-4z"/>'),grid:M('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'),compare:M('<path d="M12 3v18M7 7L3 12l4 5M17 7l4 5-4 5"/>'),rocket:M('<path d="M12 15c-2-1-3-3.5-3-6 0-4 4-7 4-7s4 3 4 7c0 2.5-1 5-3 6"/><path d="M9 14l-3 2 2 2 2-3M15 14l3 2-2 2-2-3"/><circle cx="13" cy="9" r="1.4" fill="currentColor"/>'),demo:M('<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 019 9"/><path d="M12 7v5l3.5 2"/>'),send:M('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>'),merge:M('<path d="M6 3v6a6 6 0 006 6h6"/><path d="M15 12l3 3-3 3"/><circle cx="6" cy="3" r="1.6" fill="currentColor"/>'),eyeOff:M('<path d="M2 12s3.5-7 10-7c2 0 3.7.6 5.1 1.5M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.1-1.5"/><path d="M3 3l18 18"/>'),target:M('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>')};function u(e,t=16){return(os[e]??os.info).replace("<svg ",`<svg width="${t}" height="${t}" `)}function O(e,t="gray",s=!1){return`<span class="badge badge-${t}">${s?'<span class="bdot"></span>':""}${e}</span>`}function Y(e){const t={online:["Online","green"],executing:["Executing","blue"],idle:["Idle","gray"],charging:["Charging","cyan"],warning:["Warning","amber"],offline:["Offline","red"],queued:["Queued","gray"],active:["Active","blue"],paused:["Paused","amber"],completed:["Completed","green"],failed:["Failed","red"],cancelled:["Cancelled","gray"],success:["Success","green"],partial:["Partial","amber"],critical:["Critical","red"],info:["Info","blue"],open:["Open","amber"],resolved:["Resolved","green"],monitoring:["Monitoring","blue"],low:["Low","gray"],normal:["Normal","blue"],high:["High","amber"]},[s,i]=t[e]??[e,"gray"];return O(s,i,!0)}function Os(e){const t={info:"blue",warning:"amber",critical:"red",success:"green"};return O(e.toUpperCase(),t[e]??"gray")}function js(e){return O(e,{Low:"gray",Normal:"blue",High:"amber",Critical:"red"}[e]??"gray")}function Qe(e){const t=e>50?"var(--green)":e>25?"var(--amber)":"var(--red)";return`<div class="batt-cell"><div class="meter"><span style="width:${e}%;background:${t}"></span></div><b class="fs-11 nowrap" style="color:var(--text-2)">${Math.round(e)}%</b></div>`}function Et(e){const t=e>70?"var(--green)":e>45?"var(--amber)":"var(--red)";return`<div class="batt-cell"><div class="meter"><span style="width:${e}%;background:${t}"></span></div><b class="fs-11" style="color:var(--text-2)">${e}%</b></div>`}function de(e,t){const s=e.replace("R-",""),a={"R-01":"#4f8cff","R-02":"#8b7cf6","R-03":"#38d9f5","R-04":"#34d399","R-05":"#fbbf24"}[e]??"#4f8cff";return`<span class="robot-chip"><span class="robot-avatar" style="background:${a}1f;color:${a};border-color:${a}55">${s}</span><span>${e}${t?` · ${t}`:""}</span></span>`}function U(e,t,s){return`<div class="empty-state">
    <div class="es-ico">${u(e,34)}</div>
    <div class="es-title">${t}</div>
    <div class="es-sub">${s}</div>
  </div>`}function V(e,t,s,i={}){return`<div class="stat-card">
    ${i.accent?`<div class="stat-accent-line" style="background:${i.accent}"></div>`:""}
    <div class="stat-top">${u(s,13)}<span>${e}</span></div>
    <div class="stat-value">${t}${i.sub?`<span class="unit">${i.sub}</span>`:""}</div>
    ${i.delta?`<div class="stat-delta"><span class="${i.deltaDir==="down"?"down":"up"}">${i.deltaDir==="down"?"▼":"▲"}</span>${i.delta}</div>`:""}
  </div>`}function Fs(e){var a;Ee();const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
    <div class="modal ${e.wide?"wide":""}" role="dialog" aria-modal="true" aria-label="${e.title}">
      <div class="modal-head"><div class="modal-title">${e.title}</div><button class="modal-x" aria-label="Close">✕</button></div>
      <div class="modal-body">${e.body}</div>
      ${e.footer?`<div class="modal-foot">${e.footer}</div>`:""}
    </div>`;const s=()=>{t.remove(),e.onClose()};t.addEventListener("click",r=>{r.target===t&&s()}),(a=t.querySelector(".modal-x"))==null||a.addEventListener("click",s),document.getElementById("portal-root").appendChild(t);const i=t.querySelector(".modal-foot .btn, .modal-x");return i==null||i.focus(),t}function Ee(){var e;(e=document.querySelector(".modal-overlay"))==null||e.remove()}function Ue(e,t,s,i,a=!1){var l,n;const r=Fs({title:e,body:`<p style="color:var(--text-2);font-size:13px;line-height:1.6">${t}</p>`,footer:`<button class="btn" data-act="cancel">Cancel</button>
             <button class="btn ${a?"btn-danger":"btn-primary"}" data-act="ok">${s}</button>`,onClose:()=>{}});(l=r.querySelector('[data-act="cancel"]'))==null||l.addEventListener("click",()=>Ee()),(n=r.querySelector('[data-act="ok"]'))==null||n.addEventListener("click",()=>{Ee(),i()})}const qi={success:"checkCircle",error:"xCircle",info:"info",warning:"warning"},rs={success:"var(--green)",error:"var(--red)",info:"var(--accent)",warning:"var(--amber)"};function q(e,t,s="",i=3800){var n;const a=document.querySelector(".toast-stack");if(!a)return;const r=document.createElement("div");r.className="toast",r.style.borderLeftColor=rs[e],r.innerHTML=`<span class="toast-ico" style="color:${rs[e]}">${u(qi[e],17)}</span>
    <div><div class="toast-title">${t}</div>${s?`<div class="toast-msg">${s}</div>`:""}</div>
    <button class="toast-x" aria-label="Dismiss">✕</button>`;const l=()=>{r.classList.add("leaving"),setTimeout(()=>r.remove(),180)};(n=r.querySelector(".toast-x"))==null||n.addEventListener("click",l),a.appendChild(r),i>0&&setTimeout(l,i)}function Pi(){if(!document.querySelector(".toast-stack")){const e=document.createElement("div");e.className="toast-stack",document.getElementById("portal-root").appendChild(e)}}function Xe(e){const t=Math.round(e*100),s=t>75?"var(--green)":t>50?"var(--accent)":"var(--amber)";return`<span class="rel-bar" title="Simulated heuristic relevance" aria-label="Simulated relevance score: ${t}%"><span style="width:${t}%;background:${s}"></span></span> ${t}% <span class="fs-10 text-dim" title="Simulated heuristic score">sim.</span>`}function K(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Xt(e){return e?new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—"}function Re(e){return e?new Date(e).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—"}function ie(e){return e?new Date(e).toLocaleDateString([],{month:"short",day:"numeric"}):"—"}function W(e){if(!e)return"never";const t=Date.now()-e,s=Math.floor(t/6e4);if(s<1)return"just now";if(s<60)return`${s}m ago`;const i=Math.floor(s/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function pe(e){if(!e||e<=0)return"—";const t=Math.floor(e/60),s=Math.round(e%60);return t<1?`${s}s`:t<60?`${t}m ${s>0?`${s}s`:""}`.trim():`${Math.floor(t/60)}h ${t%60}m`}function Ws(e){return new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}let X=null,ge=0,Oe=[];function zs(e){je(),X=document.createElement("div"),X.className="cmdk-overlay",X.innerHTML=`
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Global search">
      <div class="cmdk-input">${u("search",17)}<input type="text" placeholder="Search robots, missions, memories, events…" aria-label="Search query" /></div>
      <div class="cmdk-list"></div>
      <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
    </div>`;const t=X.querySelector("input"),s=X.querySelector(".cmdk-list"),i=()=>{Oe=Bi(t.value),Lt(s)};t.addEventListener("input",i),t.addEventListener("keydown",a=>{var r;a.key==="ArrowDown"?(a.preventDefault(),ge=Math.min(Oe.length-1,ge+1),Lt(s,e,!0)):a.key==="ArrowUp"?(a.preventDefault(),ge=Math.max(0,ge-1),Lt(s,e,!0)):a.key==="Enter"&&(a.preventDefault(),(r=Oe[ge])==null||r.onPick(),je())}),X.addEventListener("click",a=>{a.target===X&&je()}),document.getElementById("portal-root").appendChild(X),t.focus(),i()}function Lt(e,t,s=!1){if(!Oe.length){e.innerHTML='<div class="cmdk-empty">No matches found. Try a robot ID (R-01), mission code (MS-), or memory ID (M-).</div>';return}const i=new Map;Oe.forEach(r=>{const l=r.type;i.has(l)||i.set(l,[]),i.get(l).push(r)}),e.innerHTML="";let a=0;i.forEach((r,l)=>{e.insertAdjacentHTML("beforeend",`<div class="cmdk-group-label">${l}s</div>`),r.forEach(n=>{const d=document.createElement("button");d.className=`cmdk-item ${a===ge?"sel":""}`,d.innerHTML=`<span class="ci-ico">${u(n.icon,15)}</span><span>${K(n.title)} <span class="text-dim">· ${K(n.sub)}</span></span><span class="ci-type">${n.type}</span>`,d.addEventListener("click",()=>{n.onPick(),je()}),d.addEventListener("mousemove",()=>{}),e.appendChild(d),a++})})}function je(){X==null||X.remove(),X=null,ge=0}function Bi(e){const t=e.trim().toLowerCase(),s=[],i=n=>{window.dispatchEvent(new CustomEvent("fleetminder:navigate",{detail:n}))};J().forEach(n=>{(!t||`${n.id} ${n.name} ${n.model} ${n.status}`.toLowerCase().includes(t))&&s.push({type:"robot",id:n.id,title:`${n.id} ${n.name}`,sub:`${n.model} · ${n.status} · ${n.battery}%`,route:`fleet/${n.id}`,icon:"robot",onPick:()=>i(`fleet/${n.id}`)})}),F().forEach(n=>{(!t||`${n.code} ${n.type} ${n.destinationName} ${n.status} ${n.robotId}`.toLowerCase().includes(t))&&s.push({type:"mission",id:n.id,title:`${n.code} — ${n.type}`,sub:`${n.robotId} → ${n.destinationName} · ${n.status}`,route:`missions/${n.id}`,icon:"mission",onPick:()=>i(`missions/${n.id}`)})}),N().forEach(n=>{(!t||`${n.id} ${n.category} ${n.text} ${n.robotId} ${n.tags.join(" ")}`.toLowerCase().includes(t))&&s.push({type:"memory",id:n.id,title:`${n.id} — ${n.category}`,sub:`${n.robotId} · ${W(n.createdAt)}`,route:`memory/${n.id}`,icon:"memory",onPick:()=>i(`memory/${n.id}`)})});const a=S(),r=new Map(a.missions.map(n=>[n.id,n]));return new Map(a.missions.flatMap(n=>n.events).concat(a.events).map(n=>[n.id,n])).forEach(n=>{const d=r.get(n.missionId),c=`${n.title} ${n.detail??""} ${(d==null?void 0:d.code)??""} ${(d==null?void 0:d.robotId)??""}`.toLowerCase();(!t||c.includes(t))&&s.push({type:"event",id:n.id,title:n.title,sub:`${(d==null?void 0:d.code)??n.missionId} · ${(d==null?void 0:d.robotId)??"Fleet"} · ${W(n.ts)}`,route:d?`missions/${d.id}`:"alerts",icon:"activity",onPick:()=>i(d?`missions/${d.id}`:"alerts")})}),a.alerts.forEach(n=>{const d=`${n.title} ${n.detail} ${n.robotId??""} ${n.severity}`.toLowerCase();(!t||d.includes(t))&&s.push({type:"alert",id:n.id,title:n.title,sub:`${n.severity.toUpperCase()} · ${n.robotId??"Fleet"} · ${W(n.ts)}`,route:"alerts",icon:"alert",onPick:()=>i("alerts")})}),s.slice(0,24)}function Hi(e){const t=Ct(),s=J(),i=F(),a=N(),r=Ze(),l=i.slice(0,6);a.slice(0,4);const n=s.some(d=>d.status==="offline"||d.battery<20);e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Command Center</h1>
          <div class="vsub">Fleet overview and live learning-loop status. All robot data is simulated; memory flows are real application state.</div>
        </div>
        <div class="view-head-actions">
          <span class="live-pill ${n?"paused":""}"><span class="ldot"></span>${n?"Degraded":"All systems live"}</span>
          <button class="btn btn-primary" data-nav="mission">${u("plus",14)} New Mission</button>
        </div>
      </div>

      <div class="stat-grid">
        ${V("Total Robots",t.total,"robot",{accent:"var(--accent)"})}
        ${V("Online",t.online,"signal",{delta:`${t.total-t.online} offline`,deltaDir:"down"})}
        ${V("Active Missions",t.activeMissions+t.paused,"mission",{accent:"var(--accent-2)",sub:t.paused?` (${t.paused} paused)`:""})}
        ${V("Completed",t.completed,"checkCircle",{})}
        ${V("Needs Attention",t.attention,"warning",{accent:t.attention?"var(--amber)":void 0})}
        ${V("Avg Battery",t.avgBattery,"battery",{sub:"%",accent:t.avgBattery<50?"var(--amber)":"var(--green)"})}
        ${V("Success Rate",t.successRate,"target",{sub:"%"})}
        ${V("Memories Today",t.memoriesToday,"brain",{accent:"var(--accent-2)"})}
      </div>

      <div class="grid-2-1 mt">
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">${u("fleet",15)} Fleet Overview</div>
              <div class="panel-sub">Live robot status — updates with the simulation tick</div>
            </div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="fleet">Manage fleet ${u("chevronRight",12)}</button></div>
          </div>
          <div class="panel-body tight">
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>Robot</th><th>Status</th><th>Battery</th><th>Current Mission</th><th>Location</th><th>Signal</th><th>Last Activity</th></tr></thead>
                <tbody>
                  ${s.map(d=>{const c=i.find(o=>o.id===d.currentMissionId);return`<tr class="clickable" data-robot-row="${d.id}" data-nav="fleet/${d.id}">
                      <td><div class="td-main">${de(d.id,d.name)}</div><div class="robot-id">${d.model}</div></td>
                      <td>${Y(d.status)}</td>
                      <td>${Qe(d.battery)}</td>
                      <td>${c?`<span class="tag" data-nav="mission/${c.id}">${c.code}</span>`:'<span class="text-dim">—</span>'}</td>
                      <td>${d.location}</td>
                      <td>${Et(d.signal)}</td>
                      <td class="nowrap text-dim">${W(new Date(d.lastActivity).getTime())}</td>
                    </tr>`}).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div><div class="panel-title">${u("activity",15)} System Status</div></div></div>
            <div class="panel-body">
              <div class="flex" style="gap:10px"><span class="status-dot ${n?"degraded":""}" id="dashboard-status-dot"></span><div><b style="color:var(--text-1)" id="dashboard-status-label">${n?"Degraded — attention needed":"Operational"}</b><div class="fs-11 text-dim" id="dashboard-active-label">Simulation engine running · ${r.length} mission(s) in flight</div></div></div>
              <hr class="divider" />
              <div class="kv-list">
                  <div class="kv-row"><span class="k">Simulation engine</span><span class="v" id="dashboard-engine-state">${r.length?"Active":"Standby"}</span></div>
                <div class="kv-row"><span class="k">Memory provider</span><span class="v">Internal simulated store</span></div>
                <div class="kv-row"><span class="k">Memory recall</span><span class="v">${D().memoryRecallEnabled?"Enabled":"Disabled"}</span></div>
                  <div class="kv-row"><span class="k">Sim speed</span><span class="v" id="dashboard-sim-speed">${D().simSpeed}×</span></div>
              </div>
              <button class="btn btn-sm btn-block mt-8" data-nav="settings">${u("settings",13)} Open settings</button>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div><div class="panel-title">${u("brain",15)} Memory Pulse</div><div class="panel-sub">Latest persistent experiences</div></div></div>
            <div class="panel-body" id="dashboard-memory-pulse">
                ${Vs()}
            </div>
          </section>
        </div>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head">
            <div><div class="panel-title">${u("mission",15)} Recent Missions</div></div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="missions">History ${u("chevronRight",12)}</button></div>
          </div>
          <div class="panel-body tight">
            <table class="data-table">
              <thead><tr><th>Mission</th><th>Robot</th><th>Status</th><th>Progress</th><th>Started</th></tr></thead>
                <tbody>
                ${l.map(d=>`<tr class="clickable" data-mission-row="${d.id}" data-nav="mission/${d.id}">
                  <td><div class="td-main">${d.code}</div><div class="fs-11 text-dim">${d.type} → ${d.destinationName}</div></td>
                  <td>${de(d.robotId)}</td>
                  <td>${Y(d.status)}</td>
                  <td style="min-width:90px">${d.status==="active"||d.status==="paused"?`<div class="meter"><span style="width:${d.progress}%;background:var(--accent)"></span></div><span class="fs-11 text-dim">${Math.round(d.progress)}%</span>`:`<span class="fs-11 text-dim">${d.outcome??d.status}</span>`}</td>
                  <td class="nowrap text-dim">${Xt(d.startedAt)}</td>
                </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><div class="panel-title">${u("alert",15)} Recent Alerts</div></div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="alerts">Event center ${u("chevronRight",12)}</button></div>
          </div>
          <div class="panel-body tight" id="dashboard-recent-alerts">
            ${Us()}
          </div>
        </section>
      </div>
    </div>`,Pt(e)}function ds(){var h,$,k;const e=document.getElementById("content");if(!(e!=null&&e.querySelector(".view")))return;const t=Ct(),s=J(),i=F(),a=N(),r=Ze(),l=e.querySelectorAll(".stat-card .stat-value"),n=[`${t.total}`,`${t.online}`,`${t.activeMissions+t.paused}<span class="unit">${t.paused?` (${t.paused} paused)`:""}</span>`,`${t.completed}`,`${t.attention}`,`${t.avgBattery}<span class="unit">%</span>`,`${t.successRate}<span class="unit">%</span>`,`${t.memoriesToday}`];l.forEach((x,b)=>{n[b]!==void 0&&(x.innerHTML=n[b])});const d=t.total-t.online,c=($=(h=l[1])==null?void 0:h.closest(".stat-card"))==null?void 0:$.querySelector(".stat-delta");c&&(c.innerHTML=`<span class="${d?"down":"up"}">${d?"▼":"▲"}</span>${d} offline`),s.forEach(x=>{const b=e.querySelector(`[data-robot-row="${x.id}"]`);if(!b)return;const C=i.find(A=>A.id===x.currentMissionId);b.cells[1].innerHTML=Y(x.status),b.cells[2].innerHTML=Qe(x.battery),b.cells[3].innerHTML=C?`<span class="tag" data-nav="mission/${C.id}">${C.code}</span>`:'<span class="text-dim">—</span>',b.cells[4].textContent=x.location,b.cells[5].innerHTML=Et(x.signal),b.cells[6].textContent=W(new Date(x.lastActivity).getTime()),Pt(b)}),i.slice(0,6).forEach(x=>{const b=e.querySelector(`[data-mission-row="${x.id}"]`);b&&(b.cells[2].innerHTML=Y(x.status),b.cells[3].innerHTML=x.status==="active"||x.status==="paused"?`<div class="meter"><span style="width:${x.progress}%;background:var(--accent)"></span></div><span class="fs-11 text-dim">${Math.round(x.progress)}%</span>`:`<span class="fs-11 text-dim">${x.outcome??x.status}</span>`,b.cells[4].textContent=Xt(x.startedAt))});const o=s.some(x=>x.status==="offline"||x.battery<20);(k=e.querySelector("#dashboard-status-dot"))==null||k.classList.toggle("degraded",o);const v=e.querySelector("#dashboard-status-label");v&&(v.textContent=o?"Degraded — attention needed":"Operational");const m=e.querySelector("#dashboard-active-label");m&&(m.textContent=`Simulation engine running · ${r.length} mission(s) in flight`);const p=e.querySelector("#dashboard-engine-state");p&&(p.textContent=r.length?"Active":"Standby");const y=e.querySelector("#dashboard-sim-speed");y&&(y.textContent=`${D().simSpeed}×`);const w=e.querySelector("#dashboard-recent-alerts");w&&(w.innerHTML=Us());const f=e.querySelector("#dashboard-memory-pulse");f&&(f.innerHTML=Vs(a),Pt(f))}function Vs(e=N()){const t=e.slice(0,4);return`${t.length?t.map(s=>`
    <div class="mem-card mb-8 clickable" data-nav="memory/${s.id}" role="button" tabindex="0">
      <div class="mem-head"><span class="mem-id">${s.id}</span>${O(s.category,"violet")}<span class="ml-auto fs-11 text-dim">${W(s.createdAt)}</span></div>
      <div class="mem-text clamp-2">${s.text}</div>
    </div>`).join(""):U("memory","No memories yet","Complete missions to build experience.")}
    <button class="btn btn-sm btn-block" data-nav="memory">${u("memory",13)} Persistent Memory Center</button>`}function Pt(e){e.querySelectorAll("[data-nav]").forEach(t=>{t.dataset.navBound||(t.dataset.navBound="true",t.addEventListener("click",s=>{s.stopPropagation(),I(t.dataset.nav)}))})}function Us(){const e=S().alerts.slice(0,5);return e.length?e.map(t=>`
    <div class="kv-row" style="padding:9px 16px">
      <span class="flex" style="gap:8px">${u(Oi(t.severity),14)}<span><span style="color:var(--text-1);font-weight:600">${t.title}</span><div class="fs-11 text-dim">${t.detail}</div></span></span>
      <span class="fs-11 text-dim nowrap">${W(t.ts)}</span>
    </div>`).join(""):U("checkCircle","No alerts","The fleet is operating normally.")}function Oi(e){return e==="critical"?"xCircle":e==="warning"?"warning":e==="success"?"checkCircle":"info"}function ji(e,t){const s=new Set(["the","a","an","is","was","and","or","of","to","in","on","during","when","for","with","at","by"]),i=e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(n=>n&&!s.has(n)),a=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(n=>n&&!s.has(n));if(!i.length||!a.length)return 0;const r=new Set(a);let l=0;return i.forEach(n=>{r.has(n)&&l++}),l/Math.sqrt(i.length*a.length)}function De(e){const t=D(),s=Date.now(),i=t.memoryRetentionDays*864e5,a=N().filter(n=>!n.supersededBy&&s-n.createdAt<=i),r=e.minRelevance??t.memoryMinRelevance,l=[];return a.forEach(n=>{let d=n.relevance*.5+n.confidence*.2;const c=[];if(e.envId&&n.envId===e.envId&&(d+=.18,c.push(`Same environment (${n.envId})`)),e.robotId&&n.robotId===e.robotId?(d+=.14,c.push(`Direct experience of ${e.robotId}`)):e.robotId&&(d-=.08),e.destinationNode&&n.tags.some(v=>e.destinationNode.replace(/-/g,"").includes(v.replace(/-/g,"")))&&(d+=.1,c.push("Destination mentioned")),e.text){const v=ji(e.text,n.text);v>.15&&(d+=v*.35,c.push(`Content overlap ${(v*100).toFixed(0)}%`))}e.missionType&&n.category==="Mission Strategy"&&e.missionType==="Inspection"&&(d+=.04);const o=(s-n.createdAt)/864e5;d+=Math.max(0,.08-o*.002),d>=r&&l.push({memory:n,score:Math.min(1,d),reasons:c.slice(0,2)})}),l.sort((n,d)=>d.score-n.score),{backend:"internal",hits:l.slice(0,e.limit??4),searchedAt:Date.now()}}function Fi(e){const t={id:Es(),robotId:e.robotId,missionId:e.missionId,missionCode:e.missionCode,category:e.category,text:e.text,confidence:e.confidence??.85,relevance:e.relevance??.7,createdAt:Date.now(),lastRetrievedAt:null,retrievalCount:0,envId:e.envId,tags:e.tags,origin:"simulated",supersededBy:null};return _t(t),D().notificationsMemory&&It({severity:"success",title:"New memory created",body:`${t.id} — ${t.text.slice(0,90)}${t.text.length>90?"…":""}`,route:{view:"memory",id:t.id}}),Vi(t),t}function Wi(e,t){const s=N().find(a=>a.id===e);if(!s)return;const i={...s,text:t.text,confidence:t.confidence,relevance:Math.min(1,s.relevance+.03),evolution:[...s.evolution??[],{...t,ts:Date.now()}]};_t(i)}const zi=[["blocked","clear"],["preferred","blocked"],["successful","failed"],["passable","closed"],["alternative","only route"]];function Vi(e){if(!D().memoryConflictDetection)return;N().filter(i=>i.id!==e.id&&i.robotId===e.robotId&&!i.supersededBy).forEach(i=>{const a=i.tags.filter(c=>e.tags.includes(c));if(a.length<1)return;const r=i.text.toLowerCase(),l=e.text.toLowerCase();!zi.some(([c,o])=>r.includes(c)&&l.includes(o)||r.includes(o)&&l.includes(c))||St().some(c=>c.status==="open"&&(c.memoryAId===i.id&&c.memoryBId===e.id||c.memoryAId===e.id&&c.memoryBId===i.id))||Ls({memoryAId:i.id,memoryBId:e.id,topic:`${a[0].replace(/-/g," ")} (${i.envId})`,status:"open",detectedAt:Date.now()})})}function Gs(e){As(e,1)}const Ae=[{id:"clean",name:"Scenario 1 — Clean run",desc:"Successful mission with no disruptions. Baseline behavior."},{id:"obstacle",name:"Scenario 2 — Obstacle + memory reroute",desc:"Obstacle appears mid-route. Memory-assisted rerouting is demonstrated."},{id:"battery",name:"Scenario 3 — Low battery",desc:"Battery drains faster; low-battery warnings and conservative speed."},{id:"comms",name:"Scenario 4 — Communication warning",desc:"Signal degrades mid-route; connectivity events and delayed reporting."},{id:"conflict",name:"Scenario 5 — Conflicting history",desc:"Historical memories disagree; the agent explains how it resolves them."}],j=new Map;let ve=null;const Fe=Mt(4242);function Ge(e){return j.get(e)}function Ui(){ve&&clearInterval(ve),ve=null,j.clear()}function Ys(){S().missions.filter(t=>t.status==="active"||t.status==="paused").forEach(t=>{var r,l,n;if(j.has(t.id))return;const s=((r=t.route)==null?void 0:r.current)??[];if(!s.length)return;const i=Math.max(1,s.length-1),a=t.events;j.set(t.id,{missionId:t.id,scenarioId:t.scenarioId??"clean",path:[...s],plannedPath:[...((l=t.route)==null?void 0:l.planned)??s],segIndex:Math.min(i-1,Math.floor(t.progress/100*i)),segProgress:Math.min(99.4,t.progress),speedFactor:a.some(d=>d.title==="Battery drain above forecast")?.8:1,obstacleFired:a.some(d=>d.title==="Obstacle detected"),batteryFired:a.some(d=>d.title==="Battery drain above forecast"),commsFired:a.some(d=>d.title==="Signal degradation"),conflictHandled:a.some(d=>d.title==="Conflicting historical experiences detected"),rerouted:s.join("|")!==(((n=t.route)==null?void 0:n.planned)??s).join("|"),memoryUsed:t.memoryIdsRetrieved.length>0,tickCount:0,paused:t.status==="paused",finished:!1,envId:t.envId,robotId:t.robotId,problemLog:[...t.problems]})}),j.size&&Jt()}function Jt(){ve||(ve=setInterval(Zi,900))}function Kt(){j.size===0&&ve&&(clearInterval(ve),ve=null)}function es(e){if(!Te(e.robotId))throw new Error("Robot not found");const s=Cs(),i={id:`m-${s.toLowerCase()}-${Date.now()%1e5}`,code:s,robotId:e.robotId,type:e.type,envId:e.envId,destinationNode:e.destinationNode,destinationName:e.destinationName,priority:e.priority,mode:e.mode,instructions:e.instructions,status:"queued",progress:0,createdAt:Date.now(),startedAt:null,endedAt:null,durationSec:0,events:[],route:null,decisions:[],memoryIdsRetrieved:[],memoryIdsCreated:[],problems:[],distanceM:0,scenarioId:e.scenarioId};return T(a=>{a.missions.unshift(i),a.seqMission++}),i}function Gi(e){var l,n;const t=P(e.envId),s=_s(e.robotId,e.envId),i=Wt(e.envId,s,e.destinationNode),a=D(),r=j.get(e.id);if(L(e.id,{ts:Date.now(),kind:"system",severity:"info",title:"Mission received",detail:`${e.type} to ${e.destinationName} • Priority: ${e.priority} • Mode: ${e.mode}`}),L(e.id,{ts:Date.now()+1,kind:"agent",severity:"info",title:`Robot ${e.robotId} selected`,detail:"Mission parameters validated against fleet availability."}),L(e.id,{ts:Date.now()+2,kind:"agent",severity:"info",title:"Destination analyzed",detail:`${t.name} → ${((l=t.nodes.find(d=>d.id===e.destinationNode))==null?void 0:l.name)??e.destinationNode}. Planned distance ${Math.round(zt(e.envId,i)*1.6)} m.`}),a.memoryRecallEnabled){L(e.id,{ts:Date.now()+3,kind:"agent",severity:"info",title:"Searching previous mission experiences…"});const d=De({robotId:e.robotId,envId:e.envId,destinationNode:e.destinationNode,missionType:e.type,text:`${e.type} ${e.destinationName} ${t.name}`,limit:4});if(Gs(d.hits.map(c=>c.memory.id)),d.hits.length){L(e.id,{ts:Date.now()+4,kind:"memory",severity:"info",title:`${d.hits.length} relevant experience${d.hits.length>1?"s":""} found`,detail:d.hits.map(p=>`${p.memory.id} · ${(p.score*100).toFixed(0)}% relevance — ${p.memory.text}`).join(`
`),memoryIds:d.hits.map(p=>p.memory.id)}),e.memoryIdsRetrieved.push(...d.hits.filter(p=>!e.memoryIdsRetrieved.includes(p.memory.id)).map(p=>p.memory.id));const c=/blocked|obstruct(?:ed|ion)?|obstacle|slip|debris|spill|pallet|hazard/g,o=p=>{const y=p.toLowerCase().split(/[.!?;\n]+/);return i.find(w=>{var h;const f=(((h=t.nodes.find($=>$.id===w))==null?void 0:h.name)??w).toLowerCase();return y.some($=>{const k=$.indexOf(f);return k>=0&&Array.from($.matchAll(c)).some(x=>Math.abs(k-(x.index??0))<=40)})})},v=d.hits.map(p=>({hit:p,blockedNode:o(p.memory.text)})).find(p=>p.blockedNode),m=v==null?void 0:v.hit;if(m&&a.agentAutoReroute&&e.scenarioId!=="obstacle"&&m.score<a.agentConfidenceThreshold&&L(e.id,{ts:Date.now()+5,kind:"agent",severity:"warning",title:"Memory confidence below route threshold",detail:`${m.memory.id} scored ${(m.score*100).toFixed(0)}% simulated relevance, below the configured ${(a.agentConfidenceThreshold*100).toFixed(0)}% threshold. The agent will verify conditions before rerouting.`,memoryIds:[m.memory.id]}),m&&a.agentAutoReroute&&e.scenarioId!=="obstacle"&&m.score>=a.agentConfidenceThreshold){const p=v==null?void 0:v.blockedNode;if(p&&p!==e.destinationNode&&p!==s){const y=xs(e.envId,s,e.destinationNode,p),w=y.map($=>{var k;return((k=t.nodes.find(x=>x.id===$))==null?void 0:k.name)??$}),f=i.map($=>{var k;return((k=t.nodes.find(x=>x.id===$))==null?void 0:k.name)??$}),h=f.filter($=>!w.includes($));h.length&&(L(e.id,{ts:Date.now()+5,kind:"agent",severity:"warning",title:`${((n=t.nodes.find($=>$.id===p))==null?void 0:n.name)??p} identified as previous risk`,detail:`Memory ${m.memory.id}: “${m.memory.text}”`,memoryIds:[m.memory.id]}),L(e.id,{ts:Date.now()+6,kind:"decision",severity:"success",title:`Preemptive route selected: ${w.filter($=>!f.includes($)).join(", ")||"alternative path"}`,detail:`Agent is using previous experience to avoid ${h.join(", ")} before the obstacle is encountered.`}),gt({missionId:e.id,ts:Date.now(),phase:"planning",decision:`Route via ${w.join(" → ")} avoiding ${h.join(", ")}`,rationale:`Memory ${m.memory.id} reports a prior obstruction on the originally planned path. Confidence ${(m.score*100).toFixed(0)}%.`,sourceMemories:[m.memory.id],confidence:m.score,outcome:"Applied during planning"}),i.length=0,i.push(...y),r&&(r.rerouted=!0,r.memoryUsed=!0,r.path=[...y]))}}}else L(e.id,{ts:Date.now()+4,kind:"memory",severity:"info",title:"No strongly relevant experiences found",detail:"The agent will build fresh experience during this mission."})}else L(e.id,{ts:Date.now()+3,kind:"system",severity:"info",title:"Memory recall disabled in settings",detail:"Planning without historical context."});return L(e.id,{ts:Date.now()+7,kind:"agent",severity:"info",title:"Mission execution ready",detail:`Route: ${i.map(d=>{var c;return((c=t.nodes.find(o=>o.id===d))==null?void 0:c.name)??d}).join(" → ")}`}),i}function _s(e,t){var a;const s=P(t),i=Te(e);if(i&&i.envId===t){const r=s.nodes.find(l=>l.name===i.location);if(r)return r.id}return((a=s.nodes.find(r=>r.kind==="dock"))==null?void 0:a.id)??s.nodes[0].id}function Rt(e,t,s=!1){var c;if(e.status==="active"||e.status==="paused")return;const i=Te(e.robotId);if(!i)throw new Error("Robot not found");if(i.status==="offline"||i.status==="charging"||i.status==="executing"||i.currentMissionId)throw new Error(`${i.id} is not available for another mission.`);const a=D();if(S().missions.filter(o=>o.status==="active"||o.status==="paused").length>=Math.max(1,a.maxConcurrentMissions))throw new Error(`Maximum ${a.maxConcurrentMissions} concurrent missions reached.`);if(e.priority==="Critical"&&a.requireReviewForCritical&&!s)throw new Error("Operator review is required before starting a Critical-priority mission.");const l=t??e.scenarioId??"clean",n=Gi(e);T(o=>{var p;const v=o.missions.find(y=>y.id===e.id),m=o.robots.find(y=>y.id===e.robotId);v&&(v.status="active",v.startedAt=Date.now(),v.progress=0,v.route={envId:v.envId,planned:n,current:[...n],pointIndex:0},v.distanceM=Math.round(zt(v.envId,n)*1.6),v.scenarioId=l),m&&(m.status="executing",m.currentMissionId=e.id,m.location=((p=P(e.envId).nodes.find(y=>y.id===n[0]))==null?void 0:p.name)??m.location)});const d=be(e.envId,n[0]);$e(e.robotId,{x:d.x,y:d.y}),j.set(e.id,{missionId:e.id,scenarioId:l,path:[...n],plannedPath:[...n],segIndex:0,segProgress:0,speedFactor:1,obstacleFired:!1,batteryFired:!1,commsFired:!1,conflictHandled:!1,rerouted:!1,memoryUsed:!1,tickCount:0,paused:!1,finished:!1,envId:e.envId,robotId:e.robotId,problemLog:[]}),L(e.id,{ts:Date.now(),kind:"sim",severity:"success",title:"Mission started",detail:`${e.robotId} departed ${(c=P(e.envId).nodes.find(o=>o.id===n[0]))==null?void 0:c.name}.`}),Jt(),ye()}function Yi(e){const t=j.get(e);!t||t.finished||(t.paused=!0,L(e,{ts:Date.now(),kind:"system",severity:"warning",title:"Mission paused by operator"}),T(s=>{const i=s.missions.find(a=>a.id===e);i&&(i.status="paused")}),$e(t.robotId,{status:"idle"}),ye())}function _i(e){const t=j.get(e);!t||t.finished||(t.paused=!1,L(e,{ts:Date.now(),kind:"system",severity:"info",title:"Mission resumed"}),T(s=>{const i=s.missions.find(a=>a.id===e);i&&(i.status="active")}),$e(t.robotId,{status:"executing"}),Jt(),ye())}function Zs(e){const t=j.get(e);T(s=>{const i=s.missions.find(r=>r.id===e);i&&(i.status="cancelled",i.endedAt=Date.now(),i.startedAt&&(i.durationSec=Math.round((Date.now()-i.startedAt)/1e3)),i.outcome=void 0);const a=s.robots.find(r=>r.id===(i==null?void 0:i.robotId));a&&(a.status="idle",a.currentMissionId=null)}),t&&(t.finished=!0,j.delete(e)),L(e,{ts:Date.now(),kind:"system",severity:"warning",title:"Mission cancelled by operator"}),Kt(),ye()}function Zi(){const e=D(),t=Math.max(.25,e.simSpeed);j.forEach(s=>{if(s.paused||s.finished)return;s.tickCount++;const i=we(s.missionId),a=Te(s.robotId);!i||!a||i.status!=="active"||(Qi(s,t),!s.finished&&(Xi(s,i,a),Ji(s,i,a),s.tickCount%10===0&&en()))})}function Qi(e,t){var p;const s=we(e.missionId);if(!s)return;const i=P(e.envId),a=Math.max(1,e.path.length-1);e.segProgress+=3.4*t*e.speedFactor;const r=Math.min(99.4,e.segProgress);if(e.segProgress>=99.4){T(y=>{const w=y.missions.find(h=>h.id===s.id),f=y.robots.find(h=>h.id===e.robotId);w&&(w.progress=99.4,w.route&&(w.route.pointIndex=w.route.current.length-1)),f&&(f.speed=0)}),Qs(s.id);return}const l=r/100*a,n=Math.min(a-1,Math.floor(l)),d=l-n;if(n!==e.segIndex&&e.path[n+1]){e.segIndex=n;const y=e.path[n],w=((p=i.nodes.find(f=>f.id===y))==null?void 0:p.name)??y;L(s.id,{ts:Date.now(),kind:"sim",severity:"info",title:`Checkpoint reached — ${w}`,atNode:y})}const c=be(e.envId,e.path[n]),o=be(e.envId,e.path[Math.min(e.path.length-1,n+1)]),v=c.x+(o.x-c.x)*d,m=c.y+(o.y-c.y)*d;T(y=>{const w=y.missions.find(h=>h.id===s.id),f=y.robots.find(h=>h.id===e.robotId);w&&(w.progress=r,w.route&&(w.route.current=[...e.path],w.route.pointIndex=n)),f&&(f.x=v,f.y=m,f.speed=.8*t*e.speedFactor)})}function Xi(e,t,s){var l;const i=t.progress,a=D();if(e.scenarioId==="obstacle"&&!e.obstacleFired&&i>18&&e.path.length>2){e.obstacleFired=!0;const n=P(e.envId),d=Math.min(e.path.length-2,e.segIndex+1),c=e.path[d],o=((l=n.nodes.find(f=>f.id===c))==null?void 0:l.name)??c;L(t.id,{ts:Date.now(),kind:"sim",severity:"critical",title:"Obstacle detected",detail:`${o} is obstructed — unplanned pallet stack on the path.`,atNode:c}),ce({severity:"critical",title:"Obstacle detected",detail:`${s.id} found ${o} blocked during ${t.code}.`,robotId:s.id,missionId:t.id,source:"mission"}),e.problemLog.push(`Obstacle at ${o}`),L(t.id,{ts:Date.now(),kind:"agent",severity:"info",title:"Evaluating previous mission experiences…"});const v=De({robotId:s.id,envId:e.envId,destinationNode:t.destinationNode,text:`obstacle blocked ${o}`,limit:3});Gs(v.hits.map(f=>f.memory.id)),v.hits.length&&(L(t.id,{ts:Date.now(),kind:"memory",severity:"info",title:"Relevant memory retrieved",detail:v.hits.map(f=>`${f.memory.id} (${(f.score*100).toFixed(0)}% simulated relevance): ${f.memory.text}`).join(`
`),memoryIds:v.hits.map(f=>f.memory.id)}),v.hits.forEach(f=>{t.memoryIdsRetrieved.includes(f.memory.id)||t.memoryIdsRetrieved.push(f.memory.id)}));const m=v.hits.filter(f=>f.score>=a.agentConfidenceThreshold),p=m.length>0,y=xs(e.envId,e.path[e.segIndex],t.destinationNode,c),w=y.map(f=>{var h;return((h=n.nodes.find($=>$.id===f))==null?void 0:h.name)??f});e.path=[...e.path.slice(0,e.segIndex+1),...y.slice(1)],e.rerouted=!0,e.memoryUsed=p,L(t.id,{ts:Date.now(),kind:"decision",severity:"success",title:`Alternative route selected: ${w.filter(f=>f!==o).slice(0,3).join(", ")}`,detail:p?"Route adapted using previous experience. Route updated on the map.":v.hits.length?"Retrieved memories were below the configured threshold; agent selected a safe alternative from map topology.":"No directly relevant memory found — agent selected a safe alternative from map topology."}),gt({missionId:t.id,ts:Date.now(),phase:"execution",decision:`Reroute via ${w.join(" → ")} avoiding ${o}`,rationale:p?`Retrieved memory reported a prior obstruction near ${o}; the alternative matches the previously successful strategy.`:"Map topology offers a clear alternative path; selected the shortest safe detour.",sourceMemories:m.map(f=>f.memory.id),confidence:p?Math.max(...m.map(f=>f.score)):.7}),ce({severity:"info",title:"Route changed",detail:`${s.id} rerouted via ${w.join(" → ")}.`,robotId:s.id,missionId:t.id,source:"mission"});return}e.scenarioId==="battery"&&!e.batteryFired&&i>30&&(e.batteryFired=!0,e.speedFactor=.8,L(t.id,{ts:Date.now(),kind:"sim",severity:"warning",title:"Battery drain above forecast",detail:"Consumption 22% over baseline. Agent reduced cruise speed to conserve charge."})),s.battery<=a.lowBatteryThreshold&&e.tickCount%14===0&&L(t.id,{ts:Date.now(),kind:"sim",severity:"warning",title:`Low battery — ${s.battery}%`,detail:s.battery<=a.criticalBatteryThreshold?"Critical level. Mission will abort at next checkpoint.":"Continue with reduced power budget."}),e.scenarioId==="comms"&&!e.commsFired&&i>38&&(e.commsFired=!0,L(t.id,{ts:Date.now(),kind:"sim",severity:"warning",title:"Signal degradation",detail:"Link quality dropped below 50%. Telemetry reporting switches to batched mode."}),ce({severity:"warning",title:"Communication warning",detail:`${s.id} signal degraded during ${t.code}.`,robotId:s.id,missionId:t.id,source:"telemetry"}),e.problemLog.push("Temporary signal degradation")),e.scenarioId==="conflict"&&!e.conflictHandled&&i>22&&(e.conflictHandled=!0,L(t.id,{ts:Date.now(),kind:"memory",severity:"warning",title:"Conflicting historical experiences detected",detail:"Older experience recommends one path; a more recent experience reports it obstructed. The agent weights recency and context, then verifies conditions live before committing."}),gt({missionId:t.id,ts:Date.now(),phase:"planning",decision:"Proceed on planned route with live verification at the contested segment",rationale:"Recent memory (higher recency weight) contradicts an older preference. Neither is treated as automatically correct — the agent confirms current conditions on approach and keeps the alternative ready.",sourceMemories:["M-087","M-151"],confidence:.68}),ce({severity:"warning",title:"Memory conflict considered",detail:`Agent weighed conflicting experiences for ${s.id} in ${t.code}.`,robotId:s.id,missionId:t.id,source:"memory"}));const r=a.simEventFrequency==="low"?.008:a.simEventFrequency==="high"?.05:.02;if(Fe()<r){const n=[["Checkpoint scan complete","info","Waypoint imagery and sensor readings archived."],["Minor speed adjustment","info","Speed tuned for surface conditions."],["Temperature rising slightly","warning","Drive motors 2°C above baseline; within limits."],["Temporary signal drop","warning","Packet loss for 3 seconds; link recovered."],[" Lidar recalibrated","info","Point cloud alignment verified."]],[d,c,o]=n[Math.floor(Fe()*n.length)];L(t.id,{ts:Date.now(),kind:"sim",severity:c,title:d.trim(),detail:o})}}function Ji(e,t,s){const i=D(),a=(e.scenarioId==="battery"?.55:.22)*i.simSpeed,r=Math.max(3,Math.round((s.battery-a)*10)/10),l=e.scenarioId==="comms"&&t.progress>38?34:92,n=Math.round(s.signal+(l-s.signal)*.15+(Fe()*4-2)),d=Math.round((s.temperature+(38-s.temperature)*.1+(Fe()*1.4-.7))*10)/10,c=Math.round(.9*i.simSpeed*e.speedFactor*100)/100,o=Math.max(.2,Math.round((2.5+Fe()*2)*10)/10),v={ts:Date.now(),battery:r,speed:c,temperature:d,signal:n,obstacleDistance:o,x:s.x,y:s.y};$e(s.id,{battery:r,signal:n,temperature:d,speed:c,lastActivity:new Date().toISOString()});const m=Math.max(1,Math.ceil(i.telemetryIntervalSec*1e3/900));e.tickCount%m===0&&Rs(s.id,v),r<=i.criticalBatteryThreshold&&!e.problemLog.includes("critical battery")&&(e.problemLog.push("critical battery"),ce({severity:"critical",title:`Critical battery — ${s.id}`,detail:`Battery at ${r}% during ${t.code}.`,robotId:s.id,missionId:t.id,source:"telemetry"}),i.notificationsBattery&&It({severity:"critical",title:"Critical battery",body:`${s.id} is at ${r}% during ${t.code}.`,route:{view:"fleet",id:s.id}})),n<i.signalWarning&&e.tickCount%20===0&&ce({severity:"warning",title:`Weak signal — ${s.id}`,detail:`Signal at ${n}% during ${t.code}.`,robotId:s.id,missionId:t.id,source:"telemetry"})}function Qs(e){const t=j.get(e),s=we(e);if(!s||t!=null&&t.finished)return;const i=s.progress>90,a=s.startedAt?Math.round((Date.now()-s.startedAt)/1e3):0;T(l=>{var c;const n=l.missions.find(o=>o.id===e),d=l.robots.find(o=>o.id===s.robotId);if(n&&(n.status="completed",n.progress=100,n.endedAt=Date.now(),n.durationSec=a,n.outcome=i?"success":"partial",t&&(n.problems=[...t.problemLog]),n.route&&(n.route.pointIndex=n.route.current.length-1)),d){d.status="idle",d.currentMissionId=null,d.missionCount++,i&&d.successCount++,d.location=((c=P(s.envId).nodes.find(v=>v.id===s.destinationNode))==null?void 0:c.name)??d.location;const o=be(s.envId,s.destinationNode);d.x=o.x,d.y=o.y}}),L(e,{ts:Date.now(),kind:"system",severity:"success",title:"Mission completed",detail:`${s.code} finished in ${Math.max(1,Math.round(a/60))} min${t!=null&&t.problemLog.length?` — notes: ${t.problemLog.join("; ")}`:""}.`}),t&&(t.finished=!0,j.delete(e)),Kt(),D().notificationsMission&&It({severity:i?"success":"warning",title:`Mission ${s.code} completed`,body:`${s.robotId} finished ${s.type} at ${s.destinationName}.`,route:{view:"missions",id:e}}),ye()}function Ki(e,t){const s=j.get(e),i=we(e);i&&(T(a=>{const r=a.missions.find(n=>n.id===e),l=a.robots.find(n=>n.id===i.robotId);r&&(r.status="failed",r.endedAt=Date.now(),r.durationSec=r.startedAt?Math.round((Date.now()-r.startedAt)/1e3):0,r.outcome="failed",r.problems=[...(s==null?void 0:s.problemLog)??[],t]),l&&(l.status="warning",l.currentMissionId=null)}),L(e,{ts:Date.now(),kind:"system",severity:"critical",title:"Mission failed",detail:t}),ce({severity:"critical",title:`Mission ${i.code} failed`,detail:t,robotId:i.robotId,missionId:e,source:"mission"}),s&&(s.finished=!0,j.delete(e)),Kt(),ye())}function en(){D(),j.forEach(e=>{if(e.paused||e.finished)return;const t=Te(e.robotId),s=we(e.missionId);!t||!s||t.battery<=6&&s.progress<90&&Ki(e.missionId,`Battery critically depleted (${t.battery}%) before mission completion.`)})}function tn(e){var r,l;const t=P(e.envId),s=e.events.find(n=>n.title==="Obstacle detected"),i=e.decisions.find(n=>n.decision.toLowerCase().includes("reroute")||n.decision.toLowerCase().includes("route via")),a=e.memoryIdsRetrieved.length>0;if(s&&i){const n=s.atNode?(r=t.nodes.find(c=>c.id===s.atNode))==null?void 0:r.name:"the planned path",d=i.decision.replace(/Reroute via /,"").split(" avoiding ")[0];return{text:`${e.robotId} encountered a blocked passage at ${n} during ${e.type} to ${e.destinationName} (${t.name}). ${d} was used successfully as an alternative route.`,category:"Obstacles",tags:[s.atNode??"obstacle","obstacle","reroute",t.id],confidence:.9}}return e.problems.some(n=>n.includes("critical battery"))?{text:`${e.robotId} reached critical battery during ${e.type} to ${e.destinationName}. Charge before assigning similar ${e.type.toLowerCase()} missions exceeding ${Math.max(15,Math.round(e.durationSec/60-5))} minutes.`,category:"Battery",tags:["battery","charging",t.id],confidence:.82}:e.problems.some(n=>n.toLowerCase().includes("signal"))?{text:`${e.robotId} experienced signal degradation during ${e.type} in ${t.name}. Expect reduced telemetry near this area; batch reporting is acceptable.`,category:"Environment",tags:["signal","connectivity",t.id],confidence:.78}:a?{text:`${e.robotId} completed ${e.type} to ${e.destinationName} using ${e.memoryIdsRetrieved.length} retrieved experience${e.memoryIdsRetrieved.length>1?"s":""}. Previous strategy remains valid for this route.`,category:"Successful Strategies",tags:[e.destinationNode,t.id,"validated"],confidence:.86}:{text:`${e.robotId} completed a clean ${e.type.toLowerCase()} to ${e.destinationName} (${t.name}). Route via ${(l=e.route)==null?void 0:l.current.map(n=>{var d;return(d=t.nodes.find(c=>c.id===n))==null?void 0:d.name}).join(" → ")} is reliable.`,category:"Navigation",tags:[e.destinationNode,t.id,"clean-run"],confidence:.8}}function Xs(e){const t=tn(e),s=Fi({robotId:e.robotId,missionId:e.id,missionCode:e.code,category:t.category,text:t.text,envId:e.envId,tags:t.tags,confidence:t.confidence,relevance:.68});return T(i=>{const a=i.missions.find(r=>r.id===e.id);a&&!a.memoryIdsCreated.includes(s.id)&&a.memoryIdsCreated.push(s.id)}),s}function sn(e,t,s){const i=e.envId==="wh-a"?"Warehouse A":e.envId==="industrial"?"Industrial Facility":"Outdoor Inspection Zone",a=[{title:"Mission received",detail:`${e.type} to ${e.destinationName} (${i})`,kind:"system"},{title:`Robot ${t.id} ${t.name} selected`,detail:`Status ${t.status}, battery ${t.battery}%, health ${t.healthScore}/100.`,kind:"agent"},{title:"Destination analyzed",detail:`${i} → ${e.destinationName}. Distance ${e.distanceM} m.`,kind:"agent"},{title:"Previous mission experiences searched",detail:"Persistent memory queried with robot, environment, destination and mission-type context.",kind:"agent"}];if(s.length){a.push({title:`${s.length} relevant experience${s.length>1?"s":""} found`,detail:s.map(l=>l.id).join(", "),kind:"memory"});const r=s.find(l=>/blocked|obstacle|spill|debris|slip/i.test(l.text));r&&(a.push({title:"Previous risk identified in plan",detail:`${r.id}: ${r.text}`,kind:"memory"}),a.push({title:"Alternative route evaluated",detail:"Candidate paths compared against topology and prior outcomes.",kind:"agent"}),a.push({title:"Safer route selected",detail:"Plan updated before departure — obstacle avoided proactively.",kind:"decision"}))}else a.push({title:"No strongly relevant memories found",detail:"Fresh experience will be captured during execution.",kind:"memory"});return a.push({title:"Mission execution started",detail:"Telemetry streaming; agent monitors execution and will adapt to conditions.",kind:"sim"}),a}function Tt(e){const t=Bt(),s=t.map(r=>r.id.toLowerCase()),i=t.map(r=>r.name.toLowerCase()),a=[];return t.forEach((r,l)=>{(e.includes(s[l])||e.includes(i[l]))&&a.push(r)}),a}function Bt(){const{getRobots:e}=Js();return e()}function Js(){return Hs}function nn(e){var r,l;const t=e.toLowerCase(),s=F(),i=N(),a=D();if(/why.*(corridor|route|choose|chose|reroute)/.test(t)||/corridor c/.test(t)){const d=((r=Tt(t)[0])==null?void 0:r.id)??"R-01",c=i.filter(v=>v.robotId===d&&/corridor/i.test(v.text)),o=s.filter(v=>v.robotId===d&&v.decisions.some(m=>/route|reroute/i.test(m.decision)));if(c.length||o.length){const v=c.sort((w,f)=>f.relevance-w.relevance)[0],m=o[0],p=m==null?void 0:m.decisions.find(w=>/route|reroute/i.test(w.decision)),y=[];return v&&y.push(`**Persistent memory (local simulation)** — ${v.id}: “${v.text}” (simulated relevance ${(v.relevance*100).toFixed(0)}%, recalled ${v.retrievalCount}×).`),p&&m&&y.push(`**Historical mission data** — during ${m.code} the agent recorded: “${p.decision}”. Rationale: ${p.rationale}`),y.push(`**Current mission state** — memory-assisted routing is ${a.memoryRecallEnabled?"enabled":"disabled"} and applied during mission planning and whenever an obstacle is detected.`),{text:y.join(`

`),sources:[{label:"Persistent memory",cls:"src-memory"},{label:"Historical mission data",cls:"src-history"},{label:"Current mission state",cls:"src-state"}],links:v?[{label:`Open ${v.id}`,route:`memory/${v.id}`}]:[]}}}if(/previous|last|during.*(mission|warehouse|zone)/.test(t)){const n=Tt(t),c=s.find(v=>/warehouse a/i.test(t)&&v.destinationName.includes("Zone")===!1&&v.envId==="wh-a")??s.find(v=>!n.length||v.robotId===n[0].id),o=s.filter(v=>v.status==="completed").find(v=>c&&v.robotId===c.robotId);if(o){const v=o.problems.length?o.problems.join("; "):"no significant problems";return{text:`**Historical mission data** — ${o.code} (${o.type} to ${o.destinationName}, ${o.robotId}) completed ${on(o.endedAt??o.startedAt??o.createdAt)} in ${Math.round(o.durationSec/60)} min. Outcome: ${o.outcome}. Problems: ${v}. Memories retrieved: ${o.memoryIdsRetrieved.join(", ")||"none"}. New memories created: ${o.memoryIdsCreated.join(", ")||"none"}.`,sources:[{label:"Historical mission data",cls:"src-history"}],links:[{label:`Open ${o.code}`,route:`missions/${o.id}`}]}}}if(/battery|charging|charge/.test(t)){const n=s.filter(v=>v.problems.some(m=>/battery/i.test(m))||/battery/i.test(v.events.map(m=>m.title).join(" "))),d=i.filter(v=>v.category==="Battery"),c=Bt().filter(v=>v.battery<40),o=[];if(c.length&&o.push(`**Current state** — ${c.map(v=>`${v.id} at ${v.battery}%`).join(", ")}.`),n.length&&o.push(`**Historical mission data** — ${n.length} mission(s) recorded battery problems: ${n.slice(0,3).map(v=>v.code).join(", ")}.`),d.length&&o.push(`**Persistent memory** — ${d.slice(0,3).map(v=>`${v.id}: ${v.text}`).join(" | ")}`),o.length)return{text:o.join(`

`),sources:[{label:"Simulated telemetry",cls:"src-sim"},{label:"Historical mission data",cls:"src-history"},{label:"Persistent memory",cls:"src-memory"}]}}if(/what does.*(remember|know)|remember about|know about/.test(t)){const d=(l=Tt(t)[0])==null?void 0:l.id;if(d){const o=["zone","corridor","hall","perimeter","dock","gate","bay","cell","store","substation","tank","assembly","press"].find(m=>t.includes(m));let v=i.filter(m=>m.robotId===d);return o&&(v=v.filter(m=>m.text.toLowerCase().includes(o))),v.length?{text:`**Persistent memory** — ${d} holds ${v.length} relevant experience(s):

${v.slice(0,4).map(m=>`• ${m.id} (${m.category}, ${(m.confidence*100).toFixed(0)}% confidence): ${m.text}`).join(`
`)}`,sources:[{label:"Persistent memory",cls:"src-memory"}],links:v.slice(0,2).map(m=>({label:`Open ${m.id}`,route:`memory/${m.id}`}))}:{text:`**Persistent memory** — ${d} has no memories mentioning ${o??"that topic"} in the current memory store.`,sources:[{label:"Persistent memory",cls:"src-memory"}]}}}if(/obstacle.*rerout|rerout|obstacle/.test(t)){const n=s.filter(d=>d.decisions.some(c=>/reroute/i.test(c.decision))||d.problems.some(c=>/obstacle/i.test(c)));if(n.length)return{text:`**Historical mission data** — ${n.length} mission(s) involved obstacles and rerouting:

${n.slice(0,5).map(d=>`• ${d.code} — ${d.robotId}, ${d.type} to ${d.destinationName} (${d.outcome??d.status})`).join(`
`)}`,sources:[{label:"Historical mission data",cls:"src-history"}],links:n.slice(0,3).map(d=>({label:`Open ${d.code}`,route:`missions/${d.id}`}))}}if(/relevant.*(mission|experience)|which experience/.test(t)){const n=s.find(d=>d.status==="active"||d.status==="paused");if(n){const d=De({robotId:n.robotId,envId:n.envId,destinationNode:n.destinationNode,text:`${n.type} ${n.destinationName}`,limit:3});if(d.hits.length)return{text:`**Current mission state + Persistent memory** — for ${n.code} (${n.robotId} → ${n.destinationName}), the most relevant experiences are:

${d.hits.map(c=>`• ${c.memory.id} — ${(c.score*100).toFixed(0)}% match: ${c.memory.text}`).join(`
`)}`,sources:[{label:"Current mission state",cls:"src-state"},{label:"Persistent memory",cls:"src-memory"}],links:[{label:`Open ${n.code}`,route:`missions/${n.id}`}]}}}if(/fleet|status|overview|how many|robots/.test(t)){const n=Bt(),d=n.filter(o=>o.status!=="offline").length,c=s.filter(o=>o.status==="active").length;return{text:`**Current mission state** — the fleet has ${n.length} robots, ${d} reachable, ${c} active mission(s), and ${i.length} memories stored (${i.filter(o=>o.retrievalCount>0).length} retrieved at least once). Memory recall is ${a.memoryRecallEnabled?"enabled":"disabled"}.`,sources:[{label:"Current mission state",cls:"src-state"}]}}if(/memor/.test(t)){const n=new Map;i.forEach(c=>n.set(c.category,(n.get(c.category)??0)+1));const d=[...n.entries()].sort((c,o)=>o[1]-c[1]).slice(0,3);return{text:`**Persistent memory** — the store holds ${i.length} memories. Largest categories: ${d.map(([c,o])=>`${c} (${o})`).join(", ")}. ${an()} open conflict(s) flagged for review.`,sources:[{label:"Persistent memory",cls:"src-memory"}]}}return{text:`I can answer from live fleet state, historical missions, and persistent memory. Try:

• “Why did R-01 choose Corridor C?”
• “What happened during the previous Warehouse A mission?”
• “Which robots have experienced battery problems?”
• “What does R-03 remember about the South Hall?”
• “Show missions where obstacles caused rerouting.”
• “Which previous experience is relevant to this mission?”`,sources:[]}}function an(){const{getConflicts:e}=Js();return e().filter(t=>t.status==="open").length}function on(e){if(!e)return"—";const t=Date.now()-e,s=Math.round(t/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;const i=Math.round(s/60);return i<24?`${i} h ago`:`${Math.round(i/24)} d ago`}let ls=0;const Dt=()=>(Math.sin(Date.now()/400)+1)/2;function Ks(e,t){var p,y,w,f;const s=e.getContext("2d");if(!s)return;const i=P(t.envId),a=window.devicePixelRatio||1,r=i.width,l=i.height,d=e.getBoundingClientRect().width||600,c=d*(l/r);e.style.height=`${c}px`,e.width=d*a,e.height=c*a,s.setTransform(a,0,0,a,0,0),s.clearRect(0,0,d,c);const o=d/r,v=c/l,m=s.createLinearGradient(0,0,0,c);m.addColorStop(0,"#0b101c"),m.addColorStop(1,"#0d1322"),s.fillStyle=m,s.fillRect(0,0,d,c),s.strokeStyle="rgba(148,163,203,0.05)",s.lineWidth=1;for(let h=0;h<r;h+=50)s.beginPath(),s.moveTo(h*o,0),s.lineTo(h*o,c),s.stroke();for(let h=0;h<l;h+=50)s.beginPath(),s.moveTo(0,h*v),s.lineTo(d,h*v),s.stroke();if(i.zones.forEach(h=>{s.fillStyle=h.danger?"rgba(248,113,113,0.07)":"rgba(79,140,255,0.05)",s.strokeStyle=h.danger?"rgba(248,113,113,0.4)":"rgba(79,140,255,0.25)",s.lineWidth=1,s.setLineDash(h.danger?[6,4]:[]),s.beginPath(),s.roundRect(h.x*o,h.y*v,h.w*o,h.h*v,6),s.fill(),s.stroke(),s.setLineDash([]),s.fillStyle=h.danger?"rgba(248,113,113,0.85)":"rgba(122,152,255,0.7)",s.font="600 10px ui-sans-serif, system-ui",s.textAlign="left",s.fillText(h.name.toUpperCase(),h.x*o+7,h.y*v+14)}),i.edges.forEach(h=>{const $=i.nodes.find(x=>x.id===h.a),k=i.nodes.find(x=>x.id===h.b);!$||!k||(s.strokeStyle="rgba(148,163,203,0.16)",s.lineWidth=2,s.beginPath(),s.moveTo($.x*o,$.y*v),s.lineTo(k.x*o,k.y*v),s.stroke())}),(p=t.route)!=null&&p.planned&&t.showPlannedDashed&&cs(s,i,t.route.planned,o,v,"rgba(148,163,203,0.35)",!0),(w=(y=t.route)==null?void 0:y.current)!=null&&w.length){const h=s.createLinearGradient(0,0,d,c);h.addColorStop(0,"rgba(79,140,255,0.9)"),h.addColorStop(1,"rgba(124,108,248,0.9)"),s.shadowColor="rgba(79,140,255,0.55)",s.shadowBlur=8,cs(s,i,t.route.current,o,v,h,!1,3.2),s.shadowBlur=0}if(i.obstacles.forEach(h=>{var A;const $=(A=t.obstacleActive)==null?void 0:A.includes(h.id),k=(h.w??30)*o,x=(h.h??20)*v,b=h.x*o-k/2,C=h.y*v-x/2;if(s.fillStyle=$?"rgba(248,113,113,0.85)":"rgba(148,163,203,0.2)",s.strokeStyle=$?"rgba(248,113,113,1)":"rgba(148,163,203,0.4)",s.lineWidth=1,s.beginPath(),s.roundRect(b,C,k,x,4),s.fill(),s.stroke(),$){const H=Dt();s.strokeStyle=`rgba(248,113,113,${.7-H*.5})`,s.lineWidth=2,s.beginPath(),s.roundRect(b-4-H*4,C-4-H*4,k+8+H*8,x+8+H*8,6),s.stroke()}}),i.nodes.forEach(h=>{var C,A;const $=(C=t.highlightNodes)==null?void 0:C.includes(h.id),k=(A=t.blockedNodeIds)==null?void 0:A.includes(h.id),x=$&&h.id===t.highlightNodes[t.highlightNodes.length-1],b=h.kind==="dock"||h.kind==="poi"?6:4.5;if(s.beginPath(),s.arc(h.x*o,h.y*v,b+($?2:0),0,Math.PI*2),k?s.fillStyle="#f8717f":$?s.fillStyle="#4f8cff":s.fillStyle="rgba(148,163,203,0.5)",s.fill(),x){const H=Dt();s.strokeStyle=`rgba(79,140,255,${.8-H*.5})`,s.lineWidth=2,s.beginPath(),s.arc(h.x*o,h.y*v,b+6+H*5,0,Math.PI*2),s.stroke()}s.fillStyle=$||k?"#e8edf7":"rgba(154,167,196,0.85)",s.font=`${$||k?"600 ":""}10px ui-sans-serif, system-ui`,s.textAlign="center",s.fillText(h.name,h.x*o,h.y*v-11)}),t.robotXY){const h=t.robotXY.x*o,$=t.robotXY.y*v,k=t.animatePulse===!1?.5:Dt();if(s.shadowColor="rgba(52,211,153,0.9)",s.shadowBlur=12,s.fillStyle="#34d399",s.beginPath(),s.arc(h,$,7,0,Math.PI*2),s.fill(),s.shadowBlur=0,s.strokeStyle="rgba(52,211,153,0.8)",s.lineWidth=1.5,s.beginPath(),s.arc(h,$,10+k*6,0,Math.PI*2),s.stroke(),(f=t.route)!=null&&f.current&&t.route.pointIndex<t.route.current.length-1){const x=i.nodes.find(b=>b.id===t.route.current[t.route.pointIndex+1]);x&&(s.strokeStyle="rgba(52,211,153,0.5)",s.setLineDash([3,3]),s.beginPath(),s.moveTo(h,$),s.lineTo(x.x*o,x.y*v),s.stroke(),s.setLineDash([]))}}t.progressPct!==void 0&&(s.fillStyle="rgba(10,14,22,0.7)",s.beginPath(),s.roundRect(d/2-80,c-10,160,4,2),s.fill(),s.fillStyle="#4f8cff",s.beginPath(),s.roundRect(d/2-80,c-10,160*(t.progressPct/100),4,2),s.fill())}function cs(e,t,s,i,a,r,l,n=2){s.length<2||(e.strokeStyle=r,e.lineWidth=n,e.setLineDash(l?[5,5]:[]),e.beginPath(),s.forEach((d,c)=>{const o=t.nodes.find(p=>p.id===d);if(!o)return;const v=o.x*i,m=o.y*a;c===0?e.moveTo(v,m):e.lineTo(v,m)}),e.stroke(),e.setLineDash([]))}function rn(e,t){let s=!0;const i=()=>{s&&(Ks(e,t()),ls=requestAnimationFrame(i))};return i(),()=>{s=!1,cancelAnimationFrame(ls)}}let pt=null,ut=null;function ei(e,t){ti(),t?ln(e,t):dn(e)}function ti(){pt&&(pt(),pt=null),ut&&(clearInterval(ut),ut=null)}function dn(e){var m,p,y,w;const t=J(),s=Ze(),i=D(),a=s.length>=Math.max(1,i.maxConcurrentMissions),r=i.autoAssign?(m=t.find(f=>["idle","online"].includes(f.status)&&f.battery>i.lowBatteryThreshold))==null?void 0:m.id:void 0,l=F().slice(0,8);e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Mission Control</h1>
          <div class="vsub">Create missions, control execution, and watch the AI agent work. Robot behavior is simulated; decisions and memory flows are real.</div>
        </div>
        <div class="view-head-actions">
          <span class="live-pill"><span class="ldot"></span>${s.length} active</span>
        </div>
      </div>

      <div class="grid-2-1">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("plus",15)} New Mission</div></div>
          <div class="panel-body">
            <form id="mission-form">
              <div class="form-row">
                <div class="field">
                  <label for="mc-robot">Robot</label>
                  <select id="mc-robot" class="input" required>
                    <option value="" disabled ${r?"":"selected"}>Select an available robot</option>
                    ${t.map(f=>`<option value="${f.id}" ${f.id===r?"selected":""} ${f.status==="offline"?"disabled":""}>${f.id} · ${f.name} — ${f.status} (${f.battery}%)</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-type">Mission type</label>
                  <select id="mc-type" class="input">
                    ${["Inspection","Delivery","Patrol","Mapping","Environmental Monitoring","Search","Infrastructure Check"].map(f=>`<option>${f}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="form-row mt-8">
                <div class="field">
                  <label for="mc-env">Environment</label>
                  <select id="mc-env" class="input">
                    ${ze.map(f=>`<option value="${f.id}">${f.name}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-dest">Destination</label>
                  <select id="mc-dest" class="input"></select>
                </div>
              </div>
              <div class="form-row-3 mt-8">
                <div class="field">
                  <label for="mc-prio">Priority</label>
                  <select id="mc-prio" class="input">
                    ${["Low","Normal","High","Critical"].map(f=>`<option ${f==="Normal"?"selected":""}>${f}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-mode">Mode</label>
                  <select id="mc-mode" class="input">
                    <option value="autonomous">Autonomous (agent-driven)</option>
                    <option value="manual">Manual (supervised)</option>
                  </select>
                </div>
                <div class="field">
                  <label for="mc-scenario">Simulation scenario</label>
                  <select id="mc-scenario" class="input">
                    ${Ae.map(f=>`<option value="${f.id}">${f.name}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="field mt-8">
                <label for="mc-instr">Mission instructions</label>
                <textarea id="mc-instr" class="input" rows="3" placeholder="e.g. Inspect all checkpoints and report anomalies with photos.">Inspect all checkpoints and report anomalies.</textarea>
              </div>
              <div id="mc-scenario-note" class="info-note sim-note mt-8">${u("info",15)}<span>${vs(Ae[0].desc)}</span></div>
              ${a?`<div class="info-note mt-8" style="border-color:rgba(251,191,36,.35);color:var(--amber)">${u("warning",15)}<span>Fleet capacity reached (${s.length}/${i.maxConcurrentMissions}). You can queue a mission or wait for an active run to finish.</span></div>`:""}
              <div class="flex mt-16" style="gap:9px">
                <button type="submit" class="btn btn-primary btn-lg" id="mc-start" ${a?"disabled":""}>${u("play",15)} Start Mission</button>
                <button type="button" class="btn btn-lg" id="mc-queue">Queue only</button>
              </div>
            </form>
          </div>
        </section>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("activity",15)} Active & Recent</div></div>
            <div class="panel-body tight">
              ${l.length?l.map(f=>`
                <div class="kv-row clickable" data-nav="mission/${f.id}" style="padding:9px 16px">
                  <span><span class="td-main">${f.code}</span> <span class="fs-11 text-dim">${f.type} → ${f.destinationName}</span></span>
                  <span class="flex" style="gap:7px">${Y(f.status)}${u("chevronRight",13)}</span>
                </div>`).join(""):U("mission","No missions yet","Create your first mission on the left.")}
            </div>
          </section>
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("info",15)} How the agent plans</div></div>
            <div class="panel-body fs-12" style="color:var(--text-2);line-height:1.7">
              1. Parses your instructions and mission parameters.<br/>
              2. Reviews the robot's history and health.<br/>
              3. <b style="color:var(--text-1)">Retrieves relevant experiences from persistent memory.</b><br/>
              4. Identifies previous risks on the planned route.<br/>
              5. Selects the safest route and explains its decision.<br/>
              6. Monitors execution and adapts when conditions change.
            </div>
          </section>
        </div>
      </div>
    </div>`;const n=e.querySelector("#mc-env"),d=e.querySelector("#mc-dest"),c=()=>{const f=P(n.value),h=e.querySelector("#mc-robot");if(!h)return;const $=h.value,k=_s($,f.id);d.innerHTML=f.nodes.filter(x=>x.id!==k&&x.kind!=="dock").map(x=>`<option value="${x.id}">${x.name}</option>`).join("")};c(),n.addEventListener("change",c),(p=e.querySelector("#mc-robot"))==null||p.addEventListener("change",c);const o=e.querySelector("#mc-scenario"),v=e.querySelector("#mc-scenario-note");o.addEventListener("change",()=>{const f=Ae.find(h=>h.id===o.value);f&&(v.innerHTML=`${u("info",15)}<span>${vs(f.desc)}</span>`)}),(y=e.querySelector("#mission-form"))==null||y.addEventListener("submit",f=>{f.preventDefault(),Ht(e,!0)}),(w=e.querySelector("#mc-queue"))==null||w.addEventListener("click",()=>Ht(e,!1)),e.querySelectorAll("[data-nav]").forEach(f=>{f.addEventListener("click",h=>{h.stopPropagation(),I(f.dataset.nav)})})}function Ht(e,t,s=!1){var h;const i=$=>e.querySelector($),a=i("#mc-robot").value,r=i("#mc-prio").value,l=D(),n=J().find($=>$.id===a);if(t&&(!n||["offline","executing","charging"].includes(n.status)||n.currentMissionId)){q("warning","Robot unavailable","Choose an idle robot or queue this mission for later.");return}if(t&&Ze().length>=Math.max(1,l.maxConcurrentMissions)){q("warning","Fleet capacity reached",`Maximum ${l.maxConcurrentMissions} concurrent missions.`);return}if(t&&r==="Critical"&&l.requireReviewForCritical&&!s){Ue("Review critical mission",`Confirm ${a} is ready for this Critical-priority mission before execution.`,"Approve and start",()=>Ht(e,t,!0),!0);return}const d=e.querySelector("#mc-start");if(t&&d.disabled)return;t&&(d.disabled=!0,d.innerHTML='<span class="spinner"></span> Planning…');const c=i("#mc-type").value,o=i("#mc-env").value,v=i("#mc-dest").value,p=P(o).nodes.find($=>$.id===v),y=i("#mc-mode").value,w=i("#mc-scenario").value,f=(((h=i("#mc-instr"))==null?void 0:h.value)||"").trim()||"Standard mission procedures.";try{const $=es({robotId:a,type:c,envId:o,destinationNode:v,destinationName:(p==null?void 0:p.name)??v,priority:r,mode:y,instructions:f,scenarioId:w});t?(Rt($,w,s),q("success",`${$.code} started`,`${a} → ${p==null?void 0:p.name}. Agent is planning with memory recall.`),I(`mission/${$.id}`)):(T(k=>{const x=k.missions.find(b=>b.id===$.id);x&&(x.status="queued")}),q("info",`${$.code} queued`,"Start it from Mission History or Mission Control."),I(`missions/${$.id}`))}catch($){q("error","Could not start mission",$ instanceof Error?$.message:"Unknown error"),d.disabled=!1,d.innerHTML=`${u("play",15)} Start Mission`}}function vs(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;")}function ln(e,t){var d,c;const s=S().missions.find(o=>o.id===t)??F()[0];if(!s){I("mission");return}s.id;const i=S().robots.find(o=>o.id===s.robotId),a=Ge(s.id),r=P(s.envId);s.memoryIdsRetrieved.map(o=>S().memories.find(v=>v.id===o)).filter(Boolean),e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${s.code} <span style="color:var(--text-3);font-weight:400">· ${s.type}</span></h1>
          <div class="vsub">${de(s.robotId,i==null?void 0:i.name)} → ${s.destinationName} (${r.name}) · ${js(s.priority)} ${s.mode==="autonomous"?O("Autonomous","blue"):O("Manual","gray")}</div>
        </div>
        <div class="view-head-actions" id="ws-actions"></div>
      </div>

      <div class="grid-2-1">
        <div class="stack">
          <section class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${u("sim",15)} Live Simulation — ${r.name}</div>
                <div class="panel-sub">Simulated robot and environment · explainable local planning logic</div>
              </div>
              <div class="panel-head-actions" id="ws-progress-badge"></div>
            </div>
            <div class="panel-body">
              <div class="sim-wrap">
                <canvas id="ws-map" class="sim-canvas" aria-label="2D mission map"></canvas>
                <div class="sim-overlay-tl">
                  <span class="badge badge-blue"><span class="bdot"></span>SIMULATED ENVIRONMENT</span>
                  ${a?'<span class="live-pill"><span class="ldot"></span>LIVE</span>':""}
                </div>
                <div class="sim-overlay-tr" id="ws-map-badges"></div>
                <div class="sim-legend">
                  <span><span class="lg-swatch" style="background:#34d399"></span>Robot</span>
                  <span><span class="lg-swatch" style="background:#4f8cff"></span>Active route</span>
                  <span><span class="lg-swatch" style="background:rgba(148,163,203,0.4)"></span>Original route</span>
                  <span><span class="lg-swatch" style="background:#f8717f"></span>Obstacle</span>
                  <span><span class="lg-swatch" style="background:rgba(79,140,255,0.5)"></span>Checkpoint</span>
                </div>
              </div>
              <div class="mt-8" id="ws-progress">
                <div class="meter-label"><span>Mission progress</span><b id="ws-progress-pct">0%</b></div>
                <div class="meter" style="height:8px"><span id="ws-progress-bar" style="width:0%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></span></div>
                <div class="flex fs-11 text-dim mt-8" style="gap:14px">
                  <span>0%</span><span style="margin-left:auto"></span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <div><div class="panel-title">${u("agent",15)} Mission Agent — explainable timeline</div>
              <div class="panel-sub">Distinguishes simulated actions, AI reasoning, memory and system events</div></div>
              <div class="panel-head-actions">
                <span class="badge badge-plain">SIM</span><span class="badge badge-plain" style="color:#8ab2ff">AGENT</span><span class="badge badge-plain" style="color:#b3a8f8">MEMORY</span><span class="badge badge-plain" style="color:var(--green)">DECISION</span>
              </div>
            </div>
            <div class="panel-body">
              <div class="timeline" id="ws-timeline"></div>
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("temp",15)} Telemetry</div><div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED</span></div></div>
            <div class="panel-body">
              <div class="kv-list" id="ws-telemetry"></div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("memory",15)} Memory in use</div></div>
            <div class="panel-body">
              <div id="ws-memories" class="stack" style="gap:8px"></div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("route",15)} Mission details</div></div>
            <div class="panel-body">
              <div class="kv-list">
                <div class="kv-row"><span class="k">Instructions</span><span class="v">${s.instructions}</span></div>
                <div class="kv-row"><span class="k">Started</span><span class="v">${Xt(s.startedAt)}</span></div>
                <div class="kv-row"><span class="k">Distance</span><span class="v">${s.distanceM} m</span></div>
                <div class="kv-row"><span class="k">Scenario</span><span class="v">${((d=Ae.find(o=>o.id===s.scenarioId))==null?void 0:d.name)??"Custom"}</span></div>
                <div class="kv-row"><span class="k">Route</span><span class="v" style="text-align:right">${((c=s.route)==null?void 0:c.current.map(o=>{var v;return((v=P(s.envId).nodes.find(m=>m.id===o))==null?void 0:v.name)??o}).join(" → "))??"—"}</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>`,ps(e,s);const l=e.querySelector("#ws-map");pt=rn(l,()=>{const o=S().missions.find(m=>m.id===t),v=S().robots.find(m=>m.id===((o==null?void 0:o.robotId)??""));return{envId:(o==null?void 0:o.envId)??"wh-a",route:(o==null?void 0:o.route)??null,robotXY:v?{x:v.x,y:v.y}:null,highlightNodes:o?[o.destinationNode]:[],blockedNodeIds:(o==null?void 0:o.events.filter(m=>m.title==="Obstacle detected").map(m=>m.atNode).filter(Boolean))??[],progressPct:o==null?void 0:o.progress,animatePulse:(o==null?void 0:o.status)==="active"}});const n=()=>{const o=S().missions.find(v=>v.id===t);o&&(cn(e,o),pn(e,o),hn(e,o),fn(e,o),ps(e,o,!0))};n(),ut=setInterval(n,1e3)}function ps(e,t,s=!1){var r,l,n,d,c,o;const i=e.querySelector("#ws-actions");if(!i)return;Ge(t.id)&&Ge(t.id).finished,t.status;let a="";t.status==="active"?a=`<button class="btn" id="act-pause">${u("pause",14)} Pause</button>
            <button class="btn btn-danger" id="act-cancel">${u("stop",14)} Cancel</button>`:t.status==="paused"?a=`<button class="btn btn-success" id="act-resume">${u("play",14)} Resume</button>
            <button class="btn btn-danger" id="act-cancel">${u("stop",14)} Cancel</button>`:t.status==="queued"?a=`<button class="btn btn-primary" id="act-start">${u("play",14)} Start Mission</button>`:a=`<button class="btn" id="act-replay">${u("history",14)} View report</button>
            <button class="btn btn-primary" id="act-new">${u("plus",14)} New mission</button>`,i.innerHTML=a,(r=e.querySelector("#act-pause"))==null||r.addEventListener("click",()=>{Yi(t.id),q("info","Mission paused")}),(l=e.querySelector("#act-resume"))==null||l.addEventListener("click",()=>{_i(t.id),q("success","Mission resumed")}),(n=e.querySelector("#act-cancel"))==null||n.addEventListener("click",()=>{Ue("Cancel mission?",`${t.code} will stop and the robot will return to idle. This cannot be undone.`,"Cancel mission",()=>{Zs(t.id),q("warning","Mission cancelled",t.code)},!0)}),(d=e.querySelector("#act-start"))==null||d.addEventListener("click",()=>{const v=(m=!1)=>{try{Rt(t,t.scenarioId,m),q("success","Mission started",t.code)}catch(p){q("error","Could not start mission",p instanceof Error?p.message:"Unexpected error")}};t.priority==="Critical"&&D().requireReviewForCritical?Ue("Review critical mission",`Confirm the plan for ${t.code} before execution.`,"Approve and start",()=>v(!0),!0):v()}),(c=e.querySelector("#act-replay"))==null||c.addEventListener("click",()=>I(`missions/${t.id}`)),(o=e.querySelector("#act-new"))==null||o.addEventListener("click",()=>I("mission"))}function cn(e,t){const s=e.querySelector("#ws-progress-pct"),i=e.querySelector("#ws-progress-bar");s&&(s.textContent=`${Math.round(t.progress)}%`),i&&(i.style.width=`${t.progress}%`);const a=e.querySelector("#ws-progress-badge");a&&(a.innerHTML=`${Y(t.status)} <span class="fs-11 text-dim nowrap">${pe(vn(t))}</span>`)}function vn(e){return e.startedAt?e.status==="active"?(Date.now()-e.startedAt)/1e3:e.durationSec:0}function pn(e,t){const s=e.querySelector("#ws-timeline");if(!s)return;const i=s.querySelectorAll(".tl-item").length,a=t.events;a.length,s.innerHTML=a.slice().reverse().map((r,l)=>`
    <div class="tl-item">
      <div class="tl-rail"><div class="tl-dot ${un(r)} ${l===0&&t.status==="active"?"active":""}">${mn(r)}</div></div>
      <div class="tl-body">
        <div class="tl-title">${r.title} <span class="tl-kind ${r.kind}">${r.kind}</span><span class="tl-time">${Ws(r.ts)}</span></div>
        ${r.detail?`<div class="tl-desc">${r.detail.replace(/\n/g,"<br/>")}</div>`:""}
      </div>
    </div>`).join("")}function un(e){return e.kind==="memory"?"mem":e.severity==="critical"?"crit":e.severity==="warning"?"warn":e.severity==="success"||e.kind==="decision"?"done":e.kind==="agent"?"info":""}function mn(e){return e.kind==="memory"?u("memory",11):e.kind==="decision"?u("check",11):e.severity==="critical"?u("xCircle",11):e.severity==="warning"?u("warning",11):e.kind==="sim"?u("sim",11):u("checkCircle",11)}function hn(e,t){const s=e.querySelector("#ws-telemetry");if(!s)return;const i=S().robots.find(r=>r.id===t.robotId);if(!i)return;const a=(S().telemetry[t.robotId]??[]).slice(-1)[0];s.innerHTML=`
    <div class="kv-row"><span class="k">Battery</span><span class="v">${Qe(i.battery)}</span></div>
    <div class="kv-row"><span class="k">Speed</span><span class="v">${i.speed.toFixed(2)} m/s</span></div>
    <div class="kv-row"><span class="k">Temperature</span><span class="v">${i.temperature.toFixed(1)} °C</span></div>
    <div class="kv-row"><span class="k">Signal</span><span class="v">${i.signal}%</span></div>
    <div class="kv-row"><span class="k">Obstacle distance</span><span class="v">${(a==null?void 0:a.obstacleDistance)!=null?`${a.obstacleDistance} m`:"—"}</span></div>
    <div class="kv-row"><span class="k">Coordinates</span><span class="v mono">${Math.round(i.x)}, ${Math.round(i.y)}</span></div>`}function fn(e,t){const s=e.querySelector("#ws-memories");if(!s)return;const i=t.memoryIdsRetrieved.map(l=>S().memories.find(n=>n.id===l)).filter(Boolean),a=t.memoryIdsCreated.map(l=>S().memories.find(n=>n.id===l)).filter(Boolean);let r="";i.length?r+=i.map(l=>`
      <div class="mem-card clickable" data-nav="memory/${l.id}">
        <div class="mem-head"><span class="mem-id">${l.id}</span>${O(l.category,"violet")}</div>
        <div class="mem-text clamp-2">${l.text}</div>
      </div>`).join(""):r+=`<div class="fs-12 text-dim">No memories retrieved ${t.status==="active"?"yet":"for this mission"}.</div>`,a.length&&(r+='<div class="fs-11 text-dim" style="margin-top:4px">Created this mission:</div>',r+=a.map(l=>`<div class="mem-card flash" style="border-color:rgba(52,211,153,.4)"><div class="mem-head"><span class="mem-id" style="color:var(--green)">${l.id}</span><span class="badge badge-green">NEW</span></div><div class="mem-text clamp-2">${l.text}</div></div>`).join("")),s.innerHTML=r,s.querySelectorAll("[data-nav]").forEach(l=>l.addEventListener("click",n=>{n.stopPropagation(),I(l.dataset.nav)}))}const Me=[{n:1,label:"Mission",title:"Assign R-01 to inspect Warehouse A",desc:"Starting an Inspection mission for R-01 to Zone A2 in Warehouse A. Watch the mission workspace and map.",hint:"The agent is planning the route. Notice there is no Corridor B warning yet on first runs."},{n:2,label:"Experience",title:"Robot encounters a Corridor B obstacle",desc:"The simulation injects an obstacle. The agent detects it, searches previous experience, and reroutes via Corridor C.",hint:"This obstacle is exactly the kind of event worth remembering."},{n:3,label:"Memory",title:"Mission completes; save the experience",desc:"The mission finished using the alternate route. The post-mission summary proposes storing the learned experience in persistent memory.",hint:"Saving creates a new memory in the local Memory Center."},{n:4,label:"Recall",title:"Start a second Warehouse A mission",desc:"R-01 is staged at Dock Bay for a comparable repeat route. This time the agent searches persistent memory during planning.",hint:"Watch the agent timeline for “relevant experience found”."},{n:5,label:"Decision",title:"Agent recommends Corridor C preemptively",desc:"Before any obstacle appears, the agent flags Corridor B as a known risk and selects the Corridor C route up front.",hint:"Compare the route with the first mission — no mid-mission surprise."},{n:6,label:"Improved Mission",title:"Mission completes using learned context",desc:"The second mission runs on the learned route. The loop is closed: mission → experience → memory → recall → decision → improved mission.",hint:"Check Analytics to see the memory-impact comparison."}],gn=["Mission","Experience","Memory","Recall","Decision","Improved Mission"],Ot="fleetminder.demo.v1",g={active:!1,step:0,mission1Id:null,mission2Id:null,memory1Id:null,phase:"idle",unsubscribe:null,simSpeedBefore:1};let E=null;const bt=new Set;let Q=null;function yt(e,t){const s=setTimeout(()=>{bt.delete(s),e()},t);bt.add(s)}function bn(){bt.forEach(clearTimeout),bt.clear(),Q&&clearInterval(Q),Q=null}function ne(){try{if(!g.active){sessionStorage.removeItem(Ot);return}const e={step:g.step,mission1Id:g.mission1Id,mission2Id:g.mission2Id,memory1Id:g.memory1Id,phase:g.phase,simSpeedBefore:g.simSpeedBefore};sessionStorage.setItem(Ot,JSON.stringify(e))}catch{}}function yn(e){E=e}function $n(){return g}function us(){return gn}function wn(){g.active||(g.active=!0,g.step=0,g.mission1Id=null,g.mission2Id=null,g.memory1Id=null,g.phase="running",g.simSpeedBefore=D().simSpeed,R({simSpeed:Math.max(1,D().simSpeed)}),ne(),g.unsubscribe=_e(()=>{g.active&&(E==null||E.renderGuide(g))}),I("mission"),q("info","Demo Mode started","Step 1 — assigning R-01 to inspect Warehouse A."),yt(si,700))}function si(){if(!g.active)return;const e=S().missions.find(s=>s.robotId==="R-01"&&(s.status==="active"||s.status==="paused"));if(e){q("warning","R-01 is unavailable",`${e.code} must finish before the guided demo can use R-01.`),Je("user");return}g.step=1;const t=es({robotId:"R-01",type:"Inspection",envId:"wh-a",destinationNode:"zone-a2",destinationName:"Zone A2",priority:"Normal",mode:"autonomous",instructions:"Demo: inspect all checkpoints and report anomalies.",scenarioId:"obstacle"});g.mission1Id=t.id,g.phase="awaiting-m1-complete",ne(),Rt(t,"obstacle"),I(`mission/${t.id}`),E==null||E.renderGuide(g)}function $t(e){g.active&&(g.phase==="awaiting-m1-complete"&&e.id===g.mission1Id?(g.step=3,g.phase="awaiting-save",ne(),I(`missions/${e.id}`),E==null||E.renderGuide(g)):g.phase==="awaiting-m2-complete"&&e.id===g.mission2Id&&(g.step=6,g.phase="done",ne(),I(`missions/${e.id}`),E==null||E.renderGuide(g),q("success","Demo complete","The full learning loop has run end to end.")))}function ii(e){!g.active||g.phase!=="awaiting-save"||(g.memory1Id=e,g.step=4,g.phase="running",ne(),E==null||E.renderGuide(g),q("info","Demo step 4","Memory stored. Starting a second Warehouse A mission."),yt(ni,900))}function ni(){if(!g.active)return;g.step=4,$e("R-01",{location:"Dock Bay"});const e=es({robotId:"R-01",type:"Inspection",envId:"wh-a",destinationNode:"zone-a2",destinationName:"Zone A2",priority:"Normal",mode:"autonomous",instructions:"Demo: repeat inspection with learned context available.",scenarioId:"clean"});g.mission2Id=e.id,g.phase="awaiting-m2-complete",ne(),Rt(e,"clean"),I(`mission/${e.id}`),E==null||E.renderGuide(g)}function xn(){switch(g.phase){case"awaiting-m1-complete":return"Watch the mission workspace until it completes.";case"awaiting-save":return"Save the learned experience to long-term memory.";case"awaiting-m2-complete":return"Watch the second mission complete with learned routing.";case"done":return"Demo finished — explore Analytics → Memory Impact.";default:return""}}function Je(e="user"){const t=g.active;g.active=!1,g.phase="idle",bn(),g.unsubscribe&&(g.unsubscribe(),g.unsubscribe=null),ne(),t&&(R({simSpeed:g.simSpeedBefore}),[g.mission1Id,g.mission2Id].forEach(s=>{if(!s)return;const i=S().missions.find(a=>a.id===s);i&&(i.status==="active"||i.status==="paused")&&Zs(s)})),e==="user"&&t&&q("info","Demo Mode exited","You can restart it anytime from the sidebar."),E==null||E.renderGuide(g)}function ai(){Je("reset"),Ui(),Is(),Ys(),g.step=0,g.mission1Id=null,g.mission2Id=null,g.memory1Id=null,g.phase="idle",ne(),I("dashboard"),E==null||E.renderGuide(g),q("success","Demo reset","The initial FleetMinder dataset has been restored.")}function Mn(){if(g.phase==="awaiting-m1-complete"||g.phase==="awaiting-m2-complete"){const e=g.phase==="awaiting-m1-complete"?g.mission1Id:g.mission2Id;if(e){const t=Ge(e);t&&!t.finished&&kn(e)}}else if(g.phase==="awaiting-save"){const e=g.mission1Id?S().missions.find(t=>t.id===g.mission1Id):null;if(e){const t=Xs(e);ii(t.id)}}}function kn(e){Q&&clearInterval(Q),Q=setInterval(()=>{const t=S().missions.find(i=>i.id===e);if(!t||t.status!=="active"){Q&&clearInterval(Q),Q=null;return}t.progress=Math.min(99,t.progress+8);const s=Ge(e);s&&(s.segProgress=Math.min(99,s.segProgress+8)),t.progress>=99&&(Q&&clearInterval(Q),Q=null,Qs(e))},350)}function wt(){return g.active}function Sn(){_e(()=>{if(!g.active)return;const e=S().missions,t=e.find(i=>i.id===g.mission1Id),s=e.find(i=>i.id===g.mission2Id);g.phase==="awaiting-m1-complete"&&g.step<2&&(t!=null&&t.events.some(i=>i.title==="Obstacle detected"))&&(g.step=2,ne(),E==null||E.renderGuide(g)),g.phase==="awaiting-m2-complete"&&g.step<5&&(s!=null&&s.events.some(i=>i.kind==="decision"&&i.title.startsWith("Preemptive route selected")))&&(g.step=5,ne(),E==null||E.renderGuide(g)),g.phase==="awaiting-m1-complete"&&(t==null?void 0:t.status)==="completed"&&$t(t),g.phase==="awaiting-m2-complete"&&(s==null?void 0:s.status)==="completed"&&$t(s)}),In()}function In(){let e=null;try{const i=sessionStorage.getItem(Ot);i&&(e=JSON.parse(i))}catch{}if(!e||!["running","awaiting-m1-complete","awaiting-save","awaiting-m2-complete","done"].includes(e.phase))return;g.active=!0,g.step=e.step,g.mission1Id=e.mission1Id,g.mission2Id=e.mission2Id,g.memory1Id=e.memory1Id,g.phase=e.phase,g.simSpeedBefore=e.simSpeedBefore,g.unsubscribe=_e(()=>{g.active&&(E==null||E.renderGuide(g))}),R({simSpeed:Math.max(1,D().simSpeed)});const t=g.mission1Id?S().missions.find(i=>i.id===g.mission1Id):void 0,s=g.mission2Id?S().missions.find(i=>i.id===g.mission2Id):void 0;if(g.mission1Id&&!t||g.mission2Id&&!s){Je("reset");return}g.phase==="awaiting-m1-complete"&&t?t.status==="completed"?$t(t):I(`mission/${t.id}`):g.phase==="awaiting-save"&&t?I(`missions/${t.id}`):g.phase==="awaiting-m2-complete"&&s?s.status==="completed"?$t(s):I(`mission/${s.id}`):g.phase==="done"&&s?I(`missions/${s.id}`):g.phase==="running"&&(t?g.memory1Id&&!s?yt(ni,0):I(`mission/${t.id}`):yt(si,0))}let Ke="",et="",tt="",ke="",ae="startedAt",me=-1,B=null;function oi(e,t){var r,l,n,d,c;if(ri(),t){const o=F().find(v=>v.id===t||v.code===t);if(o){Cn(e,o);return}}const s=F(),i=Array.from(new Set(s.map(o=>o.robotId)));let a=s.filter(o=>{if(Ke&&!`${o.code} ${o.type} ${o.destinationName} ${o.robotId} ${o.instructions}`.toLowerCase().includes(Ke)||et&&o.status!==et||tt&&o.robotId!==tt)return!1;if(ke){const v=ke==="24h"?864e5:ke==="7d"?6048e5:ke==="30d"?2592e6:7776e6;if((o.startedAt??o.createdAt)<Date.now()-v)return!1}return!0});a=a.sort((o,v)=>{const m=ae==="code"?o.code:ae==="durationSec"?o.durationSec:o.startedAt??o.createdAt,p=ae==="code"?v.code:ae==="durationSec"?v.durationSec:v.startedAt??v.createdAt;return(m<p?-1:m>p?1:0)*me}),e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Mission History</h1>
          <div class="vsub">Every mission recorded with its events, decisions, routes, and the memories it used or created.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="mh-new">${u("plus",14)} New mission</button>
        </div>
      </div>

      <div class="filter-bar">
        <input id="mh-q" class="input grow" placeholder="Search missions, robots, destinations…" value="${Ke}" />
        <select id="mh-status" class="input">
          <option value="">All statuses</option>
          ${["active","paused","queued","completed","failed","cancelled"].map(o=>`<option value="${o}" ${et===o?"selected":""}>${o}</option>`).join("")}
        </select>
        <select id="mh-robot" class="input">
          <option value="">All robots</option>
          ${i.map(o=>`<option value="${o}" ${tt===o?"selected":""}>${o}</option>`).join("")}
        </select>
        <select id="mh-date" class="input">
          <option value="">All time</option>
          ${["24h","7d","30d","90d"].map(o=>`<option value="${o}" ${ke===o?"selected":""}>Last ${o}</option>`).join("")}
        </select>
        <span class="filter-count">${a.length} missions</span>
      </div>

      <section class="panel">
        <div class="panel-body tight">
          ${a.length?`<div class="table-wrap"><table class="data-table">
            <thead><tr>
              <th class="sortable" data-sort="code">Mission ${ae==="code"?me===1?"↑":"↓":""}</th>
              <th>Robot</th><th>Type → Destination</th><th>Status</th><th>Outcome</th>
              <th class="sortable" data-sort="startedAt">Started ${ae==="startedAt"?me===1?"↑":"↓":""}</th>
              <th class="sortable" data-sort="durationSec">Duration ${ae==="durationSec"?me===1?"↑":"↓":""}</th>
              <th>Memories</th><th></th>
            </tr></thead>
            <tbody>
              ${a.map(o=>{var v,m;return`<tr class="clickable" data-mission="${o.id}">
                <td><div class="td-main">${o.code}</div><div class="fs-11 text-dim">${((m=(v=Ae.find(p=>p.id===o.scenarioId))==null?void 0:v.name.split("—")[1])==null?void 0:m.trim())??""}</div></td>
                <td>${de(o.robotId)}</td>
                <td><span class="fs-12">${o.type}</span><div class="fs-11 text-dim">${o.destinationName}</div></td>
                <td>${Y(o.status)}</td>
                <td>${o.outcome?Y(o.outcome):'<span class="text-dim">—</span>'}</td>
                <td class="nowrap text-dim">${Re(o.startedAt)}</td>
                <td class="text-dim">${pe(o.durationSec)}</td>
                <td class="fs-11 text-dim nowrap">${o.memoryIdsRetrieved.length} used · ${o.memoryIdsCreated.length} new</td>
                <td>${u("chevronRight",13)}</td>
              </tr>`}).join("")}
            </tbody>
          </table></div>`:U("mission","No missions match","Adjust filters or create a new mission.")}
        </div>
      </section>
    </div>`,(r=e.querySelector("#mh-new"))==null||r.addEventListener("click",()=>I("mission")),(l=e.querySelector("#mh-q"))==null||l.addEventListener("input",o=>{Ke=o.target.value.toLowerCase(),Se()}),(n=e.querySelector("#mh-status"))==null||n.addEventListener("change",o=>{et=o.target.value,Se()}),(d=e.querySelector("#mh-robot"))==null||d.addEventListener("change",o=>{tt=o.target.value,Se()}),(c=e.querySelector("#mh-date"))==null||c.addEventListener("change",o=>{ke=o.target.value,Se()}),e.querySelectorAll("th.sortable").forEach(o=>o.addEventListener("click",()=>{const v=o.dataset.sort;ae===v?me=me*-1:(ae=v,me=-1),Se()})),e.querySelectorAll("[data-mission]").forEach(o=>o.addEventListener("click",()=>I(`missions/${o.dataset.mission}`)))}function Se(){const e=document.querySelector(".content");e&&oi(e)}function Cn(e,t){var c,o,v,m;const s=P(t.envId),i=S().robots.find(p=>p.id===t.robotId),a=t.memoryIdsRetrieved.map(p=>N().find(y=>y.id===p)).filter(Boolean),r=t.memoryIdsCreated.map(p=>N().find(y=>y.id===p)).filter(Boolean),l=t.status==="completed"&&t.endedAt&&Date.now()-t.endedAt<1e3*60*10,n=r.length>0;t.status==="completed"||t.status==="failed"||t.status;const d=t.route&&t.route.current.length>1;e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${t.code} — ${t.status==="completed"?"Post-Mission Report":"Mission Report"}</h1>
          <div class="vsub">${de(t.robotId,i==null?void 0:i.name)} · ${t.type} → ${t.destinationName} (${s.name}) · ${js(t.priority)}</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="pm-back">${u("chevronRight",13)} History</button>
          ${t.status==="active"||t.status==="paused"?`<button class="btn btn-primary" id="pm-live">${u("sim",14)} Open live workspace</button>`:""}
        </div>
      </div>

      ${t.status==="completed"?`
      <div class="pm-banner ${t.outcome==="success"?"":"fail"}">
        <div class="pm-check">${u(t.outcome==="success"?"check":"warning",20)}</div>
        <div>
          <h3>Mission outcome: ${t.outcome==="success"?"Completed successfully":t.outcome==="partial"?"Completed partially":"Failed"}</h3>
          <p class="fs-12 text-dim">Duration ${pe(t.durationSec)} · ${t.distanceM} m planned · ended ${Re(t.endedAt)}</p>
        </div>
        ${l&&!n?`<button class="btn btn-success ml-auto" id="pm-replay-cta">${u("history",14)} Replay mission</button>`:""}
      </div>`:t.status==="failed"?`
      <div class="pm-banner fail">
        <div class="pm-check">${u("xCircle",20)}</div>
        <div><h3>Mission failed</h3><p class="fs-12 text-dim">${t.problems.join("; ")||"See event log for details."}</p></div>
      </div>`:`
      <div class="info-note mb-16">${u("info",15)}<span>This mission is ${t.status}. The post-mission summary is generated when it finishes.</span></div>`}

      <div class="grid-2-1">
        <div class="stack">
          ${d?`
          <section class="panel">
            <div class="panel-head">
              <div><div class="panel-title">${u("history",15)} Mission Replay</div>
              <div class="panel-sub">Re-live the route, obstacles, decisions and memory retrievals</div></div>
              <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED ENVIRONMENT</span></div>
            </div>
            <div class="panel-body">
              <div class="sim-wrap">
                <canvas id="rp-map" class="sim-canvas" aria-label="Mission replay map"></canvas>
                <div class="sim-overlay-tl" id="rp-overlay"></div>
              </div>
              <div class="sim-controls">
                <button class="btn btn-sm" id="rp-play">${u("play",13)} Play</button>
                <button class="btn btn-sm" id="rp-restart">${u("refresh",13)} Restart</button>
                <input id="rp-slider" type="range" class="input" style="flex:1;min-width:120px" min="0" max="100" value="0" aria-label="Replay timeline" />
                <select id="rp-speed" class="input" style="width:86px" aria-label="Playback speed">
                  <option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option>
                </select>
                <span class="fs-11 text-dim nowrap" id="rp-clock">${t.code}</span>
              </div>
            </div>
          </section>`:""}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("file",15)} What happened</div></div>
            <div class="panel-body">
              <p class="fs-12" style="color:var(--text-2);line-height:1.7">${En(t)}</p>
            </div>
          </section>

          ${t.status==="completed"||t.status==="failed"?Rn(t,a,r):""}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("activity",15)} Event log</div>
            <div class="panel-head-actions"><span class="fs-11 text-dim">${t.events.length} events</span></div></div>
            <div class="panel-body tight">
              ${t.events.length?t.events.slice().reverse().map(p=>`
                <div class="kv-row" style="padding:8px 16px">
                  <span><span class="td-main">${p.title}</span> ${O(p.kind.toUpperCase(),"gray")} ${p.detail?`<div class="fs-11 text-dim" style="white-space:pre-line">${p.detail}</div>`:""}</span>
                  <span class="fs-11 text-dim nowrap">${Ws(p.ts)}</span>
                </div>`).join(""):U("activity","No events","This mission has no recorded events.")}
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("info",15)} Mission facts</div></div>
            <div class="panel-body"><div class="kv-list">
              <div class="kv-row"><span class="k">Status</span><span class="v">${Y(t.status)}</span></div>
              <div class="kv-row"><span class="k">Mode</span><span class="v">${t.mode}</span></div>
              <div class="kv-row"><span class="k">Started</span><span class="v">${Re(t.startedAt)}</span></div>
              <div class="kv-row"><span class="k">Ended</span><span class="v">${Re(t.endedAt)}</span></div>
              <div class="kv-row"><span class="k">Duration</span><span class="v">${pe(t.durationSec)}</span></div>
              <div class="kv-row"><span class="k">Scenario</span><span class="v">${((c=Ae.find(p=>p.id===t.scenarioId))==null?void 0:c.name)??"Custom"}</span></div>
              <div class="kv-row"><span class="k">Route</span><span class="v" style="text-align:right">${((o=t.route)==null?void 0:o.current.map(p=>{var y;return((y=s.nodes.find(w=>w.id===p))==null?void 0:y.name)??p}).join(" → "))??"—"}</span></div>
            </div></div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("brain",15)} Agent decisions</div></div>
            <div class="panel-body">
              ${t.decisions.length?t.decisions.map(p=>`
                <div class="mem-card mb-8">
                  <div class="mem-head"><span class="badge badge-green">DECISION</span><span class="fs-11 text-dim ml-auto">${(p.confidence*100).toFixed(0)}% simulated score</span></div>
                  <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${p.decision}</div>
                  <div class="fs-11 text-dim mt-8">${p.rationale}</div>
                  ${p.sourceMemories.length?`<div class="mem-meta"><span>based on ${p.sourceMemories.join(", ")}</span></div>`:""}
                </div>`).join(""):U("agent","No recorded decisions","Decisions appear when the agent adapts the plan.")}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("warning",15)} Problems encountered</div></div>
            <div class="panel-body">
              ${t.problems.length?t.problems.map(p=>`<div class="kv-row"><span class="k">${u("warning",13)}</span><span class="v">${p}</span></div>`).join(""):'<span class="fs-12 text-dim">None recorded.</span>'}
            </div>
          </section>
        </div>
      </div>
    </div>`,(v=e.querySelector("#pm-back"))==null||v.addEventListener("click",()=>I("missions")),(m=e.querySelector("#pm-live"))==null||m.addEventListener("click",()=>I(`mission/${t.id}`)),d&&Dn(e,t),Tn(e,t,n)}function En(e){var l;const t=e.events.find(n=>n.title==="Obstacle detected"),s=e.decisions.find(n=>/reroute|route via|alternative/i.test(n.decision)),i=e.status==="queued"?"Memory retrieval has not run because this mission has not started.":e.memoryIdsRetrieved.length?`The agent retrieved ${e.memoryIdsRetrieved.length} relevant experience${e.memoryIdsRetrieved.length>1?"s":""} (${e.memoryIdsRetrieved.join(", ")}) and used ${s?"them":"this context"} during planning/execution.`:"No prior experiences were strongly relevant, so the agent planned from map topology alone.",a=t?`Mid-mission, the robot detected an obstacle at ${((l=P(e.envId).nodes.find(n=>n.id===t.atNode))==null?void 0:l.name)??t.atNode??"the planned path"}. ${s?`The agent selected an alternative route: ${s.decision}.`:""}`:e.status==="queued"?"No mission events are recorded because this mission has not started.":"No physical disruptions were recorded.",r=e.status==="completed"?`The mission ${e.outcome==="success"?"completed successfully":"completed partially"} in ${pe(e.durationSec)}.`:e.status==="failed"?`The mission failed: ${e.problems[0]??"see events"}.`:e.status==="queued"?"The mission is queued and has not started.":e.status==="paused"?`The mission is paused at ${Math.round(e.progress)}% progress.`:e.status==="cancelled"?"The mission was cancelled by the operator.":"The mission is in progress.";return`${a} ${i} ${r}`}function Rn(e,t,s){return`
    <section class="panel">
      <div class="panel-head"><div class="panel-title">${u("brain",15)} Learned experience</div></div>
      <div class="panel-body">
        <div class="learned-box">
          <div class="lb-k">WHAT THE SYSTEM LEARNED</div>
          <p>${An(e)}</p>
        </div>
        <div class="flex mt-8" style="gap:9px">
          <button class="btn btn-primary" id="pm-save-mem" ${s.length?"disabled":""}>${s.length?u("check",14)+" Experience saved":u("memory",14)+" Save Experience to Long-Term Memory"}</button>
          ${wt()&&!s.length?`<span class="fs-11 text-dim" style="align-self:center">${xn()}</span>`:""}
        </div>
        ${s.length?`<div class="mt-8">${s.map(i=>`
          <div class="mem-card flash clickable" data-nav="memory/${i.id}">
            <div class="mem-head"><span class="mem-id" style="color:var(--green)">${i.id}</span>${O(i.category,"violet")}<span class="ml-auto fs-11 text-dim">${W(i.createdAt)}</span></div>
            <div class="mem-text">${i.text}</div>
          </div>`).join("")}</div>`:""}
      </div>
    </section>

    <div class="grid-2">
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${u("memory",15)} Memories retrieved</div>
        <div class="panel-head-actions"><span class="fs-11 text-dim">${t.length}</span></div></div>
        <div class="panel-body">
          ${t.length?t.map(i=>`
            <div class="mem-card mb-8 clickable" data-nav="memory/${i.id}">
              <div class="mem-head"><span class="mem-id">${i.id}</span>${O(i.category,"violet")}<span class="ml-auto">${Xe(i.relevance)}</span></div>
              <div class="mem-text clamp-2">${i.text}</div>
            </div>`).join(""):'<span class="fs-12 text-dim">No memories were retrieved for this mission.</span>'}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${u("route",15)} Recommended strategy for future missions</div></div>
        <div class="panel-body fs-12" style="color:var(--text-2);line-height:1.7">${Ln(e)}</div>
      </section>
    </div>`}function An(e){var i,a;const t=e.events.find(r=>r.title==="Obstacle detected"),s=e.decisions.find(r=>/reroute|route via|alternative/i.test(r.decision));if(t&&s){const r=((i=P(e.envId).nodes.find(l=>l.id===t.atNode))==null?void 0:i.name)??"the planned path";return`${e.robotId} encountered an obstruction at ${r} during ${e.type.toLowerCase()} to ${e.destinationName}. ${s.decision} — and the mission completed using the alternative. Future missions to ${e.destinationName} should consider this route proactively.`}return e.problems.some(r=>/battery/i.test(r))?`${e.robotId} reached low battery during this mission. Charge before similar missions, or assign a robot above 60% battery.`:e.outcome==="success"?`Clean ${e.type.toLowerCase()} to ${e.destinationName}. Route via ${(a=e.route)==null?void 0:a.current.map(r=>{var l;return(l=P(e.envId).nodes.find(n=>n.id===r))==null?void 0:l.name}).join(" → ")} proved reliable.`:`Mission outcome was ${e.outcome??e.status}. Review the event log before repeating this configuration.`}function Ln(e){var s,i;const t=e.events.find(a=>a.title==="Obstacle detected");if(t&&t.atNode){const a=(s=P(e.envId).nodes.find(l=>l.id===t.atNode))==null?void 0:s.name,r=(i=e.route)==null?void 0:i.current.map(l=>{var n;return(n=P(e.envId).nodes.find(d=>d.id===l))==null?void 0:n.name}).join(" → ");return`For <b style="color:var(--text-1)">${e.destinationName}</b>: prefer the route that avoids <b style="color:var(--text-1)">${a}</b> (known obstruction). The route that worked here: ${r}. The agent will propose this automatically when planning similar missions.`}return e.problems.some(a=>/battery/i.test(a))?`Start ${e.type.toLowerCase()} missions for ${e.robotId} at ≥ 60% battery or schedule a charge stop. Battery-critical events correlate with failed completions.`:`Current strategy remains valid: ${e.type.toLowerCase()} to ${e.destinationName} via the planned route. Keep retrieving related memories before each run.`}function Tn(e,t,s){const i=e.querySelector("#pm-save-mem");i&&!s&&i.addEventListener("click",()=>{i.disabled||(i.disabled=!0,i.innerHTML='<span class="spinner"></span> Saving…',setTimeout(()=>{const a=Xs(t);q("success","Experience saved to long-term memory",`${a.id} created via the memory service.`),ii(a.id),Se()},500))})}function Dn(e,t){const s=e.querySelector("#rp-map"),i=e.querySelector("#rp-slider"),a=e.querySelector("#rp-play"),r=e.querySelector("#rp-restart"),l=e.querySelector("#rp-speed"),n=e.querySelector("#rp-clock"),d=e.querySelector("#rp-overlay"),c=Math.max(1,t.durationSec);B={playing:!1,t:0,speed:1,raf:0};const o=()=>{const m=B.t,p=t.route.current,y=m/100*(p.length-1),w=Math.min(p.length-2,Math.floor(y)),f=y-w,h=P(t.envId),$=h.nodes.find(A=>A.id===p[w]),k=h.nodes.find(A=>A.id===p[Math.min(p.length-1,w+1)]),x=$&&k?{x:$.x+(k.x-$.x)*f,y:$.y+(k.y-$.y)*f}:null;Ks(s,{envId:t.envId,route:{...t.route,pointIndex:w,current:p.slice(0,w+2)},robotXY:x,highlightNodes:[t.destinationNode],blockedNodeIds:t.events.filter(A=>A.title==="Obstacle detected").map(A=>A.atNode).filter(Boolean),progressPct:m,animatePulse:!1});const b=m/100*c,C=t.events.filter(A=>(A.ts-(t.startedAt??t.createdAt))/1e3<=b).slice(-1)[0];d.innerHTML=C?`<span class="badge ${C.severity==="critical"?"badge-red":C.severity==="warning"?"badge-amber":"badge-blue"}">${C.title}</span>`:'<span class="badge badge-gray">Start</span>',n.textContent=`${Math.floor(b/60)}:${String(Math.floor(b%60)).padStart(2,"0")} / ${pe(c)}`,Math.abs(parseFloat(i.value)-m)>1&&(i.value=String(Math.round(m)))},v=()=>{if(B.playing){if(B.t=Math.min(100,B.t+.35*B.speed),o(),B.t>=100){B.playing=!1,a.innerHTML=`${u("play",13)} Play`;return}B.raf=requestAnimationFrame(v)}};a.addEventListener("click",()=>{B.playing?(B.playing=!1,a.innerHTML=`${u("play",13)} Play`):(B.t>=100&&(B.t=0),B.playing=!0,a.innerHTML=`${u("pause",13)} Pause`,v())}),r.addEventListener("click",()=>{B.t=0,B.playing=!1,a.innerHTML=`${u("play",13)} Play`,o()}),i.addEventListener("input",()=>{B.t=parseFloat(i.value),B.playing=!1,a.innerHTML=`${u("play",13)} Play`,o()}),l.addEventListener("change",()=>{B.speed=parseFloat(l.value)}),o()}function ri(){B&&(cancelAnimationFrame(B.raf),B=null)}const Nn=["Navigation","Obstacles","Battery","Environment","Mission Strategy","Robot Behavior","Failures","Successful Strategies","Safety","Operator Preferences"];let st="",it="",nt="",se=null;function di(e,t){var n,d,c;t&&(se=t);const s=N(),i=St();D();const a=s.filter(o=>!(st&&o.category!==st||it&&o.robotId!==it||nt&&!`${o.id} ${o.text} ${o.tags.join(" ")}`.toLowerCase().includes(nt))),r=Array.from(new Set(s.map(o=>o.robotId))),l=se?s.find(o=>o.id===se):void 0;e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Persistent Memory Center</h1>
          <div class="vsub">The fleet's accumulated operational knowledge. Every mission can leave experience behind — and every new mission can recall it.</div>
        </div>
        <div class="view-head-actions">
          <span class="badge badge-cyan">SIMULATED · LOCAL STORE</span>
        </div>
      </div>

      <div class="stat-grid memory-stat-grid">
        ${at(s.length,"Total memories","database")}
        ${at(s.filter(o=>o.retrievalCount>0).length,"Retrieved ≥1×","refresh")}
        ${at(i.filter(o=>o.status==="open").length,"Open conflicts","warning")}
        ${at(S().memRetrievedToday.count,"Retrievals today","brain")}
      </div>

      <section class="panel mt">
        <div class="panel-head memory-store-head">
          <div><div class="panel-title">${u("filter",15)} Memory Store</div><div class="panel-sub">${a.length} of ${s.length} memories</div></div>
          <div class="panel-head-actions">
            <input id="mem-q" class="input" style="width:180px" placeholder="Search memories…" value="${K(nt)}" />
            <select id="mem-cat" class="input" style="width:150px">
              <option value="">All categories</option>
              ${Nn.map(o=>`<option ${st===o?"selected":""}>${o}</option>`).join("")}
            </select>
            <select id="mem-robot" class="input" style="width:100px">
              <option value="">All robots</option>
              ${r.map(o=>`<option ${it===o?"selected":""}>${o}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="panel-body tight">
          ${a.length?`<div class="table-wrap"><table class="data-table">
            <thead><tr><th>Memory</th><th>Robot</th><th>Category</th><th>Created</th><th>Last Retrieved</th><th>Relevance</th><th></th></tr></thead>
            <tbody>
              ${a.map(o=>`<tr class="clickable ${o.id===se?"sel-row":""}" data-mem="${o.id}">
                <td><div class="td-main text-mono" style="font-size:11.5px;color:#b3a8f8">${o.id}</div><div class="clamp-2 fs-11 text-dim" style="max-width:340px">${o.text}</div></td>
                <td class="nowrap">${o.robotId}</td>
                <td>${O(o.category,"violet")}</td>
                <td class="nowrap text-dim">${ie(o.createdAt)}</td>
                <td class="nowrap text-dim">${o.lastRetrievedAt?W(o.lastRetrievedAt):"never"}</td>
                <td>${Xe(o.relevance)}</td>
                <td>${u("chevronRight",13)}</td>
              </tr>`).join("")}
            </tbody>
          </table></div>`:U("memory","No memories match","Adjust the filters, or complete more missions to generate experience.")}
        </div>
      </section>

      ${i.length?`
      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${u("warning",15)} Memory Conflicts</div>
          <div class="panel-sub">Contradictory experiences. The system never assumes one side is automatically correct.</div></div>
        </div>
        <div class="panel-body">
          ${i.map(o=>qn(o)).join("")}
        </div>
      </section>`:""}
    </div>`,l&&li(l),(n=e.querySelector("#mem-q"))==null||n.addEventListener("input",o=>{nt=o.target.value.toLowerCase(),Ie()}),(d=e.querySelector("#mem-cat"))==null||d.addEventListener("change",o=>{st=o.target.value,Ie()}),(c=e.querySelector("#mem-robot"))==null||c.addEventListener("change",o=>{it=o.target.value,Ie()}),e.querySelectorAll("[data-mem]").forEach(o=>{o.addEventListener("click",()=>{se=o.dataset.mem,Ie()})}),e.querySelectorAll("[data-resolve]").forEach(o=>{o.addEventListener("click",()=>{const v=o.dataset.resolve,m=o.dataset.strategy,p={recency:"Recent observation kept as primary guidance; older memory retained as context.","context-conditional":"Both memories kept with context conditions (time-of-day / environment state).","keep-both":"Both memories retained; agent will verify live conditions before deciding."};Ts(v,m,p[m]),q("success","Conflict resolved",p[m]),Ie()})})}function Ie(){const e=document.querySelector(".content");if(e&&(di(e,se??void 0),se)){const t=N().find(s=>s.id===se);t&&li(t)}}function at(e,t,s){return`<div class="stat-card"><div class="stat-top">${u(s,13)}<span>${t}</span></div><div class="stat-value">${e}</div></div>`}function qn(e){const t=S().memories.find(i=>i.id===e.memoryAId),s=S().memories.find(i=>i.id===e.memoryBId);return!t||!s?"":`
    <div class="mb-16">
      <div class="flex mb-8" style="gap:8px">
        <span class="td-main" style="color:var(--text-1);font-weight:650">${K(e.topic)}</span>
        ${Os(e.status==="open"?"warning":"success")}
        <span class="badge badge-plain">${e.status.toUpperCase()}</span>
        <span class="fs-11 text-dim ml-auto">detected ${W(e.detectedAt)}</span>
      </div>
      <div class="conflict-wrap">
        <div class="conflict-side old">
          <div class="fs-11 text-dim mb-8">OLDER EXPERIENCE — ${t.id} · ${ie(t.createdAt)} · confidence ${(t.confidence*100).toFixed(0)}%</div>
          <div class="fs-12" style="color:var(--text-2)">“${K(t.text)}”</div>
        </div>
        <div class="conflict-vs"><span>VS</span></div>
        <div class="conflict-side new">
          <div class="fs-11 mb-8" style="color:#b3a8f8">RECENT EXPERIENCE — ${s.id} · ${ie(s.createdAt)} · confidence ${(s.confidence*100).toFixed(0)}%</div>
          <div class="fs-12" style="color:var(--text-2)">“${K(s.text)}”</div>
        </div>
      </div>
      ${e.status==="open"?`
        <div class="resolve-note">${u("info",14)} Conflicting experiences detected. The more recent context may require reevaluation — but the older experience may still hold in different conditions. Choose how the agent should treat this, or keep both and let it verify live conditions.</div>
        <div class="resolve-actions">
          <button class="btn btn-sm" data-resolve="${e.id}" data-strategy="recency">Favor recent observation</button>
          <button class="btn btn-sm" data-resolve="${e.id}" data-strategy="context-conditional">Make context-conditional</button>
          <button class="btn btn-sm" data-resolve="${e.id}" data-strategy="keep-both">Keep both — verify live</button>
        </div>`:`
        <div class="info-note mt-8" style="border-color:rgba(52,211,153,.3)">${u("checkCircle",15)}<span><b style="color:var(--text-1)">Resolution (${e.resolvedStrategy}):</b> ${K(e.resolution??"")}</span></div>`}
    </div>`}function li(e){var a,r,l;const t=e.evolution??[],i=De({robotId:e.robotId,envId:e.envId,text:e.text,limit:3}).hits.map(n=>n.memory).filter(n=>n.id!==e.id);Fs({title:`${e.id} — ${e.category}`,wide:!0,onClose:()=>{se=null},body:`
      <div class="mem-text" style="font-size:13.5px;color:var(--text-1)">“${K(e.text)}”</div>
      <div class="flex flex-wrap mt-8" style="gap:6px">${e.tags.map(n=>`<span class="tag">${K(n)}</span>`).join("")}</div>
      <div class="grid-2 mt-16">
        <div class="kv-list">
          <div class="kv-row"><span class="k">Robot</span><span class="v">${e.robotId}</span></div>
          <div class="kv-row"><span class="k">Source mission</span><span class="v">${e.missionCode??e.missionId}</span></div>
          <div class="kv-row"><span class="k">Environment</span><span class="v">${e.envId}</span></div>
          <div class="kv-row"><span class="k">Created</span><span class="v">${ie(e.createdAt)}</span></div>
        </div>
        <div class="kv-list">
          <div class="kv-row"><span class="k">Last retrieved</span><span class="v">${e.lastRetrievedAt?W(e.lastRetrievedAt):"never"}</span></div>
          <div class="kv-row"><span class="k">Retrieval count</span><span class="v">${e.retrievalCount}×</span></div>
          <div class="kv-row"><span class="k">Confidence</span><span class="v">${(e.confidence*100).toFixed(0)}%</span></div>
          <div class="kv-row"><span class="k">Origin</span><span class="v">Internal simulation</span></div>
        </div>
      </div>

      ${t.length?`
      <div class="panel-title mt-16" style="margin-bottom:8px">${u("layers",14)} Memory Evolution</div>
      <div class="evo-track">
        ${t.map((n,d)=>`
          <div class="evo-step">
            <div class="evo-week">Stage ${d+1} · ${ie(n.ts)}</div>
            <div class="evo-card">${K(n.text)}<div class="evo-conf fs-11 text-dim">confidence ${(n.confidence*100).toFixed(0)}%</div></div>
          </div>`).join("")}
      </div>`:""}

      ${i.length?`
      <div class="panel-title mt-16" style="margin-bottom:8px">${u("link",14)} Related experiences</div>
      ${i.map(n=>`<div class="mem-card mb-8" style="padding:9px 12px"><div class="flex" style="gap:8px"><span class="mem-id">${n.id}</span>${Xe(n.relevance)}</div><div class="fs-11 text-dim clamp-2">${K(n.text)}</div></div>`).join("")}`:""}

      <div class="info-note mem-note mt-16">${u("info",15)}<span>This memory belongs to the local simulated store. Mission planning can retrieve it through FleetMinder's Memory Service; Hindsight is not connected in this build.</span></div>`,footer:`
      <button class="btn" id="md-close">Close</button>
      ${t.length?`<button class="btn" id="md-evolve">${u("layers",13)} Record new observation</button>`:`<button class="btn" id="md-evolve">${u("layers",13)} Start evolution</button>`}
      <button class="btn btn-primary" id="md-mission">Open source mission</button>`}),(a=document.getElementById("md-close"))==null||a.addEventListener("click",Ee),(r=document.getElementById("md-mission"))==null||r.addEventListener("click",()=>{Ee(),se=null,I(`missions/${e.missionCode??""}`)}),(l=document.getElementById("md-evolve"))==null||l.addEventListener("click",()=>{const n=window.prompt("New consolidated observation (replaces the memory text):",e.text);n&&n.trim()&&n!==e.text&&(Wi(e.id,{label:"Manual update",text:n.trim(),confidence:Math.min(.97,e.confidence+.03)}),q("success","Memory evolved",`${e.id} now reflects the new observation.`),Ee(),Ie())})}let ms=null;function ci(e){var i;const t=F().filter(a=>a.memoryIdsRetrieved.length>0||a.status==="active"),s=t.find(a=>a.id===ms)??t[0];e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Memory Recall Flow</h1>
          <div class="vsub">How a live mission taps the fleet's persistent experience — from context, to search, to decision.</div>
        </div>
        <div class="view-head-actions">
          <select id="rc-mission" class="input" aria-label="Select mission">
            ${t.map(a=>`<option value="${a.id}" ${(s==null?void 0:s.id)===a.id?"selected":""}>${a.code} — ${a.robotId} → ${a.destinationName}</option>`).join("")}
          </select>
        </div>
      </div>

      ${s?`
      <section class="panel">
        <div class="panel-body">
          ${Pn(s.id)}
        </div>
      </section>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("link",15)} How retrieval scored these memories</div></div>
          <div class="panel-body">
            ${Hn(s)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("agent",15)} Agent's decision context</div></div>
          <div class="panel-body">
            ${s.decisions.length?s.decisions.map(a=>`
              <div class="mem-card mb-8">
                <div class="mem-head"><span class="badge badge-green">DECISION</span><span class="fs-11 text-dim ml-auto">${(a.confidence*100).toFixed(0)}% simulated score</span></div>
                <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${a.decision}</div>
                <div class="fs-11 text-dim mt-8">${a.rationale}</div>
              </div>`).join(""):`
              <div class="info-note">${u("info",15)}<span>No reroute decisions recorded for this mission yet. Decisions appear when the agent adapts the route or weighs conflicting memories.</span></div>`}
            <div class="info-note mem-note mt-8">${u("brain",15)}<span>Retrieval combines environment match, robot ownership, destination relevance, content overlap, and recency. Percentages are simulated heuristic scores, not probabilities. It runs against the local store; Hindsight is not connected in this build.</span></div>
          </div>
        </section>
      </div>`:U("brain","No mission with memory activity yet","Start a mission — the recall flow will visualize here live.")}
    </div>`,(i=e.querySelector("#rc-mission"))==null||i.addEventListener("change",a=>{ms=a.target.value,ci(e)}),e.querySelectorAll("[data-nav]").forEach(a=>a.addEventListener("click",r=>{r.stopPropagation(),I(a.dataset.nav)}))}function Pn(e){const t=F().find(i=>i.id===e),s=De({robotId:t.robotId,envId:t.envId,destinationNode:t.destinationNode,text:`${t.type} ${t.destinationName}`,limit:3}).hits;return`
    <div class="recall-flow">
      <div class="rf-node rf-mission">
        <div class="rf-k">Current mission</div>
        <div class="rf-v">${t.code} · ${t.robotId} → ${t.destinationName}</div>
        <div class="rf-d">${t.type} · ${t.envId} · status ${t.status}</div>
      </div>
      <div class="rf-arrow">${u("arrowDown",15)}</div>
      <div class="rf-node rf-search">
        <div class="rf-k">Searching persistent memory</div>
        <div class="rf-v">Query: robot ${t.robotId} · ${t.envId} · ${t.destinationName}</div>
        <div class="rf-d">Memory Service → ${S().robots.length?"internal store":"store"}</div>
      </div>
      <div class="rf-arrow">${u("arrowDown",15)}</div>
      <div class="rf-node">
        <div class="rf-k">Result</div>
        <div class="rf-v">${s.length} relevant experience${s.length===1?"":"s"} found</div>
      </div>
      <div class="rf-arrow">${u("arrowDown",15)}</div>
      <div class="rf-mem-row">
        ${s.length?s.map(i=>`
          <div class="mem-card clickable flash" data-nav="memory/${i.memory.id}">
            <div class="mem-head">
              <span class="mem-id">${i.memory.id}</span>
              ${O(i.memory.category,"violet")}
              <span class="ml-auto">${Xe(i.score)}</span>
            </div>
            <div class="mem-text">${i.memory.text}</div>
            <div class="mem-meta">
              <span>${u("robot",11)} ${i.memory.robotId}</span>
              <span>${u("history",11)} ${W(i.memory.createdAt)}</span>
              <span>${u("refresh",11)} retrieved ${i.memory.retrievalCount}×</span>
              ${i.reasons[0]?`<span>${u("zap",11)} ${i.reasons[0]}</span>`:""}
            </div>
          </div>`).join(""):'<div class="fs-12 text-dim" style="text-align:center">No memories passed the relevance threshold for this query.</div>'}
      </div>
      <div class="rf-arrow">${u("arrowDown",15)}</div>
      <div class="rf-node rf-decision">
        <div class="rf-k">Mission agent decision</div>
        ${Bn(t,s.map(i=>i.memory.id))}
      </div>
    </div>`}function Bn(e,t){const s=e.decisions.find(i=>i.phase==="planning")??e.decisions[0];return s?`<div class="rf-v" style="font-size:12.5px">${s.decision}</div><div class="rf-d">${s.rationale}${t.length?` · based on ${t.join(", ")}`:""}</div>`:`<div class="rf-v" style="font-size:12.5px">${t.length?`Use previous experience (${t.join(", ")}) when planning this mission`:"Proceed with standard plan — no prior experience to apply"}</div><div class="rf-d">Agent will monitor execution and adapt if conditions change.</div>`}function Hn(e){const t=De({robotId:e.robotId,envId:e.envId,destinationNode:e.destinationNode,text:`${e.type} ${e.destinationName}`,limit:5});return t.hits.length?t.hits.map(s=>`
    <div class="kv-row">
      <span style="min-width:0"><span class="mem-id">${s.memory.id}</span> <span class="fs-11 text-dim">${s.reasons.join(" · ")||"baseline relevance"}</span></span>
      <span>${Xe(s.score)}</span>
    </div>`).join(""):'<span class="fs-12 text-dim">No scored hits for this context.</span>'}function At(e){const t=window.devicePixelRatio||1,s=e.getBoundingClientRect(),i=s.width||300,a=s.height||160;e.width=i*t,e.height=a*t;const r=e.getContext("2d");return r.setTransform(t,0,0,t,0,0),{ctx:r,w:i,h:a}}function vi(e,t,s,i,a,r=""){e.strokeStyle="rgba(148,163,203,0.1)",e.fillStyle="rgba(148,163,203,0.55)",e.font="10px ui-sans-serif, system-ui",e.textAlign="right";const l=4;for(let n=0;n<=l;n++){const d=Math.round(a/l*n),c=i.t+(s-i.t-i.b)*(1-n/l);e.beginPath(),e.moveTo(i.l,c),e.lineTo(t-i.r,c),e.stroke(),e.fillText(`${d}${r}`,i.l-6,c+3)}}function hs(e,t,s,i={}){const{ctx:a,w:r,h:l}=At(e),n={l:34,r:8,t:10,b:22},d=Math.max(1,...s.flatMap(y=>y.values))*1.15,c=r-n.l-n.r,o=l-n.t-n.b,v=t.length,m=c/Math.max(1,v),p=Math.max(2,m*.62/s.length);vi(a,r,l,n,Math.ceil(d),i.unit??""),t.forEach((y,w)=>{const f=n.l+w*m;s.forEach((h,$)=>{const x=(h.values[w]??0)/d*o,b=f+(m-p*s.length)/2+$*p;a.fillStyle=h.color,a.beginPath();const C=Math.min(3,p/2,x/2),A=l-n.b-x;a.roundRect(b,A,p-1,x,[C,C,0,0]),a.fill()}),a.fillStyle="rgba(148,163,203,0.6)",a.font="9.5px ui-sans-serif, system-ui",a.textAlign="center",(v<=14||w%Math.ceil(v/12)===0)&&a.fillText(y,f+m/2,l-n.b+13)}),ts(e,y=>{const w=Math.floor((y-n.l)/c*v);if(w<0||w>=v)return null;const f=s.map(h=>`${h.label}: <b>${h.values[w]??0}${i.unit??""}</b>`).join("<br>");return{label:t[w],html:f}})}function We(e,t,s,i={}){const{ctx:a,w:r,h:l}=At(e),n={l:34,r:8,t:10,b:22},d=s.flatMap($=>$.values);let c=Math.max(1,...d),o=Math.min(0,...d);i.yMax!==void 0&&(c=i.yMax),i.yMin!==void 0&&(o=i.yMin);const v=c-o||1,m=r-n.l-n.r,p=l-n.t-n.b,y=Math.max(1,t.length);vi(a,r,l,n,Math.round(c),i.unit??"");const w=$=>n.l+m*$/Math.max(1,y-1),f=$=>n.t+p*(1-($-o)/v);s.forEach($=>{a.strokeStyle=$.color,a.lineWidth=1.8,a.beginPath(),$.values.forEach((k,x)=>{const b=w(x),C=f(k);x===0?a.moveTo(b,C):a.lineTo(b,C)}),a.stroke(),y<=30&&$.values.forEach((k,x)=>{a.fillStyle=$.color,a.beginPath(),a.arc(w(x),f(k),1.8,0,Math.PI*2),a.fill()})}),a.fillStyle="rgba(148,163,203,0.6)",a.font="9.5px ui-sans-serif, system-ui",a.textAlign="center";const h=Math.max(1,Math.ceil(y/8));t.forEach(($,k)=>{k%h===0&&a.fillText($,w(k),l-n.b+13)}),ts(e,$=>{const k=Math.round(($-n.l)/m*(y-1));if(k<0||k>=y)return null;const x=s.map(b=>`${b.label}: <b>${(b.values[k]??0).toFixed(1)}${i.unit??""}</b>`).join("<br>");return{label:t[k],html:x}})}function On(e,t,s){const{ctx:i,w:a,h:r}=At(e),l=a/2,n=r/2,d=Math.min(a,r)/2-8,c=t.reduce((v,m)=>v+m.value,0)||1;let o=-Math.PI/2;t.forEach(v=>{const m=v.value/c*Math.PI*2;i.beginPath(),i.arc(l,n,d,o,o+m),i.strokeStyle=v.color,i.lineWidth=Math.max(10,d*.3),i.stroke(),o+=m}),s&&(i.fillStyle="rgba(232,237,247,0.95)",i.font="700 18px ui-sans-serif, system-ui",i.textAlign="center",i.fillText(s,l,n+2)),ts(e,(v,m)=>{const p=v-l,y=m-n,w=Math.hypot(p,y);if(w<d*.6||w>d+4)return null;let f=Math.atan2(y,p)+Math.PI/2;for(;f<0;)f+=Math.PI*2;let h=0;for(const $ of t){const k=$.value/c*Math.PI*2;if(f>=h&&f<h+k)return{label:$.label,html:`<b>${$.value}</b> items`};h+=k}return null})}function fs(e,t){const{ctx:s,w:i,h:a}=At(e),r={l:118,r:30,t:6,b:6},l=Math.max(1,...t.map(d=>d.value)),n=(a-r.t-r.b)/Math.max(1,t.length);t.forEach((d,c)=>{const o=r.t+c*n,v=(i-r.l-r.r)*d.value/l;s.fillStyle="rgba(148,163,203,0.08)",s.beginPath(),s.roundRect(r.l,o+n*.2,i-r.l-r.r,n*.6,3),s.fill(),s.fillStyle=d.color??"var(--accent)",s.beginPath(),s.roundRect(r.l,o+n*.2,Math.max(2,v),n*.6,3),s.fill(),s.fillStyle="rgba(154,167,196,0.95)",s.font="10.5px ui-sans-serif, system-ui",s.textAlign="right",s.fillText(d.label,r.l-8,o+n*.5+3.5),s.textAlign="left",s.fillStyle="rgba(232,237,247,0.9)",s.fillText(String(d.value),r.l+Math.max(2,v)+6,o+n*.5+3.5)})}const gs=new WeakMap;function ts(e,t){var i;let s=gs.get(e);if(!s){const a=document.createElement("div");a.className="chart-tip",a.style.display="none",(i=e.parentElement)==null||i.appendChild(a),s={el:a,canvas:e},gs.set(e,s),e.addEventListener("mousemove",r=>{const l=e.getBoundingClientRect(),n=t(r.clientX-l.left,r.clientY-l.top);n?(a.innerHTML=`<div class="text-dim fs-11">${n.label}</div>${n.html}`,a.style.display="block",a.style.left=`${r.clientX-l.left}px`,a.style.top=`${r.clientY-l.top}px`):a.style.display="none"}),e.addEventListener("mouseleave",()=>{a.style.display="none"})}}function xt(e){return`<div class="chart-legend">${e.map(t=>`<span><span class="lg-swatch" style="background:${t.color}"></span>${t.label}</span>`).join("")}</div>`}let ot="",rt="",te=[];function pi(e,t){var r,l,n;if(t){jt(e,t);return}const s=J(),i=F(),a=s.filter(d=>!(ot&&d.status!==ot||rt&&!`${d.id} ${d.name} ${d.model} ${d.location}`.toLowerCase().includes(rt)));e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Robot Fleet</h1>
          <div class="vsub">Each robot accumulates an operational profile derived from its mission history — strengths, issues, and learned preferences.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="cmp-toggle">${u("compare",14)} Compare (${te.length})</button>
        </div>
      </div>

      <div class="filter-bar">
        <input id="flt-q" class="input grow" placeholder="Search robots…" value="${rt}" />
        <select id="flt-status" class="input">
          <option value="">All statuses</option>
          ${["online","executing","idle","charging","warning","offline"].map(d=>`<option value="${d}" ${ot===d?"selected":""}>${d}</option>`).join("")}
        </select>
        <span class="filter-count">${a.length} robots</span>
      </div>

      <div class="compare-grid">
        ${a.map(d=>jn(d,i)).join("")}
      </div>

      <div id="compare-area"></div>
    </div>`,(r=e.querySelector("#flt-q"))==null||r.addEventListener("input",d=>{rt=d.target.value.toLowerCase(),mt()}),(l=e.querySelector("#flt-status"))==null||l.addEventListener("change",d=>{ot=d.target.value,mt()}),(n=e.querySelector("#cmp-toggle"))==null||n.addEventListener("click",()=>{if(te.length<2){q("info","Select robots to compare","Click “Add to compare” on at least two robot cards.");return}Fn(e.querySelector("#compare-area"))}),e.querySelectorAll("[data-nav]").forEach(d=>d.addEventListener("click",c=>{c.stopPropagation(),I(d.dataset.nav)})),e.querySelectorAll("[data-cmp]").forEach(d=>d.addEventListener("click",c=>{c.stopPropagation();const o=d.dataset.cmp;te.includes(o)?te=te.filter(v=>v!==o):te.length<3?te.push(o):q("warning","Compare limit","Up to 3 robots can be compared."),mt()}))}function mt(){const e=document.querySelector(".content");e&&pi(e)}function jn(e,t){const s=t.filter(r=>r.robotId===e.id),i=s.filter(r=>r.outcome==="success").length,a=s.find(r=>r.status==="active");return`
    <div class="compare-card clickable" data-nav="fleet/${e.id}" role="button" tabindex="0" style="cursor:pointer">
      <div class="flex" style="gap:10px">
        ${de(e.id,e.name)}
        <span class="ml-auto">${Y(e.status)}</span>
      </div>
      <div class="fs-11 text-dim mt-8">${e.model} · ${e.location}</div>
      <div class="mt-8">${Qe(e.battery)}</div>
      <div class="mt-8">${Et(e.signal)}</div>
      <div class="compare-row" style="margin-top:8px"><span class="text-dim">Current mission</span><span>${a?a.code:"—"}</span></div>
      <div class="compare-row"><span class="text-dim">Missions</span><span>${e.missionCount}</span></div>
      <div class="compare-row"><span class="text-dim">Success rate</span><span>${Math.round(e.successCount/Math.max(1,e.missionCount)*100)}%</span></div>
      <div class="compare-row"><span class="text-dim">Health</span><span>${O(`${e.healthScore}/100`,e.healthScore>85?"green":e.healthScore>70?"amber":"red")}</span></div>
      <div class="compare-row"><span class="text-dim">Last maintenance</span><span>${ie(new Date(e.lastMaintenance).getTime())}</span></div>
      <div class="flex mt-8">
        <span class="fs-11 text-dim">${s.length} tracked missions · ${i} successful</span>
        <button class="btn btn-sm btn-ghost ml-auto" data-cmp="${e.id}">${te.includes(e.id)?"✓ Comparing":"+ Compare"}</button>
      </div>
    </div>`}function Fn(e){var a;const t=J().filter(r=>te.includes(r.id)),s=F(),i=[["Status",r=>Y(r.status)],["Battery",r=>`${Math.round(r.battery)}%`],["Signal",r=>`${r.signal}%`],["Health",r=>`${r.healthScore}/100`],["Missions",r=>String(r.missionCount)],["Success rate",r=>`${Math.round(r.successCount/Math.max(1,r.missionCount)*100)}%`],["Avg duration",r=>{const l=s.filter(n=>n.robotId===r.id&&n.durationSec>0);return l.length?pe(l.reduce((n,d)=>n+d.durationSec,0)/l.length):"—"}],["Memories held",r=>String(N().filter(l=>l.robotId===r.id).length)],["Last maintenance",r=>ie(new Date(r.lastMaintenance).getTime())]];e.innerHTML=`
    <section class="panel mt">
      <div class="panel-head">
        <div class="panel-title">${u("compare",15)} Robot Comparison</div>
        <div class="panel-head-actions"><button class="btn btn-sm" id="cmp-clear">Clear</button></div>
      </div>
      <div class="panel-body">
        <div class="grid-3">
          ${t.map(r=>`
            <div class="compare-card">
              <div class="flex mb-8">${de(r.id,r.name)}<span class="ml-auto">${Y(r.status)}</span></div>
              ${i.map(([l,n])=>`<div class="compare-row"><span class="text-dim">${l}</span><span>${n(r)}</span></div>`).join("")}
            </div>`).join("")}
        </div>
      </div>
    </section>`,(a=e.querySelector("#cmp-clear"))==null||a.addEventListener("click",()=>{te=[],e.innerHTML="",mt()})}let he="overview";function jt(e,t){var d,c;const s=J().find(o=>o.id===t);if(!s){I("fleet");return}const i=F().filter(o=>o.robotId===t),a=N().filter(o=>o.robotId===t),r=S().telemetry[t]??[],l=[["overview","Overview"],["missions","Mission History"],["memory","Memory"],["performance","Performance"],["telemetry","Telemetry"],["events","Events"]];e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${de(s.id,s.name)} <span style="font-weight:400;color:var(--text-3);font-size:14px">· ${s.model}</span></h1>
          <div class="vsub flex flex-wrap" style="gap:6px">${Y(s.status)} ${O(s.location,"gray")} ${O(`${s.battery}% battery`,s.battery>40?"green":"amber")} ${O(`Health ${s.healthScore}/100`,s.healthScore>85?"green":"amber")}</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="rd-back">${u("chevronRight",13)} Back to fleet</button>
          ${s.currentMissionId?`<button class="btn btn-primary" id="rd-mission">${u("mission",14)} Current mission</button>`:""}
        </div>
      </div>

      <div class="tab-bar">
        ${l.map(([o,v])=>`<button data-tab="${o}" class="${he===o?"active":""}">${v}</button>`).join("")}
      </div>
      <div id="rd-body"></div>
    </div>`;const n=e.querySelector("#rd-body");he==="overview"?n.innerHTML=Wn(s,i,a):he==="missions"?n.innerHTML=zn(i):he==="memory"?n.innerHTML=Vn(a):he==="performance"?n.innerHTML=Un(s,i):he==="telemetry"?(n.innerHTML=Gn(r),Yn(n,r,s)):n.innerHTML=_n(i),e.querySelectorAll(".tab-bar button").forEach(o=>o.addEventListener("click",()=>{he=o.dataset.tab,jt(e,t)})),(d=e.querySelector("#rd-back"))==null||d.addEventListener("click",()=>I("fleet")),(c=e.querySelector("#rd-mission"))==null||c.addEventListener("click",()=>I(`mission/${s.currentMissionId}`)),e.querySelectorAll("[data-nav]").forEach(o=>o.addEventListener("click",v=>{v.stopPropagation(),I(o.dataset.nav)})),e.querySelectorAll("[data-review]").forEach(o=>o.addEventListener("click",()=>{$e(s.id,{healthScore:Math.min(100,s.healthScore+4)}),q("success","Maintenance logged",`${s.id} health improved after review.`),jt(e,t)}))}function Wn(e,t,s){const i=e.knownStrengths.length?e.knownStrengths:["Still building profile from mission history"],a=e.knownIssues.length?e.knownIssues:["No recurring issues detected"],r=e.learnedPreferences.length?e.learnedPreferences:["No learned preferences yet"];return`
    <div class="grid-2">
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${u("robot",15)} Operational Profile</div>
        <div class="panel-head-actions"><span class="badge badge-cyan">DERIVED FROM MISSION HISTORY</span></div></div>
        <div class="panel-body">
          <div class="kv-list">
            <div class="kv-row"><span class="k">Status</span><span class="v">${Y(e.status)}</span></div>
            <div class="kv-row"><span class="k">Battery</span><span class="v">${Qe(e.battery)}</span></div>
            <div class="kv-row"><span class="k">Signal</span><span class="v">${Et(e.signal)}</span></div>
            <div class="kv-row"><span class="k">Temperature</span><span class="v">${e.temperature.toFixed(1)} °C</span></div>
            <div class="kv-row"><span class="k">Location</span><span class="v">${e.location}</span></div>
            <div class="kv-row"><span class="k">Connectivity</span><span class="v">${e.signal>70?"Strong":e.signal>45?"Fair":"Weak"}</span></div>
            <div class="kv-row"><span class="k">Missions</span><span class="v">${e.missionCount} (${Math.round(e.successCount/Math.max(1,e.missionCount)*100)}% success)</span></div>
            <div class="kv-row"><span class="k">Last maintenance</span><span class="v">${ie(new Date(e.lastMaintenance).getTime())} <button class="btn btn-sm btn-ghost" data-review>Log review</button></span></div>
          </div>
        </div>
      </section>
      <div class="stack">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("checkCircle",15)} Known strengths</div></div>
          <div class="panel-body">${i.map(l=>`<div class="kv-row"><span class="k">${u("check",13)}</span><span class="v">${l}</span></div>`).join("")}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("warning",15)} Known issues</div></div>
          <div class="panel-body">${a.map(l=>`<div class="kv-row"><span class="k">${u("warning",13)}</span><span class="v">${l}</span></div>`).join("")}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("brain",15)} Learned preferences</div></div>
          <div class="panel-body">${r.map(l=>`<div class="kv-row"><span class="k">${u("memory",13)}</span><span class="v">${l}</span></div>`).join("")}</div>
        </section>
      </div>
    </div>
    <section class="panel mt">
      <div class="panel-head"><div class="panel-title">${u("database",15)} Experience behind this profile</div>
      <div class="panel-head-actions"><span class="fs-11 text-dim">${s.length} memories · ${t.length} tracked missions</span></div></div>
      <div class="panel-body">
        ${s.length?`<div class="grid-2">${s.slice(0,4).map(l=>`
          <div class="mem-card clickable" data-nav="memory/${l.id}">
            <div class="mem-head"><span class="mem-id">${l.id}</span>${O(l.category,"violet")}<span class="ml-auto fs-11 text-dim">${ie(l.createdAt)}</span></div>
            <div class="mem-text clamp-2">${l.text}</div>
          </div>`).join("")}</div>`:U("memory","No memories yet","This robot has not generated persistent experience in tracked missions.")}
      </div>
    </section>`}function zn(e){return e.length?`<section class="panel"><div class="panel-body tight"><div class="table-wrap"><table class="data-table">
    <thead><tr><th>Mission</th><th>Type</th><th>Destination</th><th>Status</th><th>Duration</th><th>Mems</th><th></th></tr></thead>
    <tbody>${e.map(t=>`<tr class="clickable" data-nav="missions/${t.id}">
      <td class="td-main">${t.code}</td><td>${t.type}</td><td>${t.destinationName}</td>
      <td>${Y(t.status)}</td><td class="text-dim">${pe(t.durationSec)}</td>
      <td class="text-dim">${t.memoryIdsRetrieved.length}↧ / ${t.memoryIdsCreated.length}↥</td>
      <td>${u("chevronRight",13)}</td></tr>`).join("")}</tbody>
  </table></div></div></section>`:U("mission","No missions","This robot has not run tracked missions yet.")}function Vn(e){return e.length?`<div class="grid-2">${e.map(t=>`
    <div class="mem-card clickable" data-nav="memory/${t.id}">
      <div class="mem-head"><span class="mem-id">${t.id}</span>${O(t.category,"violet")}<span class="ml-auto fs-11 text-dim">${t.retrievalCount}× recalled</span></div>
      <div class="mem-text">${t.text}</div>
      <div class="mem-meta"><span>Created ${ie(t.createdAt)}</span><span>Last retrieved ${t.lastRetrievedAt?W(t.lastRetrievedAt):"never"}</span></div>
    </div>`).join("")}</div>`:U("memory","No memories","Complete missions to build this robot's experience.")}function Un(e,t){const s=t.filter(l=>l.durationSec>0),i=s.length?s.reduce((l,n)=>l+n.durationSec,0)/s.length:0,a=t.filter(l=>l.outcome==="success").length,r=t.filter(l=>l.outcome);return`
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-top">${u("checkCircle",13)}<span>Success rate</span></div><div class="stat-value">${r.length?Math.round(a/r.length*100):100}<span class="unit">%</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("clock",13)}<span>Avg duration</span></div><div class="stat-value">${Math.round(i/60)}<span class="unit">min</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("route",13)}<span>Total distance</span></div><div class="stat-value">${(t.reduce((l,n)=>l+n.distanceM,0)/1e3).toFixed(1)}<span class="unit">km</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("brain",13)}<span>Memories</span></div><div class="stat-value">${N().filter(l=>l.robotId===e.id).length}</div></div>
    </div>
    <section class="panel mt"><div class="panel-head"><div class="panel-title">${u("analytics",15)} Mission durations (tracked missions)</div></div>
    <div class="panel-body"><div class="chart-box" style="height:200px"><canvas id="rd-perf" style="height:200px"></canvas></div></div></section>`}function Gn(e){const t=e[e.length-1];return t?`
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-top">${u("battery",13)}<span>Battery</span></div><div class="stat-value">${t.battery}<span class="unit">%</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("speed",13)}<span>Speed</span></div><div class="stat-value">${t.speed.toFixed(2)}<span class="unit">m/s</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("temp",13)}<span>Temperature</span></div><div class="stat-value">${t.temperature.toFixed(1)}<span class="unit">°C</span></div></div>
      <div class="stat-card"><div class="stat-top">${u("signal",13)}<span>Signal</span></div><div class="stat-value">${t.signal}<span class="unit">%</span></div></div>
    </div>
    <section class="panel mt"><div class="panel-head"><div class="panel-title">${u("activity",15)} Telemetry history</div>
    <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED TELEMETRY</span></div></div>
    <div class="panel-body">
      <div class="chart-box" style="height:180px"><canvas id="rd-tele-batt" style="height:180px"></canvas></div>
      <div class="chart-box mt-16" style="height:180px"><canvas id="rd-tele-sig" style="height:180px"></canvas></div>
    </div></section>`:U("activity","No telemetry yet","Telemetry appears while missions run. Start a mission to see live data.")}function Yn(e,t,s){const i=e.querySelector("#rd-tele-batt"),a=e.querySelector("#rd-tele-sig");t.length&&i&&(We(i,t.map((r,l)=>String(l)),[{label:`${s.id} battery %`,color:"#4f8cff",values:t.map(r=>r.battery)}],{yMin:0,yMax:100}),i.insertAdjacentHTML("afterend",xt([{label:"Battery %",color:"#4f8cff"}]))),t.length&&a&&(We(a,t.map((r,l)=>String(l)),[{label:"Signal %",color:"#38d9f5",values:t.map(r=>r.signal)}],{yMin:0,yMax:100}),a.insertAdjacentHTML("afterend",xt([{label:"Signal strength %",color:"#38d9f5"}])))}function _n(e){const t=e.flatMap(s=>s.events.map(i=>({...i,code:s.code}))).sort((s,i)=>i.ts-s.ts).slice(0,40);return t.length?`<section class="panel"><div class="panel-body tight">${t.map(s=>`
    <div class="kv-row" style="padding:9px 16px">
      <span><span class="td-main">${s.title}</span> <span class="fs-11 text-dim">· ${s.code}</span>${s.detail?`<div class="fs-11 text-dim">${s.detail}</div>`:""}</span>
      <span class="fs-11 text-dim nowrap">${W(s.ts)}</span>
    </div>`).join("")}</div></section>`:U("activity","No events","Events appear when missions run.")}function ss(e){const t=F(),s=Date.now()-e*864e5,i=t.filter(a=>(a.startedAt??a.createdAt)>=s);return i.length>=5?i:t.slice(0,Math.max(5,Math.min(t.length,12)))}function Zn(e){const t=e.filter(i=>i.status==="completed"||i.status==="failed");if(!t.length)return 100;const s=t.filter(i=>i.outcome==="success").length;return Math.round(s/t.length*100)}function Qn(e){const t=e.filter(s=>s.durationSec>0);return t.length?Math.round(t.reduce((s,i)=>s+i.durationSec,0)/t.length/60):0}function Ft(e){return e.filter(t=>t.events.some(s=>/obstacle/i.test(s.title))).length}function ui(e){return e.filter(t=>t.decisions.some(s=>/reroute|route via|alternative route/i.test(s.decision))).length}function Xn(e){return e.filter(t=>t.memoryIdsRetrieved.length>0).length}function Jn(e,t,s){const i=Date.now(),a=s<=1?24:s<=7?7:s<=30?30:12,r=[],l=ss(s);for(let n=a-1;n>=0;n--){const d=s<=1?i-(n+1)*36e5:i-(n+1)*864e5,c=s<=1?i-n*36e5:i-n*864e5,o=l.filter(p=>{const y=p.startedAt??p.createdAt;return y>=d&&y<c}),v=o.filter(p=>p.durationSec>0),m=t.filter(p=>p.createdAt>=d&&p.createdAt<c);r.push({label:s<=1?`${String(new Date(d).getHours()).padStart(2,"0")}:00`:s<=7?new Date(d).toLocaleDateString(void 0,{weekday:"short"}):`-${n}`,missions:o.length,failures:o.filter(p=>p.status==="failed").length,obstacles:o.filter(p=>p.events.some(y=>/obstacle/i.test(y.title))).length,reroutes:o.filter(p=>p.decisions.some(y=>/reroute|route via|alternative/i.test(y.decision))).length,avgDurationMin:v.length?Math.round(v.reduce((p,y)=>p+y.durationSec,0)/v.length/60):0,memRetrievals:o.reduce((p,y)=>p+y.memoryIdsRetrieved.length,0)+m.length*0,memAssisted:o.filter(p=>p.memoryIdsRetrieved.length>0&&p.outcome==="success").length})}return r}function Kn(){const e=J(),t=F(),s=Math.max(1,t.length);return e.map(i=>{const a=t.filter(n=>n.robotId===i.id),r=a.filter(n=>n.durationSec>0),l=a.filter(n=>n.outcome==="success").length;return{robotId:i.id,name:i.name,pct:Math.round(a.length/s*100),missions:a.length,successPct:r.length?Math.round(l/Math.max(1,a.filter(n=>n.outcome).length)*100):100}})}function ea(){const e=S(),t=J(),s=Math.min(...t.map(a=>{var r;return((r=e.telemetry[a.id])==null?void 0:r.length)??0}),25),i=[];for(let a=0;a<s;a++){const r={};t.forEach(l=>{var d;const n=e.telemetry[l.id]??[];r[l.id]=((d=n[n.length-s+a])==null?void 0:d.battery)??0}),i.push({label:`t${a}`,values:r})}return i}function mi(){const e=F().filter(c=>c.status==="completed"||c.status==="failed"),t=e.filter(c=>c.memoryIdsRetrieved.length>0),s=e.filter(c=>c.memoryIdsRetrieved.length===0),i=t.filter(c=>c.outcome==="success").length,a=s.filter(c=>c.outcome==="success").length,r=t.filter(c=>c.events.some(o=>/obstacle/i.test(o.title))).length,l=s.filter(c=>c.events.some(o=>/obstacle/i.test(o.title))).length,n=new Set;let d=0;return[...e].sort((c,o)=>(c.startedAt??0)-(o.startedAt??0)).forEach(c=>{if(!c.events.some(v=>/obstacle/i.test(v.title)))return;const o=`${c.robotId}:${c.envId}`;n.has(o)?d++:n.add(o)}),{memAssisted:t.length,memAssistedSuccessPct:t.length?Math.round(i/t.length*100):0,noMemSuccessPct:s.length?Math.round(a/s.length*100):0,obstacleWithMem:r,obstacleNoMem:l,repeatObstacles:d,sampleNote:`${e.length} completed/failed missions analyzed`}}function ta(){const e=D(),t=ss(30),s=mi(),i=[];s.memAssisted>=4&&s.memAssistedSuccessPct>s.noMemSuccessPct&&i.push({text:`Memory-assisted missions succeeded ${s.memAssistedSuccessPct}% vs ${s.noMemSuccessPct}% without memory support across ${s.sampleNote}. Memory-assisted route decisions reduced repeated obstacle encounters in simulated missions.`,tone:"positive"});const a=ui(t),r=Ft(t);r>0&&a>0&&i.push({text:`${a} of ${r} recorded obstacle encounters produced a route change — the agent adapted instead of aborting in ${Math.round(a/Math.max(1,r)*100)}% of cases.`,tone:"positive"});const l=N().filter(d=>d.category==="Battery");l.length&&i.push({text:`Battery-related experience is the strongest predictor of mission interruption — ${l.length} stored memory items reference charging strategy; low-battery thresholds currently ${e.lowBatteryThreshold}%.`,tone:"neutral"});const n=J().find(d=>d.id==="R-03");return n&&n.healthScore<80&&i.push({text:`R-03 health score ${n.healthScore}/100 with recent encoder noise; schedule maintenance before assigning long industrial routes.`,tone:"warning"}),i.length||i.push({text:"Not enough completed mission data yet to compute reliable insights. Run more missions to build the analysis.",tone:"neutral"}),i}function sa(){const e=new Map;return N().forEach(t=>e.set(t.category,(e.get(t.category)??0)+1)),[...e.entries()].map(([t,s])=>({cat:t,n:s})).sort((t,s)=>s.n-t.n)}function ia(e=5){return[...N()].sort((t,s)=>s.retrievalCount-t.retrievalCount).slice(0,e).map(t=>({id:t.id,text:t.text,count:t.retrievalCount}))}let Nt="30d";const na={"24h":1,"7d":7,"30d":30,"90d":90};function hi(e){const t=na[Nt],s=ss(t),i=N(),a=mi(),r=ta();e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Analytics</h1>
          <div class="vsub">Mission performance and the measurable effect of persistent memory. Computed from ${s.length} missions in range.</div>
        </div>
        <div class="view-head-actions">
          <div class="seg-group" id="an-range">
            ${["24h","7d","30d","90d"].map(l=>`<button data-r="${l}" class="${Nt===l?"active":""}">${l}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
        ${V("Success Rate",Zn(s),"target",{sub:"%",accent:"var(--green)"})}
        ${V("Avg Duration",Qn(s),"clock",{sub:"min"})}
        ${V("Obstacles",Ft(s),"warning",{accent:Ft(s)?"var(--amber)":void 0})}
        ${V("Route Changes",ui(s),"route",{accent:"var(--accent)"})}
        ${V("Memory-Assisted",Xn(s),"brain",{accent:"var(--accent-2)"})}
        ${V("Memories Stored",i.length,"database",{})}
        ${V("Repeat Obstacles",a.repeatObstacles,"refresh",{delta:a.repeatObstacles===0?"none recurring":"recurring segments",deltaDir:a.repeatObstacles?"down":"up"})}
        ${V("Analysis Basis",a.sampleNote.split(" ")[0],"file",{sub:"missions"})}
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("analytics",15)} Mission volume & failures</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-volume" style="height:220px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("route",15)} Obstacles & route changes</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-obstacles" style="height:220px"></canvas></div>
            ${xt([{label:"Obstacles",color:"#f8717f"},{label:"Route changes",color:"#4f8cff"}])}
          </div>
        </section>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("clock",15)} Mission duration trend</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-duration" style="height:200px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("battery",15)} Battery trends (fleet)</div>
          <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED</span></div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-battery" style="height:200px"></canvas></div>
          </div>
        </section>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("fleet",15)} Robot utilization</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:180px"><canvas id="ch-util" style="height:180px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("brain",15)} Memory retrieval frequency</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-memory" style="height:200px"></canvas></div>
            ${xt([{label:"Memory retrievals",color:"#8b7cf6"},{label:"Memory-assisted successes",color:"#34d399"}])}
          </div>
        </section>
      </div>

      <!-- Memory impact — the key demonstration -->
      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${u("zap",15)} Memory Impact — without vs with persistent memory</div>
          <div class="panel-sub">Computed from ${a.sampleNote}. Memory-assisted missions are those where experiences were retrieved during planning or execution.</div></div>
        </div>
        <div class="panel-body">
          <div class="impact-grid">
            <div class="impact-col no-mem">
              <div class="impact-head">${u("xCircle",16)}<h4>WITHOUT MEMORY</h4></div>
              <div class="impact-steps">
                ${le("New mission assigned")}
                ${le("Obstacle encountered — no prior knowledge")}
                ${le("Replan from scratch under time pressure")}
                ${le("Repeated detours & delays")}
              </div>
              <div class="impact-result" style="color:var(--red)">Success rate<div class="impact-metric">${a.noMemSuccessPct}%</div></div>
              <div class="fs-11 text-dim mt-8">${a.obstacleNoMem} obstacle encounter(s) in non-memory-assisted missions</div>
            </div>
            <div class="impact-col with-mem">
              <div class="impact-head">${u("checkCircle",16)}<h4>WITH PERSISTENT MEMORY</h4></div>
              <div class="impact-steps">
                ${le("New mission assigned")}
                ${le("Past experience retrieved before departure")}
                ${le("Risk identified: prior obstruction known")}
                ${le("Alternative route selected up front")}
              </div>
              <div class="impact-result" style="color:var(--green)">Success rate<div class="impact-metric">${a.memAssistedSuccessPct}%</div></div>
              <div class="fs-11 text-dim mt-8">${a.memAssisted} memory-assisted mission(s) · ${a.obstacleWithMem} obstacle encounter(s)</div>
            </div>
          </div>
          ${a.memAssisted<3?`<div class="info-note mt-8">${u("info",15)}<span>Sample size is still small (${a.memAssisted} memory-assisted missions). Run more missions — or use Demo Mode — to strengthen the comparison.</span></div>`:""}
        </div>
      </section>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("layers",15)} Memory categories</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-cats" style="height:220px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${u("refresh",15)} Most-retrieved memories</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-retrieval" style="height:220px"></canvas></div>
          </div>
        </section>
      </div>

      <section class="panel mt">
        <div class="panel-head"><div class="panel-title">${u("zap",15)} Insights</div>
        <div class="panel-head-actions"><span class="badge badge-cyan">DATA-DRIVEN — SHOWN ONLY WHEN SUPPORTED</span></div></div>
        <div class="panel-body">
          ${r.map(l=>`
            <div class="info-note ${l.tone==="positive"?"mem-note":""} mb-8">
              ${u(l.tone==="positive"?"checkCircle":l.tone==="warning"?"warning":"info",15)}
              <span>${l.text}</span>
            </div>`).join("")}
        </div>
      </section>
    </div>`,e.querySelectorAll("#an-range button").forEach(l=>l.addEventListener("click",()=>{Nt=l.dataset.r,hi(e)})),aa(e,t,s)}function le(e){return`<div class="impact-step"><span class="is-dot">${u("arrowRight",11)}</span><span>${e}</span></div><div class="impact-line"></div>`}function aa(e,t,s){const i=Jn(s,N(),t),a=i.map(p=>p.label),r=e.querySelector("#ch-volume");r&&hs(r,a,[{label:"Missions",color:"#4f8cff",values:i.map(p=>p.missions)},{label:"Failures",color:"#f8717f",values:i.map(p=>p.failures)}]);const l=e.querySelector("#ch-obstacles");l&&hs(l,a,[{label:"Obstacles",color:"#f8717f",values:i.map(p=>p.obstacles)},{label:"Route changes",color:"#4f8cff",values:i.map(p=>p.reroutes)}]);const n=e.querySelector("#ch-duration");n&&We(n,a,[{label:"Avg duration (min)",color:"#38d9f5",values:i.map(p=>p.avgDurationMin)}]);const d=e.querySelector("#ch-battery");if(d){const p=ea();We(d,p.map(y=>y.label),[{label:"Fleet avg battery %",color:"#34d399",values:p.map(y=>Math.round(Object.values(y.values).reduce((w,f)=>w+f,0)/Math.max(1,Object.values(y.values).length)))}],{yMin:0,yMax:100})}const c=e.querySelector("#ch-util");c&&fs(c,Kn().map(p=>({label:`${p.robotId} ${p.name}`,value:p.missions,color:"#8b7cf6"})));const o=e.querySelector("#ch-memory");o&&We(o,a,[{label:"Retrievals",color:"#8b7cf6",values:i.map(p=>p.memRetrievals)},{label:"Mem-assisted successes",color:"#34d399",values:i.map(p=>p.memAssisted)}]);const v=e.querySelector("#ch-cats");if(v){const p=["#4f8cff","#8b7cf6","#38d9f5","#34d399","#fbbf24","#f8717f","#9aa7c4","#7c6cf8","#38bdf8","#a3e635"];On(v,sa().map((y,w)=>({label:y.cat,value:y.n,color:p[w%p.length]})),String(N().length))}const m=e.querySelector("#ch-retrieval");m&&fs(m,ia(6).map(p=>({label:p.id,value:p.count,color:"#8b7cf6"})))}let dt="",Ne="",lt="";function fi(e){var r,l,n,d;const t=S().alerts,s=S().events,i=t.filter(c=>!(dt&&c.severity!==dt||Ne==="open"&&c.reviewed||Ne==="reviewed"&&!c.reviewed||lt&&!`${c.title} ${c.detail}`.toLowerCase().includes(lt))),a=t.filter(c=>!c.reviewed).length;e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Alerts & Events</h1>
          <div class="vsub">Real-time event center for the simulated fleet. ${a} unreviewed alert(s).</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="al-markall">${u("check",14)} Mark all reviewed</button>
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
        ${ct(t.filter(c=>c.severity==="critical").length,"Critical","red")}
        ${ct(t.filter(c=>c.severity==="warning").length,"Warnings","amber")}
        ${ct(t.filter(c=>c.severity==="info").length,"Info","blue")}
        ${ct(t.filter(c=>c.severity==="success").length,"Success","green")}
      </div>

      <div class="filter-bar mt">
        <input id="al-q" class="input grow" placeholder="Search alerts…" value="${lt}" />
        <select id="al-sev" class="input">
          <option value="">All severities</option>
          ${["critical","warning","info","success"].map(c=>`<option value="${c}" ${dt===c?"selected":""}>${c}</option>`).join("")}
        </select>
        <select id="al-reviewed" class="input">
          <option value="">All states</option>
          <option value="open" ${Ne==="open"?"selected":""}>Unreviewed</option>
          <option value="reviewed" ${Ne==="reviewed"?"selected":""}>Reviewed</option>
        </select>
        <span class="filter-count">${i.length} alerts</span>
      </div>

      <section class="panel">
        <div class="panel-body tight">
          ${i.length?i.map(c=>`
            <div class="kv-row" style="padding:11px 16px;gap:12px;${c.reviewed?"opacity:.62":""}">
              <span style="min-width:0">
                <span class="flex flex-wrap" style="gap:7px">
                  ${Os(c.severity)}
                  <span style="color:var(--text-1);font-weight:600">${c.title}</span>
                  ${O(c.source.toUpperCase(),"gray")}
                  ${c.reviewed?'<span class="badge badge-green">REVIEWED</span>':`<button class="btn btn-sm" data-review="${c.id}">Mark reviewed</button>`}
                </span>
                <span class="fs-11 text-dim" style="display:block;margin-top:3px">${c.detail}</span>
                ${c.robotId?`<span class="fs-11 text-dim" style="display:block;margin-top:3px">Robot: ${de(c.robotId)}</span>`:""}
              </span>
              <span class="fs-11 text-dim nowrap" title="${Re(c.ts)}">${W(c.ts)}</span>
            </div>`).join(""):U("checkCircle","No alerts match","All quiet — adjust filters or wait for new events.")}
        </div>
      </section>

      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${u("activity",15)} Mission event stream</div>
          <div class="panel-sub">All mission events across the fleet, newest first (${s.length}).</div></div>
        </div>
        <div class="panel-body tight">
          ${s.length?s.slice(-30).reverse().map(c=>`
            <div class="kv-row" style="padding:8px 16px">
              <span><span class="td-main">${c.title}</span> <span class="fs-11 text-dim">· ${c.missionId}</span></span>
              <span class="fs-11 text-dim nowrap">${W(c.ts)}</span>
            </div>`).join(""):'<div class="empty-state" style="padding:20px"><div class="es-title">No global events yet</div><div class="es-sub">Start a mission to generate events.</div></div>'}
        </div>
      </section>
    </div>`,(r=e.querySelector("#al-q"))==null||r.addEventListener("input",c=>{lt=c.target.value.toLowerCase(),qe()}),(l=e.querySelector("#al-sev"))==null||l.addEventListener("change",c=>{dt=c.target.value,qe()}),(n=e.querySelector("#al-reviewed"))==null||n.addEventListener("change",c=>{Ne=c.target.value,qe()}),(d=e.querySelector("#al-markall"))==null||d.addEventListener("click",()=>{Ns(),q("success","All alerts marked reviewed"),qe()}),e.querySelectorAll("[data-review]").forEach(c=>c.addEventListener("click",()=>{Ds(c.dataset.review),qe()})),e.querySelectorAll("[data-nav]").forEach(c=>c.addEventListener("click",o=>{o.stopPropagation(),I(c.dataset.nav)}))}function ct(e,t,s){return`<div class="stat-card"><div class="stat-accent-line" style="background:${{red:"var(--red)",amber:"var(--amber)",blue:"var(--accent)",green:"var(--green)"}[s]}"></div>
    <div class="stat-top">${u("alert",13)}<span>${t}</span></div><div class="stat-value">${e}</div></div>`}function qe(){const e=document.querySelector(".content");e&&fi(e)}function oa(e,t){var n,d,c,o,v;const s=F(),i=s.find(m=>m.status==="active")??s.find(m=>m.status==="paused"),a=N(),r=St(),l=D();e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>AI Mission Agent</h1>
          <div class="vsub">The agent plans missions, retrieves experiences, explains its decisions, and adapts when conditions change. All reasoning is derived from real application state — never invented.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="ag-chat">${u("agent",14)} Operations Assistant</button>
        </div>
      </div>

      <div class="grid-2-1">
        <div class="stack">
          ${i?ra(i):`
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("agent",15)} Agent activity</div></div>
            ${U("agent","No mission in progress","Start a mission and the agent's planning timeline will appear here, step by step.")}
          </section>`}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("checkCircle",15)} Recent decisions</div></div>
            <div class="panel-body">
              ${s.filter(m=>m.decisions.length).slice(0,5).flatMap(m=>m.decisions.map(p=>`
                <div class="mem-card mb-8">
                  <div class="mem-head">
                    <span class="badge badge-green">DECISION</span>
                    <span class="fs-11 text-dim">${m.code} · ${p.phase}</span>
                    <span class="fs-11 text-dim ml-auto">${(p.confidence*100).toFixed(0)}% confidence</span>
                  </div>
                  <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${p.decision}</div>
                  <div class="fs-11 text-dim mt-8">${p.rationale}</div>
                  ${p.sourceMemories.length?`<div class="mem-meta"><span>memory: ${p.sourceMemories.join(", ")}</span></div>`:""}
                </div>`)).join("")||U("agent","No decisions yet","Agent decisions are recorded when routes change or memory conflicts are weighed.")}
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("settings",15)} Agent configuration</div></div>
            <div class="panel-body">
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-recall" ${l.memoryRecallEnabled?"checked":""}/> Memory recall during planning</label>
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-reroute" ${l.agentAutoReroute?"checked":""}/> Auto-reroute on obstacles</label>
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-verbose" ${l.agentPlanningVerbose?"checked":""}/> Verbose planning timeline</label>
              <div class="field mt-8">
                <label>Confidence threshold — ${(l.agentConfidenceThreshold*100).toFixed(0)}%</label>
                <input type="range" id="ag-conf" min="0.3" max="0.95" step="0.05" value="${l.agentConfidenceThreshold}" />
                <span class="hint">Minimum memory confidence before the agent applies a retrieved experience without asking.</span>
              </div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${u("database",15)} Knowledge base</div></div>
            <div class="panel-body"><div class="kv-list">
              <div class="kv-row"><span class="k">Memories</span><span class="v">${a.length}</span></div>
              <div class="kv-row"><span class="k">Retrievals today</span><span class="v">${S().memRetrievedToday.count}</span></div>
              <div class="kv-row"><span class="k">Open conflicts</span><span class="v">${r.filter(m=>m.status==="open").length}</span></div>
              <div class="kv-row"><span class="k">Backend</span><span class="v">${l.memoryBackend}</span></div>
            </div></div>
          </section>
        </div>
      </div>
    </div>`,(n=e.querySelector("#ag-chat"))==null||n.addEventListener("click",()=>I("agent/assistant")),(d=e.querySelector("#ag-recall"))==null||d.addEventListener("change",m=>R({memoryRecallEnabled:m.target.checked})),(c=e.querySelector("#ag-reroute"))==null||c.addEventListener("change",m=>R({agentAutoReroute:m.target.checked})),(o=e.querySelector("#ag-verbose"))==null||o.addEventListener("change",m=>R({agentPlanningVerbose:m.target.checked})),(v=e.querySelector("#ag-conf"))==null||v.addEventListener("change",m=>R({agentConfidenceThreshold:parseFloat(m.target.value)}))}function ra(e){const t=S().robots.find(a=>a.id===e.robotId),s=e.memoryIdsRetrieved.map(a=>N().find(r=>r.id===a)).filter(Boolean),i=sn(e,t,s);return`
    <section class="panel">
      <div class="panel-head">
        <div><div class="panel-title">${u("agent",15)} Mission Agent — ${e.code}</div>
        <div class="panel-sub">Explainable planning & monitoring narrative for the current mission</div></div>
        <div class="panel-head-actions"><span class="live-pill"><span class="ldot"></span>${e.status.toUpperCase()}</span></div>
      </div>
      <div class="panel-body">
        <div class="timeline">
          ${i.map(a=>`
            <div class="tl-item">
              <div class="tl-rail"><div class="tl-dot done">${u(a.kind==="memory"?"memory":a.kind==="decision"?"check":a.kind==="sim"?"sim":"agent",11)}</div></div>
              <div class="tl-body">
                <div class="tl-title">${a.title} <span class="tl-kind ${a.kind}">${a.kind}</span></div>
                ${a.detail?`<div class="tl-desc">${a.detail}</div>`:""}
              </div>
            </div>`).join("")}
          ${e.events.slice(-3).reverse().map(a=>`
            <div class="tl-item">
              <div class="tl-rail"><div class="tl-dot ${a.severity==="critical"?"crit":a.severity==="warning"?"warn":"info"}">${u("activity",11)}</div></div>
              <div class="tl-body">
                <div class="tl-title">${a.title} <span class="tl-kind sim">live</span></div>
                ${a.detail?`<div class="tl-desc">${a.detail}</div>`:""}
              </div>
            </div>`).join("")}
        </div>
      </div>
    </section>`}let Pe=[],Be=null;const da=["Why did R-01 choose Corridor C?","What happened during the previous Warehouse A mission?","Which robots have experienced battery problems?","What does R-03 remember about the South Hall?","Show missions where obstacles caused rerouting.","Which previous experience is relevant to this mission?"];function ht(e){var a,r,l;if(Be){const n=Be;Be=null,Pe.push({role:"user",text:n,ts:Date.now()});const d=nn(n);Pe.push({role:"agent",text:n,reply:d,ts:Date.now()})}e.innerHTML=`
    <div class="view" style="max-width:1000px">
      <div class="view-head">
        <div class="view-title">
          <h1>Operations Assistant</h1>
          <div class="vsub">Ask about missions, robots, and memory. Every answer cites its source.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="as-clear">Clear chat</button>
          <button class="btn" id="as-back">${u("chevronRight",13)} Agent</button>
        </div>
      </div>
      <section class="panel chat-panel">
        <div class="chat-scroll" id="as-scroll">
          ${Pe.length?Pe.map(la).join(""):`
            <div class="chat-msg agent">
              <div class="chat-avatar" style="background:var(--accent-soft);color:var(--accent)">${u("agent",15)}</div>
              <div class="chat-bubble">I'm the FleetMinder operations assistant. I answer from <b>live fleet state</b>, <b>historical missions</b>, and <b>persistent memory</b> — and I label where each fact comes from. What would you like to know?</div>
            </div>`}
        </div>
        <div class="chat-sugg">
          ${da.map(n=>`<button data-sugg="${n}">${n}</button>`).join("")}
        </div>
        <div class="chat-input-row">
          <input id="as-input" class="input" placeholder="Ask about missions, robots, memories…" aria-label="Ask the operations assistant" />
          <button class="btn btn-primary" id="as-send">${u("send",14)} Ask</button>
        </div>
      </section>
    </div>`;const t=e.querySelector("#as-input"),s=e.querySelector("#as-scroll");s.scrollTop=s.scrollHeight;const i=()=>{const n=t.value.trim();n&&(Be=n,ht(e))};(a=e.querySelector("#as-send"))==null||a.addEventListener("click",i),t.addEventListener("keydown",n=>{n.key==="Enter"&&i()}),e.querySelectorAll("[data-sugg]").forEach(n=>n.addEventListener("click",()=>{Be=n.dataset.sugg,ht(e)})),(r=e.querySelector("#as-clear"))==null||r.addEventListener("click",()=>{Pe=[],ht(e)}),(l=e.querySelector("#as-back"))==null||l.addEventListener("click",()=>I("agent")),e.querySelectorAll("[data-link]").forEach(n=>n.addEventListener("click",()=>{I(n.dataset.link)}))}function la(e){var t;return e.role==="user"?`<div class="chat-msg user">
      <div class="chat-avatar" style="background:var(--bg-raised);color:var(--text-2)">${u("users",15)}</div>
      <div class="chat-bubble">${e.text}</div>
    </div>`:`<div class="chat-msg agent">
    <div class="chat-avatar" style="background:var(--accent-soft);color:var(--accent)">${u("agent",15)}</div>
    <div class="chat-bubble">
      ${e.reply.sources.map(s=>`<span class="chat-src ${s.cls}">${s.label}</span>`).join("")}
      <div style="white-space:pre-line">${ca(e.reply.text)}</div>
      ${(t=e.reply.links)!=null&&t.length?`<div class="flex flex-wrap mt-8" style="gap:6px">${e.reply.links.map(s=>`<button class="btn btn-sm" data-link="${s.route}">${u("link",12)} ${s.label}</button>`).join("")}</div>`:""}
      <div class="fs-10 text-dim mt-8">${Re(e.ts)}</div>
    </div>
  </div>`}function ca(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\*\*(.+?)\*\*/g,'<b style="color:var(--text-1)">$1</b>').replace(/“(.+?)”/g,'“<span style="color:var(--text-2)">$1</span>”')}const va=[["general","General"],["fleet","Fleet Configuration"],["simulation","Simulation Settings"],["memory","Memory Settings"],["agent","AI Agent Settings"],["notifications","Notifications"],["security","Security"],["api","API Configuration"]];let ee="general";function gi(e){var i,a,r,l,n,d,c,o,v,m,p,y,w,f,h,$,k,x;const t=D();e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Settings</h1>
          <div class="vsub">Platform configuration. Changes apply immediately and persist locally.</div>
        </div>
      </div>

      <div class="settings-layout">
        <nav class="settings-nav" aria-label="Settings sections">
          ${va.map(([b,C])=>`<button data-sec="${b}" class="${ee===b?"active":""}">${C}</button>`).join("")}
        </nav>

        <div class="settings-section" id="set-body"></div>
      </div>
    </div>`;const s=e.querySelector("#set-body");ee==="general"&&(s.innerHTML=`
      ${oe("General",`
        <div class="form-row">
          <div class="field"><label for="st-name">Operator name</label><input id="st-name" class="input" value="${t.operatorName}" /></div>
          <div class="field"><label for="st-role">Role</label><input id="st-role" class="input" value="${t.operatorRole}" /></div>
        </div>
        <div class="info-note mt-16">${u("info",15)}<span>FleetMinder is a browser-based prototype. Robot telemetry and the internal memory provider are simulated; application state is persisted in this browser.</span></div>
      `)}
      ${oe("Danger zone",`
        <div class="flex" style="gap:10px;align-items:center;flex-wrap:wrap">
          <span class="fs-12 text-dim">Reset all missions, memories, alerts and settings to the initial demo dataset.</span>
          <button class="btn btn-danger ml-auto" id="st-reset">${u("trash",14)} Reset all data</button>
        </div>
      `)}`,(i=s.querySelector("#st-name"))==null||i.addEventListener("change",b=>R({operatorName:b.target.value})),(a=s.querySelector("#st-role"))==null||a.addEventListener("change",b=>R({operatorRole:b.target.value})),(r=s.querySelector("#st-reset"))==null||r.addEventListener("click",()=>{Ue("Reset everything?","All missions, memories, alerts and settings will be restored to the initial demo dataset. This cannot be undone.","Reset all data",()=>{ai()},!0)})),ee==="fleet"&&(s.innerHTML=`
      ${oe("Fleet Configuration",`
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-auto" ${t.autoAssign?"checked":""}/> Auto-assign robots when creating missions</label>
        <div class="form-row-3 mt-8">
          <div class="field"><label>Low battery threshold (%)</label><input id="st-low" type="number" min="5" max="60" class="input" value="${t.lowBatteryThreshold}" /></div>
          <div class="field"><label>Critical battery threshold (%)</label><input id="st-crit" type="number" min="3" max="40" class="input" value="${t.criticalBatteryThreshold}" /></div>
          <div class="field"><label>Signal warning (%)</label><input id="st-sig" type="number" min="10" max="90" class="input" value="${t.signalWarning}" /></div>
        </div>
        <div class="form-row mt-8">
          <div class="field"><label>Max concurrent missions</label><input id="st-max" type="number" min="1" max="10" class="input" value="${t.maxConcurrentMissions}" /></div>
          <div class="field"><label>Telemetry sample interval (sec)</label><input id="st-tel" type="number" min="2" max="60" class="input" value="${t.telemetryIntervalSec}" /></div>
        </div>
      `)}`,fe(s,"st-low",b=>R({lowBatteryThreshold:b})),fe(s,"st-crit",b=>R({criticalBatteryThreshold:b})),fe(s,"st-sig",b=>R({signalWarning:b})),fe(s,"st-max",b=>R({maxConcurrentMissions:b})),fe(s,"st-tel",b=>R({telemetryIntervalSec:b})),(l=s.querySelector("#st-auto"))==null||l.addEventListener("change",b=>R({autoAssign:b.target.checked}))),ee==="simulation"&&(s.innerHTML=`
      ${oe("Simulation Settings",`
        <div class="form-row">
          <div class="field">
            <label>Simulation speed — ${t.simSpeed}×</label>
            <input id="st-speed" type="range" min="0.5" max="4" step="0.5" value="${t.simSpeed}" />
            <span class="hint">Controls robot movement speed and event cadence.</span>
          </div>
          <div class="field">
            <label for="st-freq">Event frequency</label>
            <select id="st-freq" class="input">
              ${["low","normal","high"].map(b=>`<option ${t.simEventFrequency===b?"selected":""}>${b}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="info-note sim-note mt-16">${u("sim",15)}<span>The robot, environment and telemetry are <b>simulated</b>. The UI labels simulated data everywhere it appears.</span></div>
      `)}`,(n=s.querySelector("#st-speed"))==null||n.addEventListener("input",b=>{var H;const C=parseFloat(b.target.value);R({simSpeed:C});const A=(H=b.target.closest(".field"))==null?void 0:H.querySelector("label");A&&(A.textContent=`Simulation speed — ${C}×`)}),(d=s.querySelector("#st-freq"))==null||d.addEventListener("change",b=>R({simEventFrequency:b.target.value}))),ee==="memory"&&(s.innerHTML=`
      ${oe("Memory Settings",`
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-recall" ${t.memoryRecallEnabled?"checked":""}/> Retrieve memories during mission planning</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-autosave" ${t.memoryAutoSave?"checked":""}/> Auto-save proposed experiences after missions</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-conflict" ${t.memoryConflictDetection?"checked":""}/> Detect conflicting memories</label>
        <div class="form-row mt-8">
          <div class="field">
            <label>Minimum relevance — ${(t.memoryMinRelevance*100).toFixed(0)}%</label>
            <input id="st-minrel" type="range" min="0.2" max="0.8" step="0.05" value="${t.memoryMinRelevance}" />
          </div>
          <div class="field"><label>Retrieval retention window (days)</label><input id="st-ret" type="number" min="30" max="730" class="input" value="${t.memoryRetentionDays}" /><span class="hint">Older memories remain in history but are excluded from retrieval.</span></div>
        </div>
        <div class="kv-list mt-16">
          <div class="kv-row"><span class="k">Memories in store</span><span class="v">${N().length}</span></div>
          <div class="kv-row"><span class="k">Retrievals today</span><span class="v">${S().memRetrievedToday.count}</span></div>
        </div>
      `)}`,(c=s.querySelector("#st-recall"))==null||c.addEventListener("change",b=>R({memoryRecallEnabled:b.target.checked})),(o=s.querySelector("#st-autosave"))==null||o.addEventListener("change",b=>R({memoryAutoSave:b.target.checked})),(v=s.querySelector("#st-conflict"))==null||v.addEventListener("change",b=>R({memoryConflictDetection:b.target.checked})),(m=s.querySelector("#st-minrel"))==null||m.addEventListener("input",b=>{var H;const C=parseFloat(b.target.value);R({memoryMinRelevance:C});const A=(H=b.target.closest(".field"))==null?void 0:H.querySelector("label");A&&(A.textContent=`Minimum relevance — ${(C*100).toFixed(0)}%`)}),fe(s,"st-ret",b=>R({memoryRetentionDays:b}))),ee==="agent"&&(s.innerHTML=`
      ${oe("AI Agent Settings",`
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-verbose" ${t.agentPlanningVerbose?"checked":""}/> Verbose planning timeline</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-reroute" ${t.agentAutoReroute?"checked":""}/> Apply high-confidence memory routes during planning</label>
        <div class="field mt-8">
          <label>Confidence threshold — ${(t.agentConfidenceThreshold*100).toFixed(0)}%</label>
          <input id="st-conf" type="range" min="0.3" max="0.95" step="0.05" value="${t.agentConfidenceThreshold}" />
          <span class="hint">Below this confidence, the agent verifies live conditions before applying a memory.</span>
        </div>
        <div class="info-note mt-16">${u("agent",15)}<span>The agent runs entirely on local application logic in this prototype. Its reasoning is explainable and always traceable to stored memories or mission events.</span></div>
      `)}`,(p=s.querySelector("#st-verbose"))==null||p.addEventListener("change",b=>R({agentPlanningVerbose:b.target.checked})),(y=s.querySelector("#st-reroute"))==null||y.addEventListener("change",b=>R({agentAutoReroute:b.target.checked})),(w=s.querySelector("#st-conf"))==null||w.addEventListener("input",b=>{var H;const C=parseFloat(b.target.value);R({agentConfidenceThreshold:C});const A=(H=b.target.closest(".field"))==null?void 0:H.querySelector("label");A&&(A.textContent=`Confidence threshold — ${(C*100).toFixed(0)}%`)})),ee==="notifications"&&(s.innerHTML=`
      ${oe("Notifications",`
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nm" ${t.notificationsMission?"checked":""}/> Mission completed / failed</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nmem" ${t.notificationsMemory?"checked":""}/> Memory created & important retrievals</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nb" ${t.notificationsBattery?"checked":""}/> Battery warnings</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nc" ${t.notificationsCritical?"checked":""}/> Critical robot warnings</label>
      `)}`,(f=s.querySelector("#st-nm"))==null||f.addEventListener("change",b=>R({notificationsMission:b.target.checked})),(h=s.querySelector("#st-nmem"))==null||h.addEventListener("change",b=>R({notificationsMemory:b.target.checked})),($=s.querySelector("#st-nb"))==null||$.addEventListener("change",b=>R({notificationsBattery:b.target.checked})),(k=s.querySelector("#st-nc"))==null||k.addEventListener("change",b=>R({notificationsCritical:b.target.checked}))),ee==="security"&&(s.innerHTML=`
      ${oe("Security",`
        <div class="form-row">
          <div class="field"><label for="st-timeout">Session timeout (min)</label><input id="st-timeout" type="number" min="5" max="240" class="input" value="${t.sessionTimeoutMin}" /></div>
        </div>
        <label class="checkbox-row mt-8"><input type="checkbox" id="st-review" ${t.requireReviewForCritical?"checked":""}/> Require operator review before executing Critical-priority missions</label>
        <div class="info-note mt-16">${u("lock",15)}<span>Authentication and session controls are informational in this prototype. There is no server-side session or API credential handling.</span></div>
      `)}`,fe(s,"st-timeout",b=>R({sessionTimeoutMin:b})),(x=s.querySelector("#st-review"))==null||x.addEventListener("change",b=>R({requireReviewForCritical:b.target.checked}))),ee==="api"&&(s.innerHTML=`
      ${oe("Memory Integration",`
        <div class="kv-list">
          <div class="kv-row"><span class="k">Active provider</span><span class="v">Internal simulated store</span></div>
          <div class="kv-row"><span class="k">Hindsight connection</span><span class="v">Not connected</span></div>
          <div class="kv-row"><span class="k">Memory service</span><span class="v">Local application layer</span></div>
        </div>
        <div class="info-note mem-note mt-16">${u("info",15)}<span>This browser-only prototype does not call Hindsight and has no server-side memory API. Mission memories are simulated application data persisted in this browser. No API credentials are accepted or stored here. Connect a real Hindsight provider through a server-side adapter before enabling external memory.</span></div>
      `)}`),e.querySelectorAll(".settings-nav button").forEach(b=>b.addEventListener("click",()=>{ee=b.dataset.sec,gi(e)}))}function oe(e,t){return`<section class="panel mb-16"><div class="panel-head"><div class="panel-title">${e}</div></div><div class="panel-body">${t}</div></section>`}function fe(e,t,s){var i;(i=e.querySelector(`#${t}`))==null||i.addEventListener("change",a=>{const r=parseInt(a.target.value,10);isNaN(r)||s(r)})}const pa=[{section:"Operations",items:[["dashboard","Dashboard","dashboard"],["mission","Mission Control","mission"],["sim","Live Simulation","sim"],["fleet","Robot Fleet","fleet"]]},{section:"Intelligence",items:[["memory","Memory Center","memory"],["recall","Memory Recall Flow","brain"],["agent","AI Mission Agent","agent"],["analytics","Analytics","analytics"]]},{section:"Records",items:[["missions","Mission History","history"],["alerts","Alerts & Events","alert"]]},{section:"System",items:[["settings","Settings","settings"]]}],ua={dashboard:"Command Center",mission:"Mission Control",sim:"Live Simulation",fleet:"Robot Fleet",memory:"Persistent Memory Center",recall:"Memory Recall Flow",agent:"AI Mission Agent",analytics:"Analytics",missions:"Mission History",alerts:"Alerts & Events",settings:"Settings"};let He=!1,Ye=!1;function ma(e){Pi(),e.innerHTML=`
    <div class="app-root">
      <div class="sidebar-backdrop mobile-only" id="sb-backdrop" style="display:none;position:fixed;inset:0;background:rgba(4,8,16,.6);z-index:55"></div>
      <aside class="sidebar" id="sidebar" aria-label="Main navigation">
        <div class="sidebar-head">
          <div class="brand-mark">${u("brain",18)}</div>
          <div><div class="brand-name">FleetMinder</div><div class="brand-sub">Mission Learning</div></div>
        </div>
        <nav class="sidebar-nav" id="sb-nav"></nav>
        <div class="sidebar-foot">
          <div class="sys-status" id="sb-sysstatus"><span class="status-dot"></span><span class="sys-txt"><b>Operational</b></span><span class="sys-sub" id="sb-clock"></span></div>
        </div>
      </aside>
      <div class="main-col">
        <header class="topbar">
          <button class="icon-btn mobile-only" id="tb-menu" aria-label="Open navigation">${u("grid",17)}</button>
          <div><div class="topbar-title" id="tb-title">Command Center</div><div class="topbar-crumb" id="tb-crumb">Overview</div></div>
          <div class="topbar-spacer"></div>
          <button class="topbar-search" id="tb-search" aria-label="Global search">
            ${u("search",14)}<span class="ts-label">Search everything…</span><kbd>/</kbd>
          </button>
          <span id="tb-demo"></span>
          <span id="tb-simctl"></span>
          <button class="icon-btn" id="tb-notif" aria-label="Notifications">${u("bell",17)}<span class="dot hidden" id="tb-notif-dot"></span></button>
        </header>
        <main class="content" id="content" tabindex="-1"></main>
      </div>
    </div>`,bs(),ha(),ka(),ya(),wa(),Di((a,r)=>{qt(a,r),bs(),is(),Le()}),Ni();let t=-1;_e(()=>{const a=S(),r=a.notifications.filter(d=>!d.read).length,l=document.getElementById("tb-notif-dot");if(l&&l.classList.toggle("hidden",r===0),r!==t&&t>=0&&r>t&&!Ye){const{view:d,param:c}=vt();d==="dashboard"?ds():(d==="alerts"||d==="memory")&&qt(d,c)}t=r;const n=a.alerts.filter(d=>!d.reviewed).length;bi(n),Sa(),Ye&&ns()}),setInterval(()=>{const a=document.getElementById("sb-clock");a&&(a.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const{view:r}=vt();r==="dashboard"&&ds()},5e3);const{view:s,param:i}=vt();qt(s,i)}function bs(){var l;const e=document.getElementById("sb-nav");if(!e)return;const{view:t}=vt(),s=Ct(),i=S(),a=i.alerts.filter(n=>!n.reviewed).length,r=i.conflicts.filter(n=>n.status==="open").length;e.innerHTML=pa.map(n=>`
    ${n.section?`<div class="nav-section-label">${n.section}</div>`:""}
    ${n.items.map(([d,c,o])=>`
      <button class="nav-item ${t===d||d==="mission"&&t==="mission"?"active":""}" data-route="${d}" aria-label="${c}">
        <span class="nav-ico">${u(o,17)}</span><span class="lbl">${c}</span>
        ${d==="alerts"&&a?`<span class="nav-badge warn">${a}</span>`:""}
        ${d==="memory"&&r?`<span class="nav-badge crit">${r}</span>`:""}
        ${d==="mission"&&s.activeMissions?`<span class="nav-badge">${s.activeMissions}</span>`:""}
      </button>`).join("")}`).join("")+`
    <div class="nav-section-label">Guided</div>
    <button class="nav-item demo-item ${wt()?"active":""}" id="nav-demo" aria-label="Demo mode">
      <span class="nav-ico">${u("demo",17)}</span><span class="lbl">Demo Mode</span>
    </button>`,e.querySelectorAll("[data-route]").forEach(n=>n.addEventListener("click",()=>I(n.dataset.route))),(l=e.querySelector("#nav-demo"))==null||l.addEventListener("click",()=>{wt()?Je("user"):wn()}),bi(a)}function bi(e){document.querySelectorAll('.nav-item[data-route="alerts"] .nav-badge').forEach(t=>{t.textContent=String(e),t.classList.toggle("hidden",e===0)})}function ha(){var e,t,s,i;(e=document.getElementById("tb-search"))==null||e.addEventListener("click",()=>zs(I)),(t=document.getElementById("tb-menu"))==null||t.addEventListener("click",()=>{He=!He;const a=document.getElementById("sidebar"),r=document.getElementById("sb-backdrop");a&&(a.style.transform=He?"translateX(0)":""),r&&(r.style.display=He?"block":"none")}),(s=document.getElementById("sb-backdrop"))==null||s.addEventListener("click",is),(i=document.getElementById("tb-notif"))==null||i.addEventListener("click",()=>{Ye?Le():fa()}),window.addEventListener("fleetminder:navigate",a=>I(a.detail))}function is(){He=!1;const e=document.getElementById("sb-backdrop");e&&(e.style.display="none");const t=document.getElementById("sidebar");t&&window.innerWidth<=768&&(t.style.transform="translateX(-100%)")}function fa(){Ye=!0,ns()}function Le(){var e;Ye=!1,(e=document.querySelector(".notif-pop"))==null||e.remove()}function ns(){var i,a,r;(i=document.querySelector(".notif-pop"))==null||i.remove();const e=S(),t=e.notifications.filter(l=>!l.read).length,s=document.createElement("div");s.className="notif-pop",s.innerHTML=`
    <div class="notif-head">
      <b style="font-size:13px">Notifications</b>
      ${t?`<span class="badge badge-blue">${t} new</span>`:'<span class="badge badge-gray">All read</span>'}
      <div class="ml-auto flex" style="gap:4px">
        <button class="btn btn-sm btn-ghost" id="nf-readall">${u("check",12)} All read</button>
        <button class="btn btn-sm btn-ghost" id="nf-clear">${u("trash",12)}</button>
      </div>
    </div>
    <div class="notif-list">
      ${e.notifications.length?e.notifications.map(l=>{var n,d;return`
        <div class="notif-item ${l.read?"":"unread"}" data-nid="${l.id}" data-route="${((n=l.route)==null?void 0:n.view)??""}" data-param="${((d=l.route)==null?void 0:d.id)??""}">
          <div class="notif-ico" style="${ba(l.severity)}">${u(ga(l.severity),14)}</div>
          <div style="min-width:0">
            <div class="notif-title">${l.title}</div>
            <div class="notif-body clamp-2">${l.body}</div>
            <div class="notif-time">${W(l.ts)}</div>
          </div>
        </div>`}).join(""):'<div class="empty-state" style="padding:26px"><div class="es-title">No notifications</div><div class="es-sub">Mission and memory events will appear here.</div></div>'}
    </div>`,document.getElementById("portal-root").appendChild(s),(a=s.querySelector("#nf-readall"))==null||a.addEventListener("click",()=>{Ps(),ns()}),(r=s.querySelector("#nf-clear"))==null||r.addEventListener("click",()=>{Bs(),Le()}),s.querySelectorAll(".notif-item").forEach(l=>l.addEventListener("click",()=>{qs(l.dataset.nid);const n=l.dataset.route,d=l.dataset.param;Le(),n&&I(d?`${n}/${d}`:n)}))}function ga(e){return e==="critical"?"xCircle":e==="warning"?"warning":e==="success"?"checkCircle":"info"}function ba(e){const t={success:"background:var(--green-soft);color:var(--green)",critical:"background:var(--red-soft);color:var(--red)",warning:"background:var(--amber-soft);color:var(--amber)",info:"background:var(--accent-soft);color:var(--accent)"};return t[e]??t.info}function ya(){const e=document.getElementById("tb-simctl");if(!e)return;const t=()=>{const s=D();e.innerHTML=`
      <div class="seg-group" title="Simulation speed">
        <button data-sp="0.5" class="${s.simSpeed===.5?"active":""}">0.5×</button>
        <button data-sp="1" class="${s.simSpeed===1?"active":""}">1×</button>
        <button data-sp="2" class="${s.simSpeed===2?"active":""}">2×</button>
        <button data-sp="4" class="${s.simSpeed===4?"active":""}">4×</button>
      </div>`,e.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>{const{updateSettings:a}=$a();a({simSpeed:parseFloat(i.dataset.sp)}),t(),q("info",`Simulation speed ${i.dataset.sp}×`)}))};t()}function $a(){return Hs}function wa(){yn({renderGuide:ys}),ys()}function ys(e){var r,l,n,d;(r=document.querySelector(".demo-guide"))==null||r.remove();const t=document.getElementById("tb-demo");t&&(t.innerHTML=wt()?'<span class="live-pill paused" title="Demo Mode active"><span class="ldot"></span>DEMO</span>':"");const s=$n();if(!s.active)return;const i=Me[Math.min(Me.length-1,Math.max(0,s.step-1))],a=document.createElement("div");a.className="demo-guide",a.innerHTML=`
    <div class="dg-top">
      <span class="dg-step-k">DEMO · STEP ${Math.min(s.step,Me.length)} OF ${Me.length}</span>
      <button class="btn btn-sm btn-ghost ml-auto" id="dg-reset">Reset Demo</button>
      <button class="btn btn-sm btn-ghost" id="dg-exit">Exit demo</button>
    </div>
    <div class="dg-title">${i.title}</div>
    <div class="dg-desc">${i.desc}</div>
    ${i.hint?`<div class="dg-desc text-dim">💡 ${i.hint}</div>`:""}
    <div class="dg-top dg-steps" style="margin-top:9px;gap:6px">
      ${us().map((c,o)=>{const v=o+1;return`<span class="demo-step-pill ${v<s.step?"done":v===s.step?"current":""}"><span class="dsp-n">${v<s.step?"✓":v}</span>${c}</span>${o<us().length-1?'<span class="demo-connector"></span>':""}`}).join("")}
    </div>
    <div class="dg-actions">
      <div class="dg-prog"><span style="width:${Math.min(s.step,Me.length)/Me.length*100}%"></span></div>
      <button class="btn btn-sm" id="dg-skip">Advance</button>
    </div>`,document.getElementById("portal-root").appendChild(a),(l=a.querySelector("#dg-reset"))==null||l.addEventListener("click",()=>Ue("Reset FleetMinder demo?","This restores the initial demo dataset and clears local missions, memories, alerts, and settings changes.","Reset Demo",ai)),(n=a.querySelector("#dg-exit"))==null||n.addEventListener("click",()=>Je("user")),(d=a.querySelector("#dg-skip"))==null||d.addEventListener("click",()=>Mn())}function qt(e,t){const s=document.getElementById("content");if(!s)return;ti(),ri(),Le(),document.getElementById("tb-title").textContent=ua[e]??"FleetMinder";const i={dashboard:"Fleet overview & live status",mission:"Create & control missions",sim:"2D environment simulation",fleet:"Robots & operational profiles",memory:"Persistent experience store",recall:"Retrieval in action",agent:"Explainable mission intelligence",analytics:"Performance & memory impact",missions:"Complete mission records",alerts:"Real-time event center",settings:"Platform configuration"};document.getElementById("tb-crumb").textContent=i[e]??"";try{switch(e){case"dashboard":Hi(s);break;case"mission":ei(s,t);break;case"sim":xa(s);break;case"fleet":pi(s,t);break;case"memory":di(s,t);break;case"recall":ci(s);break;case"agent":t==="assistant"?ht(s):oa(s);break;case"analytics":hi(s);break;case"missions":oi(s,t);break;case"alerts":fi(s);break;case"settings":gi(s);break;default:s.innerHTML=`<div class="view">${$s("Page not found",`No view named “${e}”.`,"dashboard","Back to dashboard")}</div>`}}catch(a){console.error("View render failed:",a),s.innerHTML=`<div class="view">${$s("Something went wrong",a instanceof Error?a.message:"Unexpected rendering error","dashboard","Back to dashboard")}</div>`}}function $s(e,t,s,i){return`<div class="empty-state" style="padding:60px 20px">
    <div class="es-ico">${u("warning",36)}</div>
    <div class="es-title" style="font-size:15px">${e}</div>
    <div class="es-sub">${t}</div>
    <button class="btn mt-16" onclick="location.hash='#/${s}'">${i}</button>
  </div>`}function xa(e){var i,a;const t=S().missions.find(r=>r.status==="active"||r.status==="paused");if(t){ei(e,t.id);return}const s=we(((i=S().missions[0])==null?void 0:i.id)??"");e.innerHTML=`
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Live Simulation</h1>
          <div class="vsub">A 2D simulated environment with obstacles, restricted zones, checkpoints and alternative routes. Start a mission to watch a robot navigate it.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="sv-new">${u("play",14)} Start a mission</button>
        </div>
      </div>
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${u("sim",15)} Environments</div></div>
        <div class="panel-body grid-3">
          ${Ma()}
        </div>
      </section>
      <div class="info-note sim-note mt">${u("info",15)}<span>${s?`Most recent mission: <b style="color:var(--text-1)">${s.code}</b> — open it from Mission History to replay.`:"No missions recorded yet."}</span></div>
    </div>`,(a=document.getElementById("sv-new"))==null||a.addEventListener("click",()=>I("mission")),e.querySelectorAll("[data-nav]").forEach(r=>r.addEventListener("click",()=>I(r.dataset.nav)))}function Ma(){return ze.map(e=>`
    <div class="compare-card">
      <div class="panel-title mb-8">${u("layers",14)} ${e.name}</div>
      <div class="kv-list">
        <div class="kv-row"><span class="k">Checkpoints</span><span class="v">${e.nodes.length}</span></div>
        <div class="kv-row"><span class="k">Obstacles</span><span class="v">${e.obstacles.length}</span></div>
        <div class="kv-row"><span class="k">Zones</span><span class="v">${e.zones.length}</span></div>
      </div>
    </div>`).join("")}function ka(){document.addEventListener("keydown",e=>{const t=["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName);if(e.key==="/"&&!t)e.preventDefault(),zs(I);else if(e.key==="Escape")je(),Le(),is();else if(e.key==="g"&&!t){const s=i=>{document.removeEventListener("keydown",s),i.key==="d"?I("dashboard"):i.key==="m"?I("mission"):i.key==="f"?I("fleet"):i.key==="h"&&I("missions")};document.addEventListener("keydown",s,{once:!0})}})}function Sa(){const t=S().robots.some(i=>i.status==="offline"||i.battery<15),s=document.querySelector("#sb-sysstatus");s&&(s.innerHTML=`<span class="status-dot ${t?"degraded":""}"></span><span class="sys-txt"><b>${t?"Degraded":"Operational"}</b></span><span class="sys-sub" id="sb-clock">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>`)}Ys();Sn();ma(document.getElementById("app"));
