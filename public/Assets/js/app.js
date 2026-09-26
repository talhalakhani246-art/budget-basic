/* BudgetBasic — all client-side interactions, no backend required */
"use strict";
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const money=n=>`Rs. ${Number(n||0).toLocaleString("en-PK",{maximumFractionDigits:0})}`;

/* Demo authentication: account + session are local to this browser. */
function getSession(){try{return JSON.parse(localStorage.getItem("budgetbasic_session")||"null")}catch(e){return null}}
function syncAuthUI(){
 const session=getSession();
 const dash=$("#navDashboard"),logout=$("#navLogout"),login=$("#navLogin"),signup=$("#navSignup"),user=$("#navUser"),userName=$("#navUserName");
 if(!dash)return;
 const logged=!!(session&&session.loggedIn);
 dash.hidden=!logged; logout.hidden=!logged; user.hidden=!logged; login.hidden=logged; signup.hidden=logged;
 if(logged) userName.textContent=session.name||session.email||"User";
 logout.onclick=()=>{localStorage.removeItem("budgetbasic_session");location.reload()};
}
syncAuthUI();

/* Static data mirrors the supplied SRS/data files and keeps the site usable when opened directly. */
const basics=[
 {icon:"fa-solid fa-wallet",title:"Income",text:"Money received from allowance, work, gifts or other legitimate sources."},
 {icon:"fa-solid fa-house",title:"Fixed expenses",text:"Regular costs that are fairly predictable, such as transport or study fees."},
 {icon:"fa-solid fa-sliders",title:"Variable expenses",text:"Costs that can change from month to month, such as food or activities."},
 {icon:"fa-solid fa-piggy-bank",title:"Savings",text:"Money set aside for future goals or unexpected needs."}
];
const tips=[
"Write down income before planning expenses.","Separate needs from wants before buying.","Try a small automatic saving habit.","Review subscriptions you no longer use.",
"Give non-essential purchases a cooling-off period.","Use categories so your spending is easier to understand."
];
const mistakes=[
 ["Impulse buying","A student sees a sale and buys something without checking the budget.","Pause for 24 hours, check the budget, then decide if the purchase still matters."],
 ["Unused subscriptions","A monthly service keeps charging even though it is rarely used.","Review subscriptions regularly and cancel services that no longer provide value."],
 ["Late payments","A student forgets a due date and creates avoidable stress or extra cost.","Keep a simple due-date list or calendar reminder."],
 ["No emergency buffer","All available money is allocated, leaving no room for an unexpected expense.","Build a small savings buffer gradually and label it clearly."],
 ["Ignoring small expenses","Frequent small purchases are not recorded, so the monthly total is underestimated.","Track every expense for a short period to identify patterns."],
 ["Needs and wants mixed","Optional spending is treated as essential, making the budget harder to control.","Ask whether the purchase is necessary now or can safely wait."]
];
const gallery=[
 ["needs","Needs vs Wants","Essentials support daily life; optional wants can often be delayed.","needs"],
 ["rule","50 / 30 / 20","A simple educational allocation: 50% needs, 30% wants, 20% savings.","rule"],
 ["cycle","Budget Cycle","Plan → spend → record → review → adjust. Budgeting is an ongoing process.","cycle"],
 ["saving","Saving Challenge","Set a small target, contribute consistently and review progress each month.","saving"]
];
const searchData=[
 ...basics.map(x=>({title:x.title,text:x.text,topic:"Basics"})),
 ...tips.map(x=>({title:"Budget tip",text:x,topic:"Tips"})),
 ...mistakes.map(x=>({title:x[0],text:x[1]+" "+x[2],topic:"Money Mistakes"})),
 {title:"Needs vs Wants",text:"Essential and optional spending categories plus a decision guide.",topic:"Needs & Wants"},
 {title:"50/30/20",text:"Estimate needs, wants and savings from a monthly income.",topic:"Budget Rule"},
 {title:"Savings Goals",text:"Calculate remaining amount and estimated months to reach a target.",topic:"Savings"},
 {title:"Expense Planner",text:"Add, edit and remove sample expenses and see total and remaining balance.",topic:"Expenses"}
];

