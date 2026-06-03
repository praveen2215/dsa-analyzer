import React, { useState, useEffect, useMemo } from "react"

const DAILY_PROBLEMS = [
  { id:1,   title:"Two Sum",                              slug:"two-sum",                              diff:"Easy",   topics:["Array","Hash Table"] },
  { id:2,   title:"Add Two Numbers",                      slug:"add-two-numbers",                      diff:"Medium", topics:["Linked List","Math"] },
  { id:3,   title:"Longest Substring Without Repeating",  slug:"longest-substring-without-repeating-characters", diff:"Medium", topics:["Sliding Window","String"] },
  { id:4,   title:"Median of Two Sorted Arrays",          slug:"median-of-two-sorted-arrays",          diff:"Hard",   topics:["Binary Search","Array"] },
  { id:5,   title:"Longest Palindromic Substring",        slug:"longest-palindromic-substring",        diff:"Medium", topics:["DP","String"] },
  { id:20,  title:"Valid Parentheses",                    slug:"valid-parentheses",                    diff:"Easy",   topics:["Stack","String"] },
  { id:21,  title:"Merge Two Sorted Lists",               slug:"merge-two-sorted-lists",               diff:"Easy",   topics:["Linked List"] },
  { id:42,  title:"Trapping Rain Water",                  slug:"trapping-rain-water",                  diff:"Hard",   topics:["Two Pointers","Stack"] },
  { id:53,  title:"Maximum Subarray",                     slug:"maximum-subarray",                     diff:"Medium", topics:["Array","DP"] },
  { id:70,  title:"Climbing Stairs",                      slug:"climbing-stairs",                      diff:"Easy",   topics:["DP","Math"] },
  { id:72,  title:"Edit Distance",                        slug:"edit-distance",                        diff:"Hard",   topics:["DP","String"] },
  { id:76,  title:"Minimum Window Substring",             slug:"minimum-window-substring",             diff:"Hard",   topics:["Sliding Window","Hash Table"] },
  { id:98,  title:"Validate Binary Search Tree",          slug:"validate-binary-search-tree",          diff:"Medium", topics:["Tree","DFS"] },
  { id:102, title:"Binary Tree Level Order Traversal",    slug:"binary-tree-level-order-traversal",    diff:"Medium", topics:["Tree","BFS"] },
  { id:121, title:"Best Time to Buy and Sell Stock",      slug:"best-time-to-buy-and-sell-stock",      diff:"Easy",   topics:["Array","DP"] },
  { id:124, title:"Binary Tree Maximum Path Sum",         slug:"binary-tree-maximum-path-sum",         diff:"Hard",   topics:["Tree","DFS"] },
  { id:128, title:"Longest Consecutive Sequence",         slug:"longest-consecutive-sequence",         diff:"Medium", topics:["Array","Hash Table"] },
  { id:139, title:"Word Break",                           slug:"word-break",                           diff:"Medium", topics:["DP","Trie"] },
  { id:141, title:"Linked List Cycle",                    slug:"linked-list-cycle",                    diff:"Easy",   topics:["Linked List","Two Pointers"] },
  { id:146, title:"LRU Cache",                            slug:"lru-cache",                            diff:"Medium", topics:["Hash Table","Linked List"] },
  { id:152, title:"Maximum Product Subarray",             slug:"maximum-product-subarray",             diff:"Medium", topics:["Array","DP"] },
  { id:153, title:"Find Minimum in Rotated Sorted Array", slug:"find-minimum-in-rotated-sorted-array", diff:"Medium", topics:["Binary Search"] },
  { id:200, title:"Number of Islands",                    slug:"number-of-islands",                    diff:"Medium", topics:["DFS","BFS","Matrix"] },
  { id:206, title:"Reverse Linked List",                  slug:"reverse-linked-list",                  diff:"Easy",   topics:["Linked List"] },
  { id:207, title:"Course Schedule",                      slug:"course-schedule",                      diff:"Medium", topics:["Graph","Topological Sort"] },
  { id:208, title:"Implement Trie",                       slug:"implement-trie-prefix-tree",           diff:"Medium", topics:["Trie","Design"] },
  { id:212, title:"Word Search II",                       slug:"word-search-ii",                       diff:"Hard",   topics:["Trie","Backtracking"] },
  { id:215, title:"Kth Largest Element in Array",         slug:"kth-largest-element-in-an-array",      diff:"Medium", topics:["Heap","Sorting"] },
  { id:217, title:"Contains Duplicate",                   slug:"contains-duplicate",                   diff:"Easy",   topics:["Array","Hash Table"] },
  { id:226, title:"Invert Binary Tree",                   slug:"invert-binary-tree",                   diff:"Easy",   topics:["Tree","DFS"] },
  { id:230, title:"Kth Smallest Element in BST",          slug:"kth-smallest-element-in-a-bst",        diff:"Medium", topics:["Tree","DFS"] },
  { id:238, title:"Product of Array Except Self",         slug:"product-of-array-except-self",         diff:"Medium", topics:["Array","Prefix Sum"] },
  { id:239, title:"Sliding Window Maximum",               slug:"sliding-window-maximum",               diff:"Hard",   topics:["Sliding Window","Heap"] },
  { id:242, title:"Valid Anagram",                        slug:"valid-anagram",                        diff:"Easy",   topics:["Hash Table","String"] },
  { id:295, title:"Find Median from Data Stream",         slug:"find-median-from-data-stream",         diff:"Hard",   topics:["Heap","Design"] },
  { id:297, title:"Serialize and Deserialize Binary Tree",slug:"serialize-and-deserialize-binary-tree",diff:"Hard",   topics:["Tree","BFS"] },
  { id:300, title:"Longest Increasing Subsequence",       slug:"longest-increasing-subsequence",       diff:"Medium", topics:["DP","Binary Search"] },
  { id:322, title:"Coin Change",                          slug:"coin-change",                          diff:"Medium", topics:["DP","BFS"] },
  { id:347, title:"Top K Frequent Elements",              slug:"top-k-frequent-elements",              diff:"Medium", topics:["Heap","Hash Table"] },
  { id:371, title:"Sum of Two Integers",                  slug:"sum-of-two-integers",                  diff:"Medium", topics:["Bit Manipulation"] },
  { id:416, title:"Partition Equal Subset Sum",           slug:"partition-equal-subset-sum",           diff:"Medium", topics:["DP","Array"] },
  { id:424, title:"Longest Repeating Character Replacement", slug:"longest-repeating-character-replacement", diff:"Medium", topics:["Sliding Window"] },
  { id:435, title:"Non-overlapping Intervals",            slug:"non-overlapping-intervals",            diff:"Medium", topics:["Greedy","Sorting"] },
  { id:543, title:"Diameter of Binary Tree",              slug:"diameter-of-binary-tree",              diff:"Easy",   topics:["Tree","DFS"] },
  { id:560, title:"Subarray Sum Equals K",                slug:"subarray-sum-equals-k",                diff:"Medium", topics:["Array","Hash Table"] },
  { id:572, title:"Subtree of Another Tree",              slug:"subtree-of-another-tree",              diff:"Easy",   topics:["Tree","DFS"] },
  { id:621, title:"Task Scheduler",                       slug:"task-scheduler",                       diff:"Medium", topics:["Heap","Greedy"] },
  { id:647, title:"Palindromic Substrings",               slug:"palindromic-substrings",               diff:"Medium", topics:["DP","String"] },
  { id:684, title:"Redundant Connection",                 slug:"redundant-connection",                 diff:"Medium", topics:["Union Find","Graph"] },
  { id:739, title:"Daily Temperatures",                   slug:"daily-temperatures",                   diff:"Medium", topics:["Stack","Monotonic Stack"] },
  { id:875, title:"Koko Eating Bananas",                  slug:"koko-eating-bananas",                  diff:"Medium", topics:["Binary Search"] },
]

