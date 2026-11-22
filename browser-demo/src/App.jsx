import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Plus,
  X,
  Search,
  Star,
  Home,
  LayoutGrid,
  Timer,
  Library,
  Settings as SettingsIcon,
  Compass,
  Check,
  Ban,
  Play,
  Pause,
  Sparkles,
  Bookmark,
  Globe,
  TrainFront,
  RefreshCw,
  MousePointerClick,
  ShieldCheck,
  CircleCheck,
  Zap,
} from "lucide-react";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail, SiNotion, SiLinear } from "react-icons/si";
import { ANSWERS, SUGGESTED_QUESTIONS, GUIDE_STEPS, GUIDE_DONT, YOUTUBE_VIDEOS, GITHUB_REPOS } from "./demoData";

const ANSWER_URLS = { crm: "blog.hubspot.com", invoice: "waveapps.com", startup: "mca.gov.in" };
const CAPTCHAS = ["K7X9Q2", "M4T8Z1", "B2N6P5", "Q9W3E7"];

const INITIAL_TABS = [
  { id: "newtab", title: "New Route", url: "kaizen://new-route", kind: "route" },
  { id: "crm", title: "How to choose a CRM", url: "blog.hubspot.com", kind: "crm" },
  { id: "irctc", title: "IRCTC Login", url: "www.irctc.co.in", kind: "irctc" },
  { id: "youtube", title: "YouTube", url: "www.youtube.com", kind: "youtube" },
  { id: "github", title: "GitHub", url: "github.com/richterbrothers01", kind: "github" },
];

function TabIcon({ kind, size = 14 }) {
  if (kind === "route") return <Sparkles size={size} />;
  if (kind === "crm") return <Globe size={size} />;
  if (kind === "irctc") return <TrainFront size={size} />;
  if (kind === "youtube") return <FaYoutube size={size} />;
  if (kind === "github") return <FaGithub size={size} />;
  return <Globe size={size} />;
}

