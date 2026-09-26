import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

function Home() {
  const [budgetIncome, setBudgetIncome] = useState("");
  const [budgetResults, setBudgetResults] = useState(null);
  const [budgetError, setBudgetError] = useState("");

  const [goalForm, setGoalForm] = useState({ name: "", target: "", current: "", monthly: "" });
  const [goalResult, setGoalResult] = useState(null);
  const [goalError, setGoalError] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "Food",
    desc: "",
    amount: ""
  });
  const [expenseError, setExpenseError] = useState("");

  const galleryData = [
    { filter: "needs", title: "Needs vs Wants", desc: "Essentials support daily life; optional wants can often be delayed.", type: "needs" },
    { filter: "rule", title: "50 / 30 / 20", desc: "A simple educational allocation: 50% needs, 30% wants, 20% savings.", type: "rule" },
    { filter: "cycle", title: "Budget Cycle", desc: "Plan → spend → record → review → adjust. Budgeting is an ongoing process.", type: "cycle" },
    { filter: "saving", title: "Saving Challenge", desc: "Set a small target, contribute consistently and review progress each month.", type: "saving" }
  ];
  const [galleryFilter, setGalleryFilter] = useState("all");

  const [mistakesState, setMistakesState] = useState([
    { title: "Impulse buying", scenario: "A student sees a sale and buys something without checking the budget.", action: "Pause for 24 hours, check the budget, then decide if the purchase still matters.", open: false },
    { title: "Unused subscriptions", scenario: "A monthly service keeps charging even though it is rarely used.", action: "Review subscriptions regularly and cancel services that no longer provide value.", open: false },
    { title: "Late payments", scenario: "A student forgets a due date and creates avoidable stress or extra cost.", action: "Keep a simple due-date list or calendar reminder.", open: false }
  ]);

  const basicsInfo = [
    {icon:"fa-solid fa-wallet",title:"Income",text:"Money received from allowance, work, gifts or other legitimate sources."},
    {icon:"fa-solid fa-house",title:"Fixed expenses",text:"Regular costs that are fairly predictable, such as transport or study fees."},
    {icon:"fa-solid fa-sliders",title:"Variable expenses",text:"Costs that can change from month to month, such as food or activities."},
    {icon:"fa-solid fa-piggy-bank",title:"Savings",text:"Money set aside for future goals or unexpected needs."}
  ];

  const [knowledgeFeedback, setKnowledgeFeedback] = useState("Choose an answer to check your understanding.");
  const [knowledgeClass, setKnowledgeClass] = useState("");
  
  const handleKnowledgeCheck = (isCorrect) => {
    setKnowledgeFeedback(isCorrect ? "Correct — basic transport for education is generally an essential expense." : "Not quite — this is normally an optional want.");
    setKnowledgeClass(isCorrect ? "good" : "bad");
  };

  const classifierExamples = [
    ["A monthly internet connection used for online classes.", "need"],
    ["A premium game skin bought for fun.", "want"],
    ["Basic medicine prescribed for an illness.", "need"],
    ["A second pair of headphones when the current pair works.", "want"],
    ["Bus fare needed to reach college.", "need"]
  ];
  const [exampleIndex, setExampleIndex] = useState(0);
  const [classifyFeedback, setClassifyFeedback] = useState("Your answer will appear here.");
  const [classifyClass, setClassifyClass] = useState("");

  const handleClassify = (answer) => {
    const isCorrect = answer === classifierExamples[exampleIndex][1];
    setClassifyFeedback(isCorrect ? "Correct! Think about whether the item is necessary right now." : "Try again. Ask whether the item is essential or can reasonably be delayed.");
    setClassifyClass(isCorrect ? "good" : "bad");
  };

  const nextClassify = () => {
    setExampleIndex((exampleIndex + 1) % classifierExamples.length);
    setClassifyFeedback("Your answer will appear here.");
    setClassifyClass("");
  };

  const [chatMessages, setChatMessages] = useState([{text: "Hi! Ask me about budgeting, savings, needs vs wants, expenses or the 50/30/20 rule.", type: "bot"}]);
  const [chatInput, setChatInput] = useState("");

  const chatRules = [
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

  const handleChat = (q) => {
    if (!q.trim()) return;
    setChatMessages(prev => [...prev, {text: q, type: "user"}]);
    setChatInput("");
    
    setTimeout(() => {
      const text = q.toLowerCase();
      const rule = chatRules.find(r => r.keys.some(k => text.includes(k)));
      const reply = rule ? rule.answer : "I can help with budgeting basics, needs vs wants, 50/30/20, savings goals, expenses and common money mistakes. Try one of the suggested prompts.";
      setChatMessages(prev => [...prev, {text: reply, type: "bot"}]);
    }, 400);
  };

  const searchData = [
    ...basicsInfo.map(x=>({title:x.title,text:x.text,topic:"Basics"})),
    {title:"Needs vs Wants",text:"Essential and optional spending categories plus a decision guide.",topic:"Needs & Wants"},
    {title:"50/30/20",text:"Estimate needs, wants and savings from a monthly income.",topic:"Budget Rule"},
    {title:"Savings Goals",text:"Calculate remaining amount and estimated months to reach a target.",topic:"Savings"},
    {title:"Expense Planner",text:"Add, edit and remove sample expenses and see total and remaining balance.",topic:"Expenses"}
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const filteredSearch = searchQuery.trim() ? searchData.filter(x => (x.title + " " + x.text + " " + x.topic).toLowerCase().includes(searchQuery.trim().toLowerCase())) : searchData.slice(0, 4);

  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", comments: "" });
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const name = feedbackForm.name.trim();
    const email = feedbackForm.email.trim();
    const comments = feedbackForm.comments.trim();
    
    if (!name || !email || !email.includes("@") || !feedbackRating || !comments) {
      setFeedbackError("Please complete name, valid email, rating and comments.");
      setFeedbackSuccess(false);
      return;
    }
    setFeedbackError("");
    setFeedbackSuccess(true);
    setFeedbackForm({ name: "", email: "", comments: "" });
    setFeedbackRating(0);
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const handleBudgetCalc = () => {
    const income = Number(budgetIncome);
    if (!Number.isFinite(income) || income <= 0) {
      setBudgetError("Enter a positive monthly income amount.");
      return;
    }
    setBudgetError("");
    setBudgetResults({
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2,
    });
  };

  const handleGoalCalc = () => {
    const target = Number(goalForm.target);
    const current = Number(goalForm.current);
    const monthly = Number(goalForm.monthly);
    if (!Number.isFinite(target) || target <= 0 || !Number.isFinite(current) || current < 0 || !Number.isFinite(monthly) || monthly <= 0) {
      setGoalError("Enter a positive target and monthly contribution; current savings cannot be negative.");
      return;
    }
    setGoalError("");
    const name = goalForm.name.trim() || "Savings goal";
    if (current >= target) {
      setGoalResult({ name, summary: "Your current savings already meet or exceed the target.", pct: 100, current, remaining: 0 });
      return;
    }
    const remaining = target - current;
    const months = Math.ceil(remaining / monthly);
    const pct = Math.min(100, (current / target) * 100);
    setGoalResult({ name, summary: `Estimated time: ${months} month${months === 1 ? "" : "s"} at Rs. ${monthly} per month.`, pct, current, remaining });
  };

  const handleAddExpense = () => {
    const desc = expenseForm.desc.trim();
    const amount = Number(expenseForm.amount);
    if (!desc || !Number.isFinite(amount) || amount <= 0) {
      setExpenseError("Add a description and a positive amount.");
      return;
    }
    setExpenses([...expenses, { ...expenseForm, amount }]);
    setExpenseForm({ ...expenseForm, desc: "", amount: "" });
    setExpenseError("");
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const expenseBase = Number(budgetIncome) || 0;
  const expenseBalance = expenseBase ? money(expenseBase - expenseTotal) : "Set income first";

  // Live clock, date and visitor counter for the hero + footer
  const [heroTime, setHeroTime] = useState("--:--:--");
  const [heroDate, setHeroDate] = useState("Loading date…");
  const [heroVisits, setHeroVisits] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setHeroTime(now.toLocaleTimeString("en-PK", { hour12: true }));
      setHeroDate(now.toLocaleDateString("en-PK", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    setHeroVisits(Number(localStorage.getItem("budgetbasic_visits") || 0));
    return () => clearInterval(timer);
  }, []);

  // Scroll progress bar + back-to-top button
  const [scrollPct, setScrollPct] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollPct(max > 0 ? (doc.scrollTop / max) * 100 : 0);
      setShowBackTop(doc.scrollTop > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Scroll-reveal: add "visible" once a .reveal element enters the viewport
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    const targets = document.querySelectorAll(".reveal");
    targets.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  // Rotating budgeting tips for the ticker strip
  const tips = [
    "Write down income before planning expenses.",
    "Separate needs from wants before buying.",
    "Try a small automatic saving habit.",
    "Review subscriptions you no longer use.",
    "Give non-essential purchases a cooling-off period.",
    "Use categories so your spending is easier to understand."
  ];
  const tickerItems = [...tips, ...tips];

  return (
    <>
      <Navbar />
      
<div className="scroll-progress" id="scrollProgress" style={{ width: `${scrollPct}%` }}></div>
<div className="ambient ambient-one"></div><div className="ambient ambient-two"></div>

<main>
  <section className="hero section" id="home">
    <div className="container hero-grid">
      <div className="hero-copy reveal">
        <div className="eyebrow"><span className="status-dot"></span> STUDENT-FRIENDLY FINANCE LAB</div>
        <h1>Build better money habits with <span className="gold-gradient">clarity.</span></h1>
        <p className="hero-lead">BudgetBasic turns budgeting into simple, interactive learning. Plan your money, understand your choices and practice smarter habits — all in one place.</p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#rule">Start Planning <i className="fa-solid fa-arrow-right"></i></a>
          <a className="btn btn-ghost" href="#basics">Explore Basics</a>
        </div>
        <div className="hero-proof">
          <div><strong id="visitorCount">{heroVisits}</strong><span>visits</span></div>
          <div><strong id="liveTime">{heroTime}</strong><span id="liveDate">{heroDate}</span></div>
          <div><strong>60</strong><span>SRS checks mapped</span></div>
        </div>
      </div>
      <div className="hero-visual reveal delay-1">
        <div className="luxury-card hero-card">
          <div className="card-top"><span>MONTHLY SNAPSHOT</span><i className="fa-solid fa-chart-pie"></i></div>
          <div className="balance-label">Example student income</div>
          <div className="hero-balance">Rs. 60,000</div>
          <div className="mini-chart"><span style={{height: '50%'}}></span><span style={{height: '30%'}}></span><span style={{height: '20%'}}></span></div>
          <div className="allocation"><div><b>50%</b><small>Needs</small></div><div><b>30%</b><small>Wants</small></div><div><b>20%</b><small>Savings</small></div></div>
          <div className="card-note"><i className="fa-solid fa-shield-halved"></i> Educational estimate — not financial advice.</div>
        </div>
        <div className="floating-badge badge-one"><i className="fa-solid fa-piggy-bank"></i> Save first</div>
        <div className="floating-badge badge-two"><i className="fa-solid fa-bolt"></i> Learn by doing</div>
      </div>
    </div>
  </section>

  <section className="ticker-wrap" aria-label="Budgeting tips">
    <div className="ticker-track" id="tickerTrack">
      {tickerItems.map((t, i) => (
        <span className="ticker-item" key={i}><b>TIP {(i % tips.length) + 1}</b>{t}</span>
      ))}
    </div>
  </section>

  <section className="section" id="basics">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">FOUNDATIONS</span><h2>Budgeting Basics</h2><p>Know where your money comes from, where it goes, and what you want it to achieve.</p></div>
      <div className="cards-grid four" id="basicsGrid">
        {basicsInfo.map((b, i) => (
          <article className="info-card reveal visible" key={i}>
            <div className="card-icon"><i className={b.icon}></i></div>
            <span className="mini-label">CORE</span>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </article>
        ))}
      </div>
      <div className="two-col sample-area">
        <article className="luxury-card reveal">
          <div className="card-heading"><div><span className="mini-label">SAMPLE</span><h3>Student Monthly Budget</h3></div><i className="fa-solid fa-table"></i></div>
          <div className="table-wrap"><table><thead><tr><th>Type</th><th>Example</th><th>Amount</th></tr></thead><tbody>
            <tr><td>Income</td><td>Allowance / part-time work</td><td>Rs. 60,000</td></tr>
            <tr><td>Fixed expense</td><td>Transport + study costs</td><td>Rs. 18,000</td></tr>
            <tr><td>Variable expense</td><td>Food + activities</td><td>Rs. 12,000</td></tr>
            <tr><td>Savings</td><td>Emergency / future goal</td><td>Rs. 12,000</td></tr>
            <tr><td>Flexible balance</td><td>Review before spending</td><td>Rs. 18,000</td></tr>
          </tbody></table></div>
        </article>
        <article className="luxury-card knowledge-card reveal delay-1">
          <span className="mini-label">QUICK CHECK</span><h3>Which is usually an essential expense?</h3>
          <div className="choice-grid" id="knowledgeChoices">
            <button onClick={() => handleKnowledgeCheck(true)}>Basic transport to class</button>
            <button onClick={() => handleKnowledgeCheck(false)}>A new game skin</button>
            <button onClick={() => handleKnowledgeCheck(false)}>Extra fashion accessory</button>
          </div>
          <p className={`feedback ${knowledgeClass}`} id="knowledgeFeedback">{knowledgeFeedback}</p>
        </article>
      </div>
    </div>
  </section>

  <section className="section section-soft" id="needs">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">CHOICES</span><h2>Needs vs Wants</h2><p>Practice separating essentials from optional spending before you buy.</p></div>
      <div className="two-col">
        <article className="decision-panel need reveal"><div className="decision-icon"><i className="fa-solid fa-house"></i></div><span className="mini-label">NEEDS</span><h3>Essentials</h3><p>Things that support health, education, safety and basic daily life.</p><div className="tag-list"><span>Food</span><span>Basic transport</span><span>Study supplies</span><span>Utilities</span></div></article>
        <article className="decision-panel want reveal delay-1"><div className="decision-icon"><i className="fa-solid fa-sparkles"></i></div><span className="mini-label">WANTS</span><h3>Optional choices</h3><p>Things that can improve enjoyment but can usually be delayed.</p><div className="tag-list"><span>Gaming extras</span><span>Premium fashion</span><span>Eating out</span><span>Entertainment</span></div></article>
      </div>
      <div className="classifier luxury-card reveal">
        <div className="classifier-copy"><span className="mini-label">INTERACTIVE</span><h3>Classify the item</h3><p id="classifyPrompt">{classifierExamples[exampleIndex][0]}</p></div>
        <div className="classifier-actions"><button className="btn btn-outline" onClick={() => handleClassify("need")}>Need</button><button className="btn btn-outline" onClick={() => handleClassify("want")}>Want</button></div>
        <p className={`feedback ${classifyClass}`} id="classifyFeedback">{classifyFeedback}</p>
        <button className="text-btn" id="nextClassify" onClick={nextClassify}>Next example <i className="fa-solid fa-arrow-right"></i></button>
      </div>
      <div className="delay-guide reveal">
        <div className="guide-icon"><i className="fa-solid fa-hourglass-half"></i></div>
        <div><span className="mini-label">3-STEP DECISION GUIDE</span><h3>Pause before non-essential purchases</h3><p><b>1.</b> Wait 24 hours. <b>2.</b> Check your budget. <b>3.</b> Decide whether the purchase still supports your goals.</p></div>
      </div>
    </div>
  </section>

  <section className="section" id="rule">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">THE RULE</span><h2>50 / 30 / 20 Budget</h2><p>A simple educational framework: 50% needs, 30% wants and 20% savings. Use it as an estimate, not a strict rule.</p></div>
      <div className="rule-grid">
        <div className="rule-wheel luxury-card reveal"><div className="wheel" aria-label="50 30 20 visual"><div className="wheel-center">50<br /><small>NEEDS</small></div><div className="wheel-label w50">50%</div><div className="wheel-label w30">30%</div><div className="wheel-label w20">20%</div></div></div>
        <div className="luxury-card calculator reveal delay-1">
          <span className="mini-label">CALCULATOR</span><h3>Try your monthly income</h3>
          <label htmlFor="income">Monthly income (Rs.)</label>
          <input className="field" id="income" type="number" min="1" step="1" placeholder="60000" inputMode="decimal" value={budgetIncome} onChange={e => setBudgetIncome(e.target.value)} />
          <button className="btn btn-gold full" id="budgetCalc" onClick={handleBudgetCalc}>Calculate split <i className="fa-solid fa-calculator"></i></button>
          <p className="form-error" id="budgetError" role="alert">{budgetError}</p>
          <div className="result-grid">
            <div><span>Needs · 50%</span><strong id="needResult">{budgetResults ? money(budgetResults.needs) : 'Rs. 0'}</strong><div className="bar"><i id="needBar" style={{ width: budgetResults ? '50%' : '0%' }}></i></div></div>
            <div><span>Wants · 30%</span><strong id="wantResult">{budgetResults ? money(budgetResults.wants) : 'Rs. 0'}</strong><div className="bar"><i id="wantBar" style={{ width: budgetResults ? '30%' : '0%' }}></i></div></div>
            <div><span>Savings · 20%</span><strong id="saveResult">{budgetResults ? money(budgetResults.savings) : 'Rs. 0'}</strong><div className="bar"><i id="saveBar" style={{ width: budgetResults ? '20%' : '0%' }}></i></div></div>
          </div>
          <div className="note"><i className="fa-solid fa-circle-info"></i> Estimate only. Real budgets depend on individual circumstances.</div>
        </div>
      </div>
    </div>
  </section>

  <section className="section section-soft" id="saving">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">FUTURE YOU</span><h2>Savings Goals</h2><p>Turn a target into a simple estimate for how long it could take.</p></div>
      <div className="two-col">
        <div className="luxury-card form-card reveal">
          <div className="form-row"><div><label htmlFor="goalName">Goal name</label><input className="field" id="goalName" placeholder="New laptop" value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})} /></div><div><label htmlFor="target">Target (Rs.)</label><input className="field" id="target" type="number" min="1" placeholder="150000" value={goalForm.target} onChange={e => setGoalForm({...goalForm, target: e.target.value})} /></div></div>
          <div className="form-row"><div><label htmlFor="current">Current savings (Rs.)</label><input className="field" id="current" type="number" min="0" placeholder="30000" value={goalForm.current} onChange={e => setGoalForm({...goalForm, current: e.target.value})} /></div><div><label htmlFor="monthly">Monthly contribution (Rs.)</label><input className="field" id="monthly" type="number" min="1" placeholder="15000" value={goalForm.monthly} onChange={e => setGoalForm({...goalForm, monthly: e.target.value})} /></div></div>
          <button className="btn btn-gold full" id="goalCalc" onClick={handleGoalCalc}>Build my saving plan <i className="fa-solid fa-bullseye"></i></button><p className="form-error" id="goalError" role="alert">{goalError}</p>
        </div>
        <div className="goal-result luxury-card reveal delay-1"><span className="mini-label">YOUR ESTIMATE</span><h3 id="goalTitle">{goalResult ? goalResult.name : 'Your goal'}</h3><p id="goalSummary">{goalResult ? goalResult.summary : 'Enter valid values to see your estimate.'}</p><div className="progress-large"><i id="goalBar" style={{ width: goalResult ? `${goalResult.pct}%` : '0%' }}></i></div><div className="result-meta"><span id="goalSaved">Saved: {goalResult ? money(goalResult.current) : 'Rs. 0'}</span><span id="goalRemaining">Remaining: {goalResult ? money(goalResult.remaining) : 'Rs. 0'}</span></div><div className="tip-callout"><i className="fa-solid fa-lightbulb"></i><span>Small, consistent contributions can make a goal easier to manage.</span></div></div>
      </div>
    </div>
  </section>

  <section className="section dark-section" id="expenses">
    <div className="container">
      <div className="section-head light reveal"><span className="eyebrow">TRACK</span><h2>Expense Planner</h2><p>Add, edit or remove sample expenses during this browser session. No server or transaction processing is used.</p></div>
      <div className="expense-layout">
        <div className="luxury-card dark-card reveal">
          <span className="mini-label">NEW ENTRY</span>
          <div className="form-stack"><div><label htmlFor="expDate">Date</label><input className="field" id="expDate" type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} /></div><div><label htmlFor="expCategory">Category</label><select className="field" id="expCategory" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}><option>Food</option><option>Transport</option><option>Education</option><option>Entertainment</option><option>Shopping</option><option>Bills</option><option>Other</option></select></div><div><label htmlFor="expDesc">Description</label><input className="field" id="expDesc" placeholder="Lunch / bus fare" value={expenseForm.desc} onChange={e => setExpenseForm({...expenseForm, desc: e.target.value})} /></div><div><label htmlFor="expAmount">Amount (Rs.)</label><input className="field" id="expAmount" type="number" min="0.01" step="0.01" placeholder="500" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} /></div><button className="btn btn-gold full" id="addExpense" onClick={handleAddExpense}>Add expense</button><p className="form-error" id="expenseError">{expenseError}</p></div>
        </div>
        <div className="luxury-card expense-table-card reveal delay-1">
          <div className="table-summary"><div><span>Total spent</span><strong id="expenseTotal">{money(expenseTotal)}</strong></div><div><span>Entries</span><strong id="expenseCount">{expenses.length}</strong></div><div><span>Remaining vs income</span><strong id="expenseBalance">{expenseBalance}</strong></div></div>
          <div className="table-wrap"><table><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Action</th></tr></thead><tbody id="expenseBody">
            {expenses.length === 0 ? (
              <tr><td colSpan="5" className="empty">No expenses added yet.</td></tr>
            ) : (
              expenses.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td>{e.desc}</td>
                  <td>{money(e.amount)}</td>
                  <td>
                    <button onClick={() => removeExpense(i)} aria-label={`Remove expense ${i+1}`} style={{background:'transparent',border:'none',color:'#f5d27a',cursor:'pointer'}}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody></table></div>
        </div>
      </div>
    </div>
  </section>

  <section className="section" id="mistakes">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">AVOIDABLE</span><h2>Common Money Mistakes</h2><p>Each example includes a student scenario and a practical corrective action.</p></div>
      <div className="accordion" id="mistakesList">
        {mistakesState.map((m, i) => (
          <article className={`acc-item ${m.open ? 'open' : ''}`} key={i}>
            <button className="acc-head" aria-expanded={m.open} onClick={() => {
              const newMs = [...mistakesState];
              newMs[i].open = !newMs[i].open;
              setMistakesState(newMs);
            }}>
              <span>{String(i+1).padStart(2, "0")} · {m.title}</span><i className="fa-solid fa-plus"></i>
            </button>
            <div className="acc-body">
              <p><b>Student scenario:</b> {m.scenario}</p>
              <p><b>Corrective action:</b> {m.action}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>

  <section className="section section-soft" id="infographics">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">VISUAL LEARNING</span><h2>Infographics & Learning Gallery</h2><p>Explore original visual cards for the main budgeting ideas.</p></div>
      <div className="filter-row reveal" id="galleryFilters">
        <button className={`filter-btn ${galleryFilter === 'all' ? 'active' : ''}`} onClick={() => setGalleryFilter('all')}>All</button>
        <button className={`filter-btn ${galleryFilter === 'needs' ? 'active' : ''}`} onClick={() => setGalleryFilter('needs')}>Needs vs Wants</button>
        <button className={`filter-btn ${galleryFilter === 'rule' ? 'active' : ''}`} onClick={() => setGalleryFilter('rule')}>50/30/20</button>
        <button className={`filter-btn ${galleryFilter === 'cycle' ? 'active' : ''}`} onClick={() => setGalleryFilter('cycle')}>Budget Cycle</button>
        <button className={`filter-btn ${galleryFilter === 'saving' ? 'active' : ''}`} onClick={() => setGalleryFilter('saving')}>Saving Challenge</button>
      </div>
      <div className="gallery-grid" id="galleryGrid">
        {galleryData.filter(g => galleryFilter === 'all' || g.filter === galleryFilter).map((g, i) => (
          <article className="visual-card reveal visible" key={i}>
            <div className="visual-art">
              {g.type === 'rule' ? <div className="donut"></div> :
               g.type === 'cycle' ? <div className="cycle"><span>PLAN</span><span>SPEND</span><span>REVIEW</span></div> :
               g.type === 'saving' ? <div className="coins"><i className="fa-solid fa-coins"></i></div> :
               <div className="donut" style={{ background: 'conic-gradient(#d9a441 0 60%,#33302a 60%)' }}></div>}
            </div>
            <span className="mini-label">{g.filter}</span>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>

  <section className="section search-section" id="search">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">FIND IT FAST</span><h2>Search Learning Content</h2><p>Search tips, examples, mistakes and learning topics by keyword.</p></div>
      <div className="search-box luxury-card reveal"><i className="fa-solid fa-magnifying-glass"></i><input id="globalSearch" placeholder="Try: saving, needs, expenses, goals…" aria-label="Search learning content" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /><span id="searchCount">{searchQuery.trim() ? `${filteredSearch.length} matches` : 'Featured topics'}</span></div>
      <div className="search-results" id="searchResults">
        {filteredSearch.length ? filteredSearch.map((s, i) => (
          <article className="search-item" key={i}>
            <span className="mini-label">{s.topic}</span>
            <b>{s.title}</b>
            <p>{s.text}</p>
          </article>
        )) : (
          <article className="search-item"><b>No matches found.</b><p>Try another keyword such as saving, needs, expenses or goals.</p></article>
        )}
      </div>
    </div>
  </section>

  <section className="section dark-section" id="chatbot">
    <div className="container chatbot-intro">
      <div className="section-head light reveal"><span className="eyebrow">AI LEARNING ASSISTANT</span><h2>Ask BudgetBasic</h2><p>A rule-based educational assistant using predefined responses and keyword matching. No API key, server or financial account connection is required.</p></div>
      <div className="chatbot-demo luxury-card reveal">
        <div className="chat-head"><div className="bot-avatar"><i className="fa-solid fa-robot"></i></div><div><strong>Budget Assistant</strong><small><span className="online"></span> Online • educational only</small></div></div>
        <div className="chat-messages" id="chatMessages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {chatMessages.map((m, i) => (
            <div className={`message ${m.type}`} key={i}>{m.text}</div>
          ))}
        </div>
        <div className="suggestions" id="suggestions">
          <button onClick={() => handleChat("What is the 50/30/20 rule?")}>50/30/20 rule</button>
          <button onClick={() => handleChat("How much should I save?")}>How much should I save?</button>
          <button onClick={() => handleChat("What is a need?")}>What is a need?</button>
          <button onClick={() => handleChat("How do I track expenses?")}>Track expenses</button>
        </div>
        <form className="chat-form" id="chatForm" onSubmit={(e) => { e.preventDefault(); handleChat(chatInput); }}>
          <input id="chatInput" autoComplete="off" placeholder="Ask a budgeting question…" aria-label="BudgetBasic chatbot input" value={chatInput} onChange={e => setChatInput(e.target.value)} />
          <button className="btn btn-gold" type="submit">Ask <i className="fa-solid fa-paper-plane"></i></button>
        </form>
        <p className="disclaimer"><i className="fa-solid fa-circle-info"></i> Educational information only — not professional financial advice. The assistant cannot access accounts or process transactions.</p>
      </div>
    </div>
  </section>

  <section className="section" id="about">
    <div className="container">
      <div className="about-grid">
        <div className="section-head reveal"><span className="eyebrow">ABOUT</span><h2>Designed for learning, not transactions.</h2><p>BudgetBasic is a student-focused educational prototype. It demonstrates budgeting concepts through calculators, scenarios, visual learning and client-side interactions.</p><div className="about-points"><div><i className="fa-solid fa-check"></i><span>Static HTML, CSS and JavaScript</span></div><div><i className="fa-solid fa-check"></i><span>No backend database or transaction processing</span></div><div><i className="fa-solid fa-check"></i><span>No collection of sensitive banking details</span></div><div><i className="fa-solid fa-check"></i><span>Keyboard-friendly controls and responsive layout</span></div></div></div>
        <div className="luxury-card creator-card reveal delay-1"><span className="mini-label">PROJECT TEAM</span><h3>Tech Wizards</h3><p>BudgetBasic • Web Innovation Unleashed</p><div className="team-list"><div><span>Abdul Samad</span><small>Student ID: 1729914</small></div><div><span>Muhammad Talha</span><small>Student ID: 1731374</small></div><div><span>Muhammad Yasin</span><small>Student ID: 1731081</small></div><div><span>Muhammad Shabir</span><small>Student ID: 1731350</small></div><div><span>Muhammad Haseeb</span><small>Student ID: 1731377</small></div></div><a className="btn btn-outline full" href="/sitemap">Open Sitemap <i className="fa-solid fa-sitemap"></i></a></div>
      </div>
    </div>
  </section>

  <section className="section section-soft" id="feedback">
    <div className="container">
      <div className="section-head reveal"><span className="eyebrow">YOUR VOICE</span><h2>Feedback</h2><p>Client-side validation only. Nothing is sent to a server or stored as a financial record.</p></div>
      <form className="feedback-form luxury-card reveal" id="feedbackForm" noValidate onSubmit={handleFeedbackSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="fbName">Name</label>
            <input className="field" id="fbName" required value={feedbackForm.name} onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="fbEmail">Email</label>
            <input className="field" id="fbEmail" type="email" required value={feedbackForm.email} onChange={e => setFeedbackForm({...feedbackForm, email: e.target.value})} />
          </div>
        </div>
        <div>
          <label>Rating</label>
          <div className="rating" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                type="button" 
                className={star <= feedbackRating ? "active" : ""}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                onClick={() => setFeedbackRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="fbComments">Comments</label>
          <textarea className="field" id="fbComments" rows="5" required placeholder="What did you find useful?" value={feedbackForm.comments} onChange={e => setFeedbackForm({...feedbackForm, comments: e.target.value})}></textarea>
        </div>
        <button className="btn btn-gold" type="submit">Submit feedback <i className="fa-solid fa-paper-plane"></i></button>
        <p className="form-error" id="feedbackError">{feedbackError}</p>
        {!feedbackError && feedbackSuccess && (
          <div className="success-box" id="feedbackSuccess">Thanks! Your feedback passed client-side validation. No server submission was performed.</div>
        )}
      </form>
    </div>
  </section>

  <section className="section contact-section" id="contact">
    <div className="container">
      <div className="contact-box luxury-card reveal">
        <div><span className="eyebrow">CONTACT</span><h2>Questions about the project?</h2><p>For the classroom/demo project, use the contact details below. External links are clearly identified.</p></div>
        <div className="contact-links">
          <a href="mailto:hello@budgetbasic.example"><i className="fa-solid fa-envelope"></i> hello@budgetbasic.example</a>
          <a href="tel:+920000000000"><i className="fa-solid fa-phone"></i> +92 000 0000000</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener"><i className="fa-brands fa-instagram"></i> Instagram ↗</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener"><i className="fa-brands fa-facebook"></i> Facebook ↗</a>
          <a href="https://twitter.com/" target="_blank" rel="noopener"><i className="fa-brands fa-x-twitter"></i> Twitter / X ↗</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener"><i className="fa-brands fa-linkedin"></i> LinkedIn ↗</a>
        </div>
      </div>
    </div>
  </section>
</main>

<footer className="site-footer">
  <div className="container footer-grid">
    <div><a className="brand" href="#home"><span className="brand-mark"><i className="fa-solid fa-wallet"></i></span><span>Budget<span className="gold-text">Basic</span><small>SMART MONEY LEARNING</small></span></a><p>Simple budgeting education for everyday decisions.</p></div>
    <div><h4>Explore</h4><a href="#basics">Basics</a><a href="#needs">Needs vs Wants</a><a href="#rule">50/30/20</a><a href="#saving">Savings Goals</a></div>
    <div><h4>Tools</h4><a href="#expenses">Expense Planner</a><a href="#mistakes">Money Mistakes</a><a href="#infographics">Infographics</a><a href="#chatbot">AI Chatbot</a></div>
    <div><h4>Project</h4><a href="#feedback">Feedback</a><a href="#contact">Contact</a><a href="/sitemap">Sitemap</a><a href="README.md">Installation Notes</a></div>
  </div>
  <div className="container footer-bottom"><span>© 2026 BudgetBasic • Tech Wizards</span><span>Visitors: <b id="footerVisitors">{heroVisits}</b></span></div>
</footer>
<button className={`back-top ${showBackTop ? 'show' : ''}`} id="backTop" aria-label="Back to top" onClick={scrollToTop}><i className="fa-solid fa-arrow-up"></i></button>



    </>
  );
}

export default Home;