/* Live date/time + visitor counter */
function updateClock(){
 const now=new Date();
 const time=now.toLocaleTimeString("en-PK",{hour12:true});
 $("#liveTime").textContent=time;
 $("#navLiveTime").textContent=time;
 $("#liveDate").textContent=now.toLocaleDateString("en-PK",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
}
updateClock(); setInterval(updateClock,1000);
const visits=Number(localStorage.getItem("budgetbasic_visits")||0)+1;
localStorage.setItem("budgetbasic_visits",String(visits));
$("#visitorCount").textContent=visits; $("#footerVisitors").textContent=visits; $("#navVisitorCount").textContent=visits;

/* Navbar */
const navToggle=$("#navToggle"), navMenu=$("#navMenu");
navToggle.addEventListener("click",()=>{const open=navMenu.classList.toggle("open");navToggle.setAttribute("aria-expanded",open);});
$$(".nav-link").forEach(a=>a.addEventListener("click",()=>navMenu.classList.remove("open")));
const sections=$$("main section[id]");
const navLinks=$$(".nav-link");
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));}}),{rootMargin:"-25% 0px -65% 0px"});
sections.forEach(s=>navObserver.observe(s));

/* Theme */
$("#themeToggle").addEventListener("click",e=>{
 e.preventDefault(); document.body.classList.toggle("light");
 const light=document.body.classList.contains("light");
 localStorage.setItem("budgetbasic_theme",light?"light":"dark");
 $("#themeToggle").innerHTML=light?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';
});
if(localStorage.getItem("budgetbasic_theme")==="light"){document.body.classList.add("light");$("#themeToggle").innerHTML='<i class="fa-solid fa-moon"></i>'}

/* Reveal */
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObserver.unobserve(e.target)}}),{threshold:.08});
$$(".reveal").forEach(el=>revealObserver.observe(el));

/* Ticker */
const ticker=$("#tickerTrack");
const tickerItems=[...tips,...tips];
ticker.innerHTML=tickerItems.map((t,i)=>`<span class="ticker-item"><b>TIP ${i%tips.length+1}</b>${t}</span>`).join("");

/* Basics */
$("#basicsGrid").innerHTML=basics.map(x=>`<article class="info-card reveal visible"><div class="card-icon"><i class="${x.icon}"></i></div><span class="mini-label">CORE</span><h3>${x.title}</h3><p>${x.text}</p></article>`).join("");
$$(".choice-grid button").forEach(btn=>btn.addEventListener("click",()=>{
 const ok=btn.dataset.correct==="true"; const f=$("#knowledgeFeedback");
 f.textContent=ok?"Correct — basic transport for education is generally an essential expense.":"Not quite — this is normally an optional want.";
 f.className="feedback "+(ok?"good":"bad");
}));

/* Needs vs Wants classifier */
const examples=[
 ["A monthly internet connection used for online classes.","need"],
 ["A premium game skin bought for fun.","want"],
 ["Basic medicine prescribed for an illness.","need"],
 ["A second pair of headphones when the current pair works.","want"],
 ["Bus fare needed to reach college.","need"]
];
let exampleIndex=0;
function showExample(){ $("#classifyPrompt").textContent=examples[exampleIndex][0]; $("#classifyFeedback").textContent="Your answer will appear here."; $("#classifyFeedback").className="feedback"; }
$$("[data-classify]").forEach(btn=>btn.addEventListener("click",()=>{
 const correct=btn.dataset.classify===examples[exampleIndex][1],f=$("#classifyFeedback");
 f.textContent=correct?"Correct! Think about whether the item is necessary right now.":"Try again. Ask whether the item is essential or can reasonably be delayed.";
 f.className="feedback "+(correct?"good":"bad");
}));
$("#nextClassify").addEventListener("click",()=>{exampleIndex=(exampleIndex+1)%examples.length;showExample()});

/* 50/30/20 */
let budgetIncome=0;
function calcBudget(){
 const income=Number($("#income").value),err=$("#budgetError");
 if(!Number.isFinite(income)||income<=0){err.textContent="Enter a positive monthly income amount.";return}
 budgetIncome=income;err.textContent="";
 const vals=[income*.5,income*.3,income*.2];
 $("#needResult").textContent=money(vals[0]);$("#wantResult").textContent=money(vals[1]);$("#saveResult").textContent=money(vals[2]);
 $("#needBar").style.width="50%";$("#wantBar").style.width="30%";$("#saveBar").style.width="20%";renderExpenses();
}
$("#budgetCalc").addEventListener("click",calcBudget);