const DIFF_STYLE = {
  Easy:   { bg:"rgba(59,109,17,0.12)",  color:"#3B6D11", border:"rgba(59,109,17,0.3)"  },
  Medium: { bg:"rgba(186,117,23,0.12)", color:"#BA7517", border:"rgba(186,117,23,0.3)" },
  Hard:   { bg:"rgba(163,45,45,0.12)",  color:"#A32D2D", border:"rgba(163,45,45,0.3)"  },
}

function getTodayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
}

function getDailyProblem() {
  const now       = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  return DAILY_PROBLEMS[dayOfYear % DAILY_PROBLEMS.length]
}

function getStreakKey(username) { return `daily_streak_${username}` }
function getHistoryKey(username){ return `daily_history_${username}` }

function loadStreak(username) {
  try { return JSON.parse(localStorage.getItem(getStreakKey(username)) || "{}") }
  catch { return {} }
}
function loadHistory(username) {
  try { return JSON.parse(localStorage.getItem(getHistoryKey(username)) || "[]") }
  catch { return [] }
}

function computeCurrentStreak(history) {
  if (!history.length) return 0
  const sorted = [...history].sort((a,b) => new Date(b.date) - new Date(a.date))
  let streak = 0
  let expected = new Date()
  expected.setHours(0,0,0,0)
  for (const entry of sorted) {
    const d = new Date(entry.date)
    d.setHours(0,0,0,0)
    if (d.getTime() === expected.getTime()) {
      streak++
      expected.setDate(expected.getDate() - 1)
    } else break
  }
  return streak
}