export default function App() {
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [activeTab, setActiveTab] = useState("newtab");
  const [history, setHistory] = useState(["newtab"]);
  const [histIdx, setHistIdx] = useState(0);
  const [sidebar, setSidebar] = useState("route");
  const [query, setQuery] = useState("");
  const [answerId, setAnswerId] = useState("crm");
  const [guideOn, setGuideOn] = useState(false);
  const [guideDone, setGuideDone] = useState([]);
  const [loginMsg, setLoginMsg] = useState("");
  const [captcha, setCaptcha] = useState(CAPTCHAS[0]);
  const [saved, setSaved] = useState([{ id: "crm" }]);
  const [ctaBusy, setCtaBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showTabTax, setShowTabTax] = useState(true);
  const [focusSounds, setFocusSounds] = useState(true);
  const [focusSecs, setFocusSecs] = useState(1500);
  const [focusRunning, setFocusRunning] = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);
  const toastTimer = useRef(null);

  const D = reduceMotion ? 0 : 0.3; // animation duration — snappy, never slow
  const active = tabs.find((t) => t.id === activeTab) || tabs[0];
  const answer = ANSWERS[answerId];

  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  function goTab(id) {
    setActiveTab(id);
    setSidebar("route");
    setHistory((h) => {
      const next = h.slice(0, histIdx + 1);
      next.push(id);
      return next;
    });
    setHistIdx((i) => i + 1);
  }

  function goBack() {
    if (histIdx > 0) {
      const next = histIdx - 1;
      setHistIdx(next);
      setActiveTab(history[next]);
      setSidebar("route");
    }
  }
  function goForward() {
    if (histIdx < history.length - 1) {
      const next = histIdx + 1;
      setHistIdx(next);
      setActiveTab(history[next]);
      setSidebar("route");
    }
  }

  function closeTab(id, e) {
    e.stopPropagation();
    setTabs((ts) => {
      const rest = ts.filter((t) => t.id !== id);
      if (id === activeTab && rest.length > 0) setActiveTab(rest[rest.length - 1].id);
      return rest.length > 0 ? rest : INITIAL_TABS.slice(0, 1);
    });
  }

  function newTab() {
    const id = `newtab-${Date.now()}`;
    setTabs((ts) => [...ts, { id, title: "New Route", url: "kaizen://new-route", kind: "route" }]);
    goTab(id);
  }

  function askQuestion(id) {
    setAnswerId(id);
    goTab("crm");
  }

  function submitAsk(e) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    if (q.includes("crm") || q.includes("hubspot")) askQuestion("crm");
    else if (q.includes("invoic")) askQuestion("invoice");
    else if (q.includes("register") || q.includes("startup in india") || q.includes("company")) askQuestion("startup");
    else {
      showToast("This demo answers the three suggested questions — try one of them.");
    }
    setQuery("");
  }

  function saveAnswer(id) {
    if (!saved.some((s) => s.id === id)) {
      setSaved((s) => [...s, { id }]);
      showToast("Saved to Library.");
    }
  }

  function doItNow() {
    setCtaBusy(true);
    setTimeout(() => setCtaBusy(false), 2200);
  }

  function toggleGuideStep(id) {
    setGuideDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  function handleLogin() {
    if (guideOn && guideDone.length < GUIDE_STEPS.length) {
      setLoginMsg("Finish the steps in the guide panel first — one at a time.");
      return;
    }
    setLoginMsg("Welcome back! (Demo — no real login happened.)");
  }

  // Focus timer
  useEffect(() => {
    if (!focusRunning) return;
    const iv = setInterval(() => {
      setFocusSecs((s) => {
        if (s <= 1) {
          clearInterval(iv);
          setFocusRunning(false);
          setSessionsDone((n) => n + 1);
          showToast("Focus session done. 1% better, every day.");
          return 1500;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [focusRunning]);

  const mm = String(Math.floor(focusSecs / 60)).padStart(2, "0");
  const ss = String(focusSecs % 60).padStart(2, "0");
  const crmTabTitle = useMemo(() => ANSWERS[answerId].question, [answerId]);
  const allGuideDone = guideDone.length === GUIDE_STEPS.length;

  const sidebarItems = [
    { id: "route", label: "Route", icon: <Home size={21} /> },
    { id: "tabs", label: "Tabs", icon: <LayoutGrid size={21} /> },
    { id: "focus", label: "Focus", icon: <Timer size={21} /> },
    { id: "library", label: "Library", icon: <Library size={21} /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={21} /> },
  ];

  return (
    <div className="win">
      {/* ---------- tab strip ---------- */}
      <div className="tabstrip">
        <div className="traffic"><span /><span /><span /></div>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${t.id === activeTab && sidebar === "route" ? "active" : ""}`}
            onClick={() => goTab(t.id)}
          >
            <TabIcon kind={t.kind} />
            <span>{t.id === "crm" ? crmTabTitle : t.title}</span>
            <span className="tab-x" onClick={(e) => closeTab(t.id, e)}><X size={13} /></span>
          </button>
        ))}
        <button className="tab-new" onClick={newTab} title="New tab"><Plus size={17} /></button>
      </div>

      {/* ---------- toolbar ---------- */}
      <div className="toolbar">
        <button className="navbtn" onClick={goBack} disabled={histIdx === 0}><ChevronLeft size={19} /></button>
        <button className="navbtn" onClick={goForward} disabled={histIdx >= history.length - 1}><ChevronRight size={19} /></button>
        <button className="navbtn" onClick={() => showToast("Page reloaded.")}><RotateCw size={16} /></button>
        <div className="address">
          <span className="k-badge">K</span>
          <span className="url">
            {sidebar !== "route" ? (
              <>kaizen://<b>{sidebar}</b></>
            ) : active.kind === "crm" ? (
              <><b>{ANSWER_URLS[answerId]}</b></>
            ) : (
              <><b>{active.url.replace(/^https?:\/\//, "")}</b></>
            )}
          </span>
          <Star size={15} style={{ marginLeft: "auto", flexShrink: 0 }} />
        </div>
        {sidebar === "route" && active.kind === "irctc" && (
          <button className={`guide-toggle ${guideOn ? "on" : ""}`} onClick={() => { setGuideOn(!guideOn); setLoginMsg(""); }}>
            <Compass size={16} /> {guideOn ? "Guide on" : "Guide me"}
          </button>
        )}
        <div className="profile-dot">T</div>
      </div>

      <div className="body">
        {/* ---------- sidebar ---------- */}
        <div className="sidebar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`side-item ${sidebar === item.id ? "active" : ""}`}
              onClick={() => setSidebar(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* ---------- main ---------- */}
        <div className="main">
          <div className="page">
            {sidebar === "route" && active.kind === "route" && (
              <NewTabPage
                query={query} setQuery={setQuery} submitAsk={submitAsk}
                askQuestion={askQuestion} goTab={goTab}
                showToast={showToast} D={D}
              />
            )}
            {sidebar === "route" && active.kind === "crm" && (
              <AnswerScreen
                answer={answer} D={D} ctaBusy={ctaBusy} doItNow={doItNow}
                saved={saved} saveAnswer={saveAnswer}
              />
            )}
            {sidebar === "route" && active.kind === "irctc" && (
              <div className="irctc-flex">
                <IrctcPage
                  guideOn={guideOn} allGuideDone={allGuideDone}
                  loginMsg={loginMsg} handleLogin={handleLogin}
                  captcha={captcha} refreshCaptcha={() => setCaptcha(CAPTCHAS[Math.floor(Math.random() * CAPTCHAS.length)])}
                  showToast={showToast}
                />
                <AnimatePresence>
                  {guideOn && (
                    <motion.aside
                      className="guide-panel"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      transition={{ duration: D, ease: "easeOut" }}
                    >
                      <GuidePanel
                        guideDone={guideDone} toggleGuideStep={toggleGuideStep}
                        allGuideDone={allGuideDone}
                      />
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>
            )}
            {sidebar === "route" && active.kind === "youtube" && (
              <YoutubePage showToast={showToast} />
            )}
            {sidebar === "route" && active.kind === "github" && (
              <GithubPage showToast={showToast} />
            )}
            {sidebar === "tabs" && (
              <TabsView tabs={tabs} activeTab={activeTab} goTab={goTab} closeTab={closeTab} newTab={newTab} crmTabTitle={crmTabTitle} />
            )}
            {sidebar === "focus" && (
              <FocusView mm={mm} ss={ss} running={focusRunning} setRunning={setFocusRunning}
                reset={() => { setFocusRunning(false); setFocusSecs(1500); }}
                sessionsDone={sessionsDone} sounds={focusSounds} setSounds={setFocusSounds} />
            )}
            {sidebar === "library" && (
              <LibraryView saved={saved} setSaved={setSaved} openAnswer={askQuestion} />
            )}
            {sidebar === "settings" && (
              <SettingsView
                reduceMotion={reduceMotion} setReduceMotion={setReduceMotion}
                showTabTax={showTabTax} setShowTabTax={setShowTabTax}
                focusSounds={focusSounds} setFocusSounds={setFocusSounds}
              />
            )}
          </div>

          {/* ---------- bottom bar ---------- */}
          <div className="bottombar">
            {showTabTax && (
              <div>
                <div className="bb-label">TAB TAX</div>
                <div className="bb-value">27 tabs to 1 route</div>
                <div className="bb-meter"><i style={{ width: "60%" }} /></div>
              </div>
            )}
            <button className="bb-focus" onClick={() => setSidebar("focus")}>
              <div className="bb-label">FOCUS</div>
              <div className="bb-value">{mm}:{ss} · Lo-fi beats</div>
            </button>
            <div className="bb-right">1% better, every day.</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: D }}
          >
            <Zap size={15} color="#f2b33d" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= NEW TAB PAGE ================= */
function NewTabPage({ query, setQuery, submitAsk, askQuestion, goTab, showToast, D }) {
  const shortcuts = [
    { label: "YouTube", icon: <FaYoutube size={17} color="#ff4e45" />, tab: "youtube" },
    { label: "GitHub", icon: <FaGithub size={17} />, tab: "github" },
    { label: "IRCTC", icon: <TrainFront size={17} />, tab: "irctc" },
    { label: "HubSpot", icon: <Globe size={17} />, tab: "crm" },
    { label: "Gmail", icon: <SiGmail size={16} color="#ea4335" />, tab: null },
    { label: "X", icon: <FaXTwitter size={16} />, tab: null },
    { label: "Notion", icon: <SiNotion size={16} />, tab: null },
    { label: "Linear", icon: <SiLinear size={16} />, tab: null },
  ];
  return (
    <motion.div
      className="newtab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: D, ease: "easeOut" }}
    >
      <img src="https://kaizenbrowser.vercel.app/logo.webp" alt="Kaizen logo" className="newtab-logo" />
      <div className="wordmark">KAIZEN</div>
      <div className="wordmark-sub">THE BROWSER FOR ENTREPRENEURS</div>
      <form className="askbar" onSubmit={submitAsk}>
        <span className="k-badge">K</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask KaizenAI: what do you want to achieve?"
        />
        <button type="submit">Ask</button>
      </form>
      <div className="suggest">
        <div className="suggest-label">TRY ONE</div>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button key={q.id} className="chip" onClick={() => askQuestion(q.id)}>
            <Search size={13} /> {q.label}
          </button>
        ))}
      </div>
      <div className="shortcuts">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            className="shortcut"
            onClick={() => (s.tab ? goTab(s.tab) : showToast(`${s.label} isn't part of this demo.`))}
          >
            <span className="s-ic">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div className="newtab-foot">1% better, every day.</div>
    </motion.div>
  );
}

/* ================= ANSWER SCREEN ================= */
function AnswerScreen({ answer, D, ctaBusy, doItNow, saved, saveAnswer }) {
  const isSaved = saved.some((s) => s.id === answer.id);
  const sections = [
    <div key="ans" className="ka-section" style={{ marginTop: 0 }}>
      <h3>THE ANSWER</h3>
      <p className="ka-answer"><b>{answer.answerBold}</b> {answer.answerText}</p>
    </div>,
    <div key="pc" className="ka-section">
      <h3>PROS AND CONS</h3>
      <div className="proscons">
        <div>
          <h4 className="pro">PROS</h4>
          <ul>{answer.pros.map((p) => <li key={p}>+&nbsp;&nbsp;{p}</li>)}</ul>
        </div>
        <div>
          <h4 className="con">CONS</h4>
          <ul>{answer.cons.map((c) => <li key={c} className="con-item">−&nbsp;&nbsp;{c}</li>)}</ul>
        </div>
      </div>
    </div>,
    <div key="click" className="ka-section">
      <h3>WHAT TO CLICK</h3>
      <ol className="ka-steps">
        {answer.steps.map((s, i) => (
          <li key={s}><span className="n">{i + 1}</span><span>{s}</span></li>
        ))}
      </ol>
    </div>,
    <div key="next" className="ka-section">
      <h3>NEXT STEP</h3>
      <p className="ka-next">{answer.next}</p>
      <p className="ka-next-sub">{answer.nextSub}</p>
      <button className="gold-btn" onClick={doItNow} disabled={ctaBusy}>
        {ctaBusy ? answer.ctaBusy : answer.cta}
      </button>
      <br />
      <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={() => saveAnswer(answer.id)}>
        <Bookmark size={14} /> {isSaved ? "Saved in Library" : "Save to Library"}
      </button>
    </div>,
  ];
  return (
    <div className="answer-layout">
      <motion.div
        className="article"
        key={`article-${answer.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: D }}
      >
        {answer.demo && <span className="demo-tag">DEMO ANSWER</span>}
        <h1>{answer.question}</h1>
        <div className="meta">{answer.articleSource}</div>
        <div className="hero">{answer.heroWord}</div>
        <div className="skel" style={{ width: "96%" }} />
        <div className="skel alt" style={{ width: "100%" }} />
        <div className="skel" style={{ width: "92%" }} />
        <div className="skel alt" style={{ width: "70%" }} />
        <p>{answer.articleLead}</p>
        <div className="skel" style={{ width: "98%" }} />
        <div className="skel alt" style={{ width: "88%" }} />
        <div className="skel" style={{ width: "60%" }} />
      </motion.div>
      <motion.div
        className="kaizenai"
        key={`panel-${answer.id}`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: D, ease: "easeOut" }}
      >
        <div className="kaizenai-head">
          <span className="k-badge">K</span>
          <div>
            <div className="k-title">KAIZENAI</div>
            <div className="k-sub">reading this page</div>
          </div>
        </div>
        {sections.map((sec, i) => (
          <motion.div
            key={sec.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: D, delay: 0.08 + i * 0.07, ease: "easeOut" }}
          >
            {sec}
          </motion.div>
        ))}
        <div className="ka-sources">Sources: {answer.sources}</div>
      </motion.div>
    </div>
  );
}

/* ================= IRCTC + GUIDE ================= */
function IrctcPage({ guideOn, allGuideDone, loginMsg, handleLogin, captcha, refreshCaptcha, showToast }) {
  return (
    <div className="irctc-wrap">
      <AnimatePresence>
        {guideOn && (
          <motion.div
            className="irctc-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
      <div className="irctc-top">
        <span className="logo"><TrainFront size={20} /> IRCTC</span>
        <nav>
          <span>Trains</span><span>Flights</span><span>Hotels</span><span>Holidays</span><span>Loyalty</span><span>Meals</span>
        </nav>
      </div>
      <div className="irctc-hero">
        <h2>Book your train ticket</h2>
        <p>Search trains, check seats, and book in minutes — all in one place.</p>
      </div>
      <div className="irctc-search">
        <div className="field"><label>FROM</label><div className="fake-input">New Delhi (NDLS)</div></div>
        <div className="field"><label>TO</label><div className="fake-input">Mumbai Central (MMCT)</div></div>
        <div className="field"><label>DATE</label><div className="fake-input">23 Nov 2026</div></div>
        <button className="search-btn" onClick={() => showToast("Log in first — the guide shows you how.")}>Search</button>
      </div>
      <div className="irctc-cols">
        <motion.div
          className={`login-card ${guideOn ? "guide-focus" : ""}`}
          animate={guideOn ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <h3>LOGIN</h3>
          <div className="lc-sub">Log in to book tickets and see your journeys.</div>
          <label>USERNAME</label>
          <div className="lc-input"><span>your username</span></div>
          <label>PASSWORD</label>
          <div className="lc-input"><span>••••••••</span></div>
          <label>CAPTCHA</label>
          <div className="captcha-box">
            <span>{captcha}</span>
            <button onClick={refreshCaptcha} title="New captcha" style={{ marginLeft: "auto", display: "flex", color: "#123a6d" }}>
              <RefreshCw size={16} />
            </button>
          </div>
          <button className={`login-btn ${allGuideDone && guideOn ? "armed" : ""}`} onClick={handleLogin}>
            {allGuideDone && guideOn ? "Login — ready ✓" : "Login"}
          </button>
          <div className="login-links">
            <span onClick={() => showToast("The guide says: not yet — finish logging in first.")}>Forgot Password?</span>
            <span onClick={() => showToast("The guide says: you already have an account.")}>Register</span>
          </div>
          {loginMsg && <div className="login-ok">{loginMsg}</div>}
        </motion.div>
        <div className="irctc-side">
          <div className="promo">
            <h4>⚡ Tatkal opens at 10 AM</h4>
            <p>Premium Tatkal tickets go live one day before the journey. Set an alarm — they sell out in minutes.</p>
            <div className="promo-cta" onClick={() => showToast("Promo links are not part of the login task.")}>Learn more →</div>
          </div>
          <div className="promo">
            <h4>🎉 Festival special trains</h4>
            <p>Extra trains added for the winter rush. Check the full list before you plan your trip home.</p>
            <div className="promo-cta" onClick={() => showToast("Promo links are not part of the login task.")}>See trains →</div>
          </div>
          <div className="promo">
            <h4>🍱 Meals on wheels</h4>
            <p>Order food from your seat. Pick a restaurant at your next station and it arrives at your berth.</p>
            <div className="promo-cta" onClick={() => showToast("Promo links are not part of the login task.")}>Order food →</div>
          </div>
        </div>
      </div>
      <div className="irctc-foot">
        <span>About us</span><span>Contact</span><span>Refund rules</span><span>Privacy policy</span><span>© 2026 IRCTC (demo page)</span>
      </div>
    </div>
  );
}

function GuidePanel({ guideDone, toggleGuideStep, allGuideDone }) {
  return (
    <>
      <h2><Compass size={19} color="#f2b33d" /> Your guide</h2>
      <p className="gp-sub">Goal: log in to IRCTC. Everything else on the page is greyed out — only the login card matters right now.</p>
      <div className="gp-progress">{guideDone.length} OF {GUIDE_STEPS.length} STEPS DONE</div>

      <div className="gp-section">
        <h3><Check size={14} className="go" /> WHAT TO CLICK NEXT</h3>
        {GUIDE_STEPS.map((s) => (
          <button
            key={s.id}
            className={`gp-step ${guideDone.includes(s.id) ? "done" : ""}`}
            onClick={() => toggleGuideStep(s.id)}
          >
            <span className="tick">{guideDone.includes(s.id) && <Check size={13} />}</span>
            <span className="gp-text"><b>{s.text}.</b> {s.detail}</span>
          </button>
        ))}
      </div>

      <div className="gp-section">
        <h3><Ban size={14} className="no" /> WHAT NOT TO CLICK</h3>
        {GUIDE_DONT.map((d) => (
          <div key={d.id} className="gp-step" style={{ cursor: "default" }}>
            <span className="cross"><X size={12} /></span>
            <span className="gp-text">{d.text}</span>
          </div>
        ))}
      </div>

      <div className="gp-section">
        <h3><MousePointerClick size={14} /> WHAT HAPPENS AFTER</h3>
        <div className="gp-note">
          <b>After Login →</b> your IRCTC dashboard opens with your booked tickets and upcoming journeys.
          <br /><br />
          <b>Wrong captcha →</b> the page reloads and the form clears. You will have to type it all again.
        </div>
      </div>

      <div className="gp-section">
        <h3><ArrowRightIcon /> NEXT STEPS</h3>
        <div className="gp-note">
          After logging in: search trains, pick your train, pay, and your ticket lands in <b>Booked Tickets</b>.
          {allGuideDone && (
            <><br /><br /><span style={{ color: "#3dff88", fontWeight: 700 }}>All steps done — hit the gold Login button.</span></>
          )}
        </div>
      </div>
    </>
  );
}

function ArrowRightIcon() {
  return <CircleCheck size={14} />;
}

/* ================= MOCK PAGES ================= */
function YoutubePage({ showToast }) {
  return (
    <div className="mockpage">
      <h1><FaYoutube size={26} color="#ff4e45" /> YouTube</h1>
      <div className="mp-sub">Subscriptions · Kaizen channel — demo feed, videos don't play in this prototype.</div>
      <div className="vid-grid">
        {YOUTUBE_VIDEOS.map((v) => (
          <div key={v.id} className="vid-card" onClick={() => showToast("Video playback isn't part of this demo.")}>
            <div className="vid-thumb" style={{ background: v.grad }}>
              <Play size={30} color="#fff" />
              <span className="dur">{v.dur}</span>
            </div>
            <div className="vid-body">
              <h4>{v.title}</h4>
              <p>{v.channel} · {v.views}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GithubPage({ showToast }) {
  return (
    <div className="mockpage">
      <h1><FaGithub size={24} /> richterbrothers01</h1>
      <div className="mp-sub">4 public repositories — demo list, repos don't open in this prototype.</div>
      {GITHUB_REPOS.map((r) => (
        <div key={r.name} className="repo-row" onClick={() => showToast("Opening repos isn't part of this demo.")}>
          <div>
            <h4>{r.name}</h4>
            <p>{r.desc}</p>
          </div>
          <div className="repo-meta">
            <span><span className="lang-dot" style={{ background: r.color }} />{r.lang}</span>
            <span>★ {r.stars}</span>
            <span>{r.updated}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= SIDE VIEWS ================= */
function TabsView({ tabs, activeTab, goTab, closeTab, newTab, crmTabTitle }) {
  return (
    <div className="sideview">
      <h1>Tabs</h1>
      <div className="sv-sub">{tabs.length} open · Kaizen closed 26 more for you today.</div>
      {tabs.map((t) => (
        <div key={t.id} className="tab-row" onClick={() => goTab(t.id)}>
          <TabIcon kind={t.kind} size={17} />
          <div>
            <div className="t-title">{t.id === "crm" ? crmTabTitle : t.title}{t.id === activeTab ? "  ·  active" : ""}</div>
            <div className="t-url">{t.url}</div>
          </div>
          <button className="t-x" onClick={(e) => closeTab(t.id, e)}><X size={15} /></button>
        </div>
      ))}
      <button className="gold-btn" onClick={newTab}><Plus size={15} style={{ verticalAlign: "-2px" }} /> New tab</button>
    </div>
  );
}

function FocusView({ mm, ss, running, setRunning, reset, sessionsDone, sounds, setSounds }) {
  return (
    <div className="sideview">
      <h1>Focus</h1>
      <div className="sv-sub">One timer, one task, no tabs. Distractions off, work on.</div>
      <div className="focus-wrap">
        <div className="focus-time">{mm}:{ss}</div>
        <div className="focus-label">{running ? "Focusing — stay on the route." : "Paused. Ready when you are."}</div>
        <div className="focus-btns">
          <button className="gold-btn" style={{ marginTop: 0 }} onClick={() => setRunning(!running)}>
            {running ? <><Pause size={15} style={{ verticalAlign: "-2px" }} /> Pause</> : <><Play size={15} style={{ verticalAlign: "-2px" }} /> Start focus</>}
          </button>
          <button className="save-btn" style={{ marginTop: 0 }} onClick={reset}>Reset</button>
        </div>
        <div className="focus-dots">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={i < sessionsDone ? "done" : ""} />
          ))}
        </div>
        <div className="focus-label">{sessionsDone} session{sessionsDone === 1 ? "" : "s"} done today</div>
        <div style={{ marginTop: 26, width: "100%", maxWidth: 420 }}>
          <div className="set-row" style={{ maxWidth: "none" }}>
            <div><div className="s-title">Lo-fi beats</div><div className="s-desc">Quiet music while you focus.</div></div>
            <button className={`toggle ${sounds ? "on" : ""}`} onClick={() => setSounds(!sounds)} aria-label="Toggle lo-fi beats" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryView({ saved, setSaved, openAnswer }) {
  return (
    <div className="sideview">
      <h1>Library</h1>
      <div className="sv-sub">Answers KaizenAI saved for you. Click one to open it again.</div>
      {saved.length === 0 && <p style={{ color: "var(--dim)" }}>Nothing saved yet. Open an answer and hit “Save to Library”.</p>}
      {saved.map((s) => {
        const a = ANSWERS[s.id];
        return (
          <div key={s.id} className="lib-item" onClick={() => openAnswer(s.id)}>
            <div className="lib-tag">KAIZENAI ANSWER</div>
            <h4 style={{ marginTop: 6 }}>{a.question}</h4>
            <p><b>{a.answerBold}</b> {a.answerText}</p>
            <button
              className="save-btn"
              onClick={(e) => { e.stopPropagation(); setSaved(saved.filter((x) => x.id !== s.id)); }}
            >
              <X size={13} /> Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SettingsView({ reduceMotion, setReduceMotion, showTabTax, setShowTabTax, focusSounds, setFocusSounds }) {
  const rows = [
    { title: "Reduce motion", desc: "Turns off slide and fade animations.", value: reduceMotion, set: setReduceMotion },
    { title: "Show tab tax meter", desc: "The 27-tabs-to-1-route strip in the bottom bar.", value: showTabTax, set: setShowTabTax },
    { title: "Focus sounds", desc: "Lo-fi beats during focus sessions.", value: focusSounds, set: setFocusSounds },
  ];
  return (
    <div className="sideview">
      <h1>Settings</h1>
      <div className="sv-sub">Kaizen stays minimal on purpose. A few switches, nothing more.</div>
      {rows.map((r) => (
        <div key={r.title} className="set-row">
          <div><div className="s-title">{r.title}</div><div className="s-desc">{r.desc}</div></div>
          <button className={`toggle ${r.value ? "on" : ""}`} onClick={() => r.set(!r.value)} aria-label={r.title} />
        </div>
      ))}
      <div className="set-row">
        <ShieldCheck size={20} color="#f2b33d" />
        <div>
          <div className="s-title">Kaizen Mark One — interactive demo</div>
          <div className="s-desc">React + Vite + motion. A clickable prototype of the browser UI — not a real browser yet.</div>
        </div>
      </div>
    </div>
  );
}