/* Savings */
$("#goalCalc").addEventListener("click",()=>{
 const name=$("#goalName").value.trim()||"Savings goal",target=Number($("#target").value),current=Number($("#current").value),monthly=Number($("#monthly").value),err=$("#goalError");
 if(!Number.isFinite(target)||target<=0||!Number.isFinite(current)||current<0||!Number.isFinite(monthly)||monthly<=0){err.textContent="Enter a positive target and monthly contribution; current savings cannot be negative.";return}
 if(current>=target){err.textContent="";$("#goalTitle").textContent=name;$("#goalSummary").textContent="Your current savings already meet or exceed the target.";$("#goalBar").style.width="100%";$("#goalSaved").textContent=`Saved: ${money(current)}`;$("#goalRemaining").textContent="Remaining: Rs. 0";return}
 const remaining=target-current, months=Math.ceil(remaining/monthly),pct=Math.min(100,current/target*100);
 err.textContent="";$("#goalTitle").textContent=name;$("#goalSummary").textContent=`Estimated time: ${months} month${months===1?"":"s"} at ${money(monthly)} per month.`;$("#goalBar").style.width=pct+"%";$("#goalSaved").textContent=`Saved: ${money(current)}`;$("#goalRemaining").textContent=`Remaining: ${money(remaining)}`;
});

/* Expense planner — session only */
let expenses=[];
function renderExpenses(){
 const body=$("#expenseBody"),total=expenses.reduce((s,e)=>s+e.amount,0);
 body.innerHTML=expenses.length?expenses.map((e,i)=>`<tr><td>${e.date}</td><td>${e.category}</td><td>${escapeHtml(e.desc)}</td><td>${money(e.amount)}</td><td><button data-edit="${i}" aria-label="Edit expense ${i+1}" style="margin-right:5px;border:1px solid rgba(245,210,122,.25);background:transparent;color:#f5d27a;border-radius:8px;padding:6px 9px;font-size:10px"><i class="fa-solid fa-pen"></i></button><button data-remove="${i}" aria-label="Remove expense ${i+1}"><i class="fa-solid fa-trash"></i></button></td></tr>`).join(""):'<tr><td colspan="5" class="empty">No expenses added yet.</td></tr>';
 $("#expenseTotal").textContent=money(total);$("#expenseCount").textContent=expenses.length;
 const base=budgetIncome||Number($("#income").value)||0; $("#expenseBalance").textContent=base?money(base-total):"Set income first";
 $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>{
 const i=Number(b.dataset.edit),e=expenses[i];
 $("#expDate").value=e.date;$("#expCategory").value=e.category;$("#expDesc").value=e.desc;$("#expAmount").value=e.amount;
 expenses.splice(i,1);renderExpenses();$("#expDesc").focus();
}));
$$("[data-remove]").forEach(b=>b.addEventListener("click",()=>{expenses.splice(Number(b.dataset.remove),1);renderExpenses()}));
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
$("#expDate").value=new Date().toISOString().slice(0,10);
$("#addExpense").addEventListener("click",()=>{
 const desc=$("#expDesc").value.trim(),amount=Number($("#expAmount").value),err=$("#expenseError");
 if(!desc||!Number.isFinite(amount)||amount<=0){err.textContent="Add a description and a positive amount.";return}
 expenses.push({date:$("#expDate").value||new Date().toISOString().slice(0,10),category:$("#expCategory").value,desc,amount});
 $("#expDesc").value="";$("#expAmount").value="";err.textContent="";renderExpenses();
});

/* Mistakes accordion */
$("#mistakesList").innerHTML=mistakes.map((m,i)=>`<article class="acc-item"><button class="acc-head" aria-expanded="false"><span>${String(i+1).padStart(2,"0")} · ${m[0]}</span><i class="fa-solid fa-plus"></i></button><div class="acc-body"><p><b>Student scenario:</b> ${m[1]}</p><p><b>Corrective action:</b> ${m[2]}</p></div></article>`).join("");
$$(".acc-head").forEach(b=>b.addEventListener("click",()=>{const item=b.parentElement,open=item.classList.toggle("open");b.setAttribute("aria-expanded",open)}));