export default function DailyChallenge({ data }) {
  const username   = data.username
  const todayKey   = getTodayKey()
  const problem    = useMemo(() => getDailyProblem(), [])
  const ds         = DIFF_STYLE[problem.diff] || DIFF_STYLE.Medium

  const [history,  setHistory]  = useState(() => loadHistory(username))
  const [marked,   setMarked]   = useState(() => history.some(h => h.date === todayKey))
  const [animate,  setAnimate]  = useState(false)

  const streak       = useMemo(() => computeCurrentStreak(history), [history])
  const totalSolved  = history.length
  const easyCount    = history.filter(h => h.diff === "Easy").length
  const mediumCount  = history.filter(h => h.diff === "Medium").length
  const hardCount    = history.filter(h => h.diff === "Hard").length

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(getHistoryKey(username), JSON.stringify(history))
  }, [history, username])

  const markDone = () => {
    if (marked) return
    const entry = { date: todayKey, problemId: problem.id, title: problem.title, diff: problem.diff }
    setHistory(h => [entry, ...h])
    setMarked(true)
    setAnimate(true)
    setTimeout(() => setAnimate(false), 1000)
  }

  const unmark = () => {
    setHistory(h => h.filter(x => x.date !== todayKey))
    setMarked(false)
  }

  // Time remaining until next problem
  const timeLeft = useMemo(() => {
    const now       = new Date()
    const midnight  = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diff      = midnight - now
    const h         = Math.floor(diff / 3600000)
    const m         = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }, [])

  // Last 7 days for mini calendar
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      const key  = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
      const done = history.some(h => h.date === key)
      const isToday = key === todayKey
      return { key, day: d.toLocaleDateString("en-US", { weekday:"short" }), done, isToday }
    })
  }, [history, todayKey])

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>Daily challenge tracker</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>
            A new problem every day · next challenge in <span style={{ color:"var(--accent)", fontFamily:"var(--font-mono)" }}>{timeLeft}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"var(--font-mono)", color:"#f6ad55", lineHeight:1 }}>🔥 {streak}</div>
            <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.4px" }}>day streak</div>
          </div>
        </div>
      </div>

      {/* Today problem card */}
      <div style={{ padding:"18px 20px", background:"var(--surface2)", borderRadius:12, border:"0.5px solid "+(marked ? "rgba(59,109,17,0.4)" : ds.border), marginBottom:16, transition:"border-color 0.3s", position:"relative", overflow:"hidden" }}>
        {marked && (
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"#3B6D11", borderRadius:"2px 2px 0 0" }} />
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ background:"rgba(99,179,237,0.1)", color:"var(--accent)", padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:600 }}>TODAY</span>
              <span>Problem of the day</span>
            </div>
            <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:8 }}>
              #{problem.id} {problem.title}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20, background:ds.bg, color:ds.color, border:"0.5px solid "+ds.border }}>
                {problem.diff}
              </span>
              {problem.topics.map(t => (
                <span key={t} style={{ fontSize:10, padding:"3px 9px", borderRadius:20, background:"var(--surface3)", color:"var(--text3)", border:"0.5px solid var(--border)" }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
            <a href={"https://leetcode.com/problems/"+problem.slug} target="_blank" rel="noreferrer"
              style={{ padding:"8px 16px", borderRadius:8, background:"#185FA5", color:"#fff", textDecoration:"none", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6, transition:"all 0.15s", whiteSpace:"nowrap" }}
              onMouseEnter={e => e.currentTarget.style.background="#1a6fc4"}
              onMouseLeave={e => e.currentTarget.style.background="#185FA5"}>
              <i className="fa-brands fa-leetcode" /> Solve it
            </a>
            {!marked ? (
              <button onClick={markDone}
                style={{ padding:"8px 16px", borderRadius:8, background:"rgba(59,109,17,0.15)", border:"0.5px solid rgba(59,109,17,0.4)", color:"#3B6D11", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-main)", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", transition:"all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(59,109,17,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(59,109,17,0.15)"}>
                <i className="fa-solid fa-check" /> Mark done
              </button>
            ) : (
              <button onClick={unmark}
                style={{ padding:"8px 16px", borderRadius:8, background:"rgba(59,109,17,0.2)", border:"0.5px solid #3B6D11", color:"#3B6D11", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-main)", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                <i className="fa-solid fa-circle-check" /> Completed! {animate && "🎉"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Last 7 days mini calendar */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Last 7 days</div>
        <div style={{ display:"flex", gap:6 }}>
          {last7.map(({ key, day, done, isToday }) => (
            <div key={key} style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:10, color: isToday ? "var(--accent)" : "var(--text3)", marginBottom:5, fontWeight: isToday ? 600 : 400 }}>{day}</div>
              <div style={{
                height:32, borderRadius:7,
                background: done ? "#3B6D11" : isToday ? "rgba(99,179,237,0.1)" : "var(--surface2)",
                border: isToday ? "0.5px solid rgba(99,179,237,0.4)" : done ? "0.5px solid rgba(59,109,17,0.5)" : "0.5px solid var(--border)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, transition:"all 0.2s"
              }}>
                {done ? "✓" : isToday ? "·" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          { label:"Total done",    val:totalSolved,  color:"#185FA5" },
          { label:"Easy done",     val:easyCount,    color:"#3B6D11" },
          { label:"Medium done",   val:mediumCount,  color:"#BA7517" },
          { label:"Hard done",     val:hardCount,    color:"#A32D2D" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 12px", textAlign:"center", border:"0.5px solid var(--border)" }}>
            <div style={{ fontSize:20, fontWeight:600, fontFamily:"var(--font-mono)", color }}>{val}</div>
            <div style={{ fontSize:10, color:"var(--text3)", marginTop:3, textTransform:"uppercase", letterSpacing:"0.3px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Recent completions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:180, overflowY:"auto" }}>
            {history.slice(0,7).map((h, i) => {
              const hds = DIFF_STYLE[h.diff] || DIFF_STYLE.Medium
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                  <i className="fa-solid fa-circle-check" style={{ color:"#3B6D11", fontSize:13, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{h.title}</span>
                  <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:hds.bg, color:hds.color, fontWeight:600 }}>{h.diff}</span>
                  <span style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", flexShrink:0 }}>{h.date}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Streak motivation */}
      {streak >= 7 && (
        <div style={{ marginTop:14, padding:"10px 16px", background:"rgba(246,173,85,0.1)", border:"0.5px solid rgba(246,173,85,0.3)", borderRadius:8, fontSize:12, color:"#f6ad55", textAlign:"center", fontWeight:600 }}>
          🔥 {streak} day streak! You are on fire — keep going!
        </div>
      )}
      {!marked && (
        <div style={{ marginTop:14, padding:"10px 16px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:8, fontSize:12, color:"var(--text2)", textAlign:"center" }}>
          💡 Solve today&apos;s problem and click <strong>Mark done</strong> to keep your streak alive!
        </div>
      )}
    </div>
  )
}