/* Gallery */
function renderGallery(filter="all"){
 const items=gallery.filter(g=>filter==="all"||g[0]===filter);
 $("#galleryGrid").innerHTML=items.map(g=>{
   let art=g[3]==="rule"?'<div class="donut"></div>':g[3]==="cycle"?'<div class="cycle"><span>PLAN</span><span>SPEND</span><span>REVIEW</span></div>':g[3]==="saving"?'<div class="coins"><i class="fa-solid fa-coins"></i></div>':'<div class="donut" style="background:conic-gradient(#d9a441 0 60%,#33302a 60%)"></div>';
   return `<article class="visual-card reveal visible"><div class="visual-art">${art}</div><span class="mini-label">${g[0]}</span><h3>${g[1]}</h3><p>${g[2]}</p></article>`;
 }).join("");
}
renderGallery();
$$(".filter-btn").forEach(b=>b.addEventListener("click",()=>{$$(".filter-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderGallery(b.dataset.filter)}));

/* Global search */
function renderSearch(q=""){
 const term=q.trim().toLowerCase(),items=term?searchData.filter(x=>(x.title+" "+x.text+" "+x.topic).toLowerCase().includes(term)):searchData.slice(0,6);
 $("#searchCount").textContent=term?`${items.length} match${items.length===1?"":"es"}`:"Featured topics";
 $("#searchResults").innerHTML=items.length?items.map(x=>`<article class="search-item"><span class="mini-label">${x.topic}</span><b>${x.title}</b><p>${x.text}</p></article>`).join(""):`<article class="search-item"><b>No matches found.</b><p>Try another keyword such as saving, needs, expenses or goals.</p></article>`;
}
renderSearch();$("#globalSearch").addEventListener("input",e=>renderSearch(e.target.value));
const topSearch=$("#topSearch");
if(topSearch) topSearch.addEventListener("input",e=>{
 const q=e.target.value; renderSearch(q);
 if(q.trim()) document.querySelector("#search").scrollIntoView({behavior:"smooth",block:"start"});
});
if(topSearch) topSearch.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();document.querySelector("#search").scrollIntoView({behavior:"smooth",block:"start"});$("#globalSearch").focus();}});

/* Rule-based chatbot */
const chatRules=[
 {keys:["50/30/20","50 30 20","fifty"],answer:"The 50/30/20 framework is an educational estimate: about 50% for needs, 30% for wants and 20% for savings."},
 {keys:["save","saving","savings"],answer:"Start with a realistic amount you can contribute consistently. This site can estimate months to a target using the Savings Goals tool."},
 {keys:["need","needs"],answer:"A need is an essential expense that supports basic living, education, health or safety. Ask whether it is necessary now or can reasonably wait."},
 {keys:["want","wants"],answer:"A want is an optional purchase that may improve enjoyment but can often be delayed when the budget is tight."},
 {keys:["expense","expenses","track"],answer:"Use the Expense Planner to add a date, category, description and amount. You can remove entries during the current session."},
 {keys:["budget"],answer:"A budget is a plan for allocating expected income across expenses, savings and other priorities."},
 {keys:["goal","goals"],answer:"Enter your target, current savings and monthly contribution in Savings Goals. The tool estimates the remaining amount and months."},
 {keys:["mistake","mistakes"],answer:"Common mistakes include impulse buying, unused subscriptions, late payments and failing to track small expenses."},
 {keys:["advice","invest","investment","loan","tax"],answer:"I can provide general educational budgeting information, but I cannot give personalised professional financial advice."}
];
function botReply(q){
 const text=q.toLowerCase();
 const rule=chatRules.find(r=>r.keys.some(k=>text.includes(k)));
 return rule?rule.answer:"I can help with budgeting basics, needs vs wants, 50/30/20, savings goals, expenses and common money mistakes. Try one of the suggested prompts.";
}
function addMessage(text,type){const el=document.createElement("div");el.className=`message ${type}`;el.textContent=text;$("#chatMessages").appendChild(el);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight}
function askBot(q){if(!q.trim())return;addMessage(q,"user");setTimeout(()=>addMessage(botReply(q),"bot"),180)}
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();const q=$("#chatInput").value;$("#chatInput").value="";askBot(q)});
$$("[data-prompt]").forEach(b=>b.addEventListener("click",()=>askBot(b.dataset.prompt)));

/* Feedback validation */
let rating=0;
$$(".rating button").forEach(b=>b.addEventListener("click",()=>{rating=Number(b.dataset.rating);$("#fbRating").value=rating;$$(".rating button").forEach(x=>x.classList.toggle("active",Number(x.dataset.rating)<=rating))}));
$("#feedbackForm").addEventListener("submit",e=>{
 e.preventDefault();const name=$("#fbName").value.trim(),email=$("#fbEmail").value.trim(),comments=$("#fbComments").value.trim(),err=$("#feedbackError");
 if(!name||!email||!email.includes("@")||!rating||!comments){err.textContent="Please complete name, valid email, rating and comments.";$("#feedbackSuccess").hidden=true;return}
 err.textContent="";$("#feedbackSuccess").hidden=false;e.target.reset();rating=0;$$(".rating button").forEach(x=>x.classList.remove("active"));
});

/* Scroll controls */
window.addEventListener("scroll",()=>{
 const doc=document.documentElement,sc=doc.scrollTop/(doc.scrollHeight-doc.clientHeight)*100;
 $("#scrollProgress").style.width=sc+"%";$("#backTop").classList.toggle("show",doc.scrollTop>500);
},{passive:true});
$("#backTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
