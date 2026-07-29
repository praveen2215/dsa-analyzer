import React, { useState, useMemo } from "react"

const KNOWN_TOTALS = {"array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,"depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,"graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,"stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,"linked-list":175,"trie":90}

const PROBLEMS = {
  "dynamic-programming":[
    {title:"Climbing Stairs",                   slug:"climbing-stairs",                          diff:"Easy"  },
    {title:"House Robber",                       slug:"house-robber",                             diff:"Medium"},
    {title:"Coin Change",                        slug:"coin-change",                              diff:"Medium"},
    {title:"Longest Increasing Subsequence",     slug:"longest-increasing-subsequence",           diff:"Medium"},
    {title:"Word Break",                         slug:"word-break",                               diff:"Medium"},
    {title:"Unique Paths",                       slug:"unique-paths",                             diff:"Medium"},
    {title:"Edit Distance",                      slug:"edit-distance",                            diff:"Hard"  },
    {title:"Burst Balloons",                     slug:"burst-balloons",                           diff:"Hard"  },
  ],
  "graph":[
    {title:"Number of Islands",                  slug:"number-of-islands",                        diff:"Medium"},
    {title:"Clone Graph",                        slug:"clone-graph",                              diff:"Medium"},
    {title:"Course Schedule",                    slug:"course-schedule",                          diff:"Medium"},
    {title:"Pacific Atlantic Water Flow",        slug:"pacific-atlantic-water-flow",              diff:"Medium"},
    {title:"Word Ladder",                        slug:"word-ladder",                              diff:"Hard"  },
    {title:"Alien Dictionary",                   slug:"alien-dictionary",                         diff:"Hard"  },
  ],
  "tree":[
    {title:"Maximum Depth of Binary Tree",       slug:"maximum-depth-of-binary-tree",             diff:"Easy"  },
    {title:"Invert Binary Tree",                 slug:"invert-binary-tree",                       diff:"Easy"  },
    {title:"Validate Binary Search Tree",        slug:"validate-binary-search-tree",              diff:"Medium"},
    {title:"LCA of Binary Tree",                 slug:"lowest-common-ancestor-of-a-binary-tree",  diff:"Medium"},
    {title:"Binary Tree Max Path Sum",           slug:"binary-tree-maximum-path-sum",             diff:"Hard"  },
    {title:"Serialize and Deserialize Tree",     slug:"serialize-and-deserialize-binary-tree",    diff:"Hard"  },
  ],
  "binary-search":[
    {title:"Binary Search",                      slug:"binary-search",                            diff:"Easy"  },
    {title:"Search in Rotated Array",            slug:"search-in-rotated-sorted-array",           diff:"Medium"},
    {title:"Find Minimum in Rotated Array",      slug:"find-minimum-in-rotated-sorted-array",     diff:"Medium"},
    {title:"Koko Eating Bananas",                slug:"koko-eating-bananas",                      diff:"Medium"},
    {title:"Median of Two Sorted Arrays",        slug:"median-of-two-sorted-arrays",              diff:"Hard"  },
  ],
  "heap-priority-queue":[
    {title:"Kth Largest Element",                slug:"kth-largest-element-in-an-array",          diff:"Medium"},
    {title:"Top K Frequent Elements",            slug:"top-k-frequent-elements",                  diff:"Medium"},
    {title:"Task Scheduler",                     slug:"task-scheduler",                           diff:"Medium"},
    {title:"Find Median from Data Stream",       slug:"find-median-from-data-stream",             diff:"Hard"  },
    {title:"Merge K Sorted Lists",               slug:"merge-k-sorted-lists",                     diff:"Hard"  },
  ],
  "backtracking":[
    {title:"Subsets",                            slug:"subsets",                                  diff:"Medium"},
    {title:"Permutations",                       slug:"permutations",                             diff:"Medium"},
    {title:"Combination Sum",                    slug:"combination-sum",                          diff:"Medium"},
    {title:"Word Search",                        slug:"word-search",                              diff:"Medium"},
    {title:"N-Queens",                           slug:"n-queens",                                 diff:"Hard"  },
  ],
  "sliding-window":[
    {title:"Longest Substring Without Repeat",   slug:"longest-substring-without-repeating-characters", diff:"Medium"},
    {title:"Permutation in String",              slug:"permutation-in-string",                    diff:"Medium"},
    {title:"Minimum Window Substring",           slug:"minimum-window-substring",                 diff:"Hard"  },
    {title:"Sliding Window Maximum",             slug:"sliding-window-maximum",                   diff:"Hard"  },
  ],
  "two-pointers":[
    {title:"Valid Palindrome",                   slug:"valid-palindrome",                         diff:"Easy"  },
    {title:"3Sum",                               slug:"3sum",                                     diff:"Medium"},
    {title:"Container With Most Water",          slug:"container-with-most-water",                diff:"Medium"},
    {title:"Trapping Rain Water",                slug:"trapping-rain-water",                      diff:"Hard"  },
  ],
  "stack":[
    {title:"Valid Parentheses",                  slug:"valid-parentheses",                        diff:"Easy"  },
    {title:"Min Stack",                          slug:"min-stack",                                diff:"Medium"},
    {title:"Daily Temperatures",                 slug:"daily-temperatures",                       diff:"Medium"},
    {title:"Largest Rectangle in Histogram",     slug:"largest-rectangle-in-histogram",           diff:"Hard"  },
  ],
  "array":[
    {title:"Two Sum",                            slug:"two-sum",                                  diff:"Easy"  },
    {title:"Best Time to Buy and Sell Stock",    slug:"best-time-to-buy-and-sell-stock",          diff:"Easy"  },
    {title:"Product of Array Except Self",       slug:"product-of-array-except-self",             diff:"Medium"},
    {title:"Maximum Subarray",                   slug:"maximum-subarray",                         diff:"Medium"},
    {title:"3Sum",                               slug:"3sum",                                     diff:"Medium"},
    {title:"Trapping Rain Water",                slug:"trapping-rain-water",                      diff:"Hard"  },
  ],
  "linked-list":[
    {title:"Reverse Linked List",                slug:"reverse-linked-list",                      diff:"Easy"  },
    {title:"Merge Two Sorted Lists",             slug:"merge-two-sorted-lists",                   diff:"Easy"  },
    {title:"Linked List Cycle",                  slug:"linked-list-cycle",                        diff:"Easy"  },
    {title:"Reorder List",                       slug:"reorder-list",                             diff:"Medium"},
    {title:"LRU Cache",                          slug:"lru-cache",                                diff:"Hard"  },
  ],
  "hash-table":[
    {title:"Two Sum",                            slug:"two-sum",                                  diff:"Easy"  },
    {title:"Valid Anagram",                      slug:"valid-anagram",                            diff:"Easy"  },
    {title:"Group Anagrams",                     slug:"group-anagrams",                           diff:"Medium"},
    {title:"Longest Consecutive Sequence",       slug:"longest-consecutive-sequence",             diff:"Medium"},
    {title:"LRU Cache",                          slug:"lru-cache",                                diff:"Hard"  },
  ],
  "string":[
    {title:"Valid Palindrome",                   slug:"valid-palindrome",                         diff:"Easy"  },
    {title:"Valid Anagram",                      slug:"valid-anagram",                            diff:"Easy"  },
    {title:"Longest Palindromic Substring",      slug:"longest-palindromic-substring",            diff:"Medium"},
    {title:"Group Anagrams",                     slug:"group-anagrams",                           diff:"Medium"},
    {title:"Minimum Window Substring",           slug:"minimum-window-substring",                 diff:"Hard"  },
  ],
  "bit-manipulation":[
    {title:"Single Number",                      slug:"single-number",                            diff:"Easy"  },
    {title:"Number of 1 Bits",                   slug:"number-of-1-bits",                         diff:"Easy"  },
    {title:"Counting Bits",                      slug:"counting-bits",                            diff:"Easy"  },
    {title:"Sum of Two Integers",                slug:"sum-of-two-integers",                      diff:"Medium"},
  ],
  "trie":[
    {title:"Implement Trie",                     slug:"implement-trie-prefix-tree",               diff:"Medium"},
    {title:"Design Add and Search Words",        slug:"design-add-and-search-words-data-structure",diff:"Medium"},
    {title:"Word Search II",                     slug:"word-search-ii",                           diff:"Hard"  },
  ],
}

const DIFF_STYLE = {
  Easy:   {bg:"rgba(59,109,17,0.1)",  color:"#3B6D11"},
  Medium: {bg:"rgba(186,117,23,0.1)", color:"#BA7517"},
  Hard:   {bg:"rgba(163,45,45,0.1)",  color:"#A32D2D"},
}

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

export default function AIStudyPlan({ data, recent }) {
  const { topics } = data
  const [tab, setTab] = useState("weakTopics")
  const today = new Date().getDay() // 0=Sun

  const allTags = useMemo(() => [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ].filter(t => t.problemsSolved >= 0), [topics])

  // Compute weak topics sorted by coverage %
  const weakTopics = useMemo(() => allTags.map(t => {
    const total = KNOWN_TOTALS[t.tagSlug] || Math.round(t.problemsSolved * 1.6)
    const pct   = Math.min(100, Math.round((t.problemsSolved / total) * 100))
    return { ...t, pct, total }
  }).sort((a, b) => a.pct - b.pct).slice(0, 6), [allTags])

  // PERSONALIZED weekly plan — assigns YOUR weakest topics to each day
  // Sunday = rest/review day always
  const weeklyPlan = useMemo(() => {
    // Get top 6 weak topics for assignment
    const topWeak = weakTopics.slice(0, 6)
    // Fill 6 weekdays (Mon-Sat) with weak topics, Sunday is rest
    const days = []
    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        // Sunday — always rest/mock
        days.push({ day:"Sun", focus:"Mock Interview / Review", icon:"fa-clock-rotate-left", topicSlug:null, isRest:true })
      } else {
        // Mon(1) to Sat(6) — assign weak topics in order
        const t = topWeak[i - 1]
        if (t) {
          days.push({ day:DAY_NAMES[i], focus:t.tagName, icon:getTopicIcon(t.tagSlug), topicSlug:t.tagSlug, pct:t.pct, isRest:false })
        } else {
          days.push({ day:DAY_NAMES[i], focus:"Practice & Revise", icon:"fa-rotate-left", topicSlug:null, isRest:true })
        }
      }
    }
    return days
  }, [weakTopics])

  // Recent solved slugs to filter next problems
  const solvedSlugs = useMemo(() => {
    return new Set((recent?.submissions || []).map(s => s.slug))
  }, [recent])

  const nextProblems = useMemo(() => {
    const results = []
    for (const t of weakTopics.slice(0, 4)) {
      const pool = PROBLEMS[t.tagSlug] || []
      if (!pool.length) continue
      const sorted   = [...pool].sort((a,b) => {
        const order = {Easy:0,Medium:1,Hard:2}
        return order[a.diff] - order[b.diff]
      })
      const unsolved  = sorted.filter(p => !solvedSlugs.has(p.slug))
      const recommend = t.pct >= 60
        ? unsolved.filter(p => p.diff !== "Easy").slice(0, 2)
        : unsolved.slice(0, 2)
      const final = recommend.length ? recommend : unsolved.slice(0, 2)
      final.forEach(p => results.push({ ...p, topic:t.tagName, topicSlug:t.tagSlug, mastery:t.pct }))
    }
    return results.slice(0, 8)
  }, [weakTopics, solvedSlugs])

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">AI study plan</div>
          <div className="card-subtitle">Personalized weekly schedule based on YOUR weakest topics</div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["weakTopics","Weak Topics"],["weeklyPlan","Weekly Plan"],["nextProblems","Next Problems"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer",
              border:"0.5px solid "+(tab===key ? "var(--border2)":"var(--border)"),
              background:tab===key ? "var(--surface2)":"transparent",
              color:tab===key ? "var(--text)":"var(--text3)",
              fontFamily:"var(--font-main)", transition:"all 0.15s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      {tab === "weakTopics" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:4 }}>Focus on these topics first — sorted by lowest coverage</div>
          {weakTopics.map((t, i) => (
            <div key={t.tagSlug} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"var(--surface3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"var(--text3)", flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{t.tagName}</div>
                <div style={{ height:4, background:"var(--surface3)", borderRadius:2 }}>
                  <div style={{ height:"100%", background:"#A32D2D", borderRadius:2, width:t.pct+"%" }} />
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:500, fontFamily:"var(--font-mono)", color:"#A32D2D" }}>{t.pct}%</div>
                <div style={{ fontSize:10, color:"var(--text3)" }}>{t.problemsSolved}/{t.total}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "weeklyPlan" && (
        <div>
          <div style={{ padding:"12px 16px", background:"rgba(24,95,165,0.08)", borderRadius:8, border:"0.5px solid rgba(24,95,165,0.2)", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
            <i className={"fa-solid "+weeklyPlan[today].icon} style={{ color:"#185FA5", fontSize:18 }} />
            <div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>Today ({weeklyPlan[today].day}) — your focus</div>
              <div style={{ fontSize:13, fontWeight:500, color:"#185FA5" }}>{weeklyPlan[today].focus}</div>
              {weeklyPlan[today].pct !== undefined && (
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>Current mastery: <span style={{ color:"#A32D2D", fontWeight:600 }}>{weeklyPlan[today].pct}%</span> — needs work!</div>
              )}
            </div>
          </div>

          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10 }}>
            This plan is <span style={{ color:"var(--accent)", fontWeight:600 }}>personalized for {data.username}</span> — topics assigned based on your weakest areas
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {weeklyPlan.map((p, i) => {
              const isToday = i === today
              return (
                <div key={p.day} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:8,
                  background:isToday ? "rgba(24,95,165,0.08)" : "var(--surface2)",
                  border:"0.5px solid "+(isToday ? "rgba(24,95,165,0.3)" : "var(--border)"),
                }}>
                  <i className={"fa-solid "+p.icon} style={{ color:isToday?"#185FA5":p.isRest?"var(--text3)":"#BA7517", fontSize:14, width:16, textAlign:"center" }} />
                  <span style={{ fontSize:11, fontWeight:600, color:isToday?"#185FA5":"var(--text3)", width:28 }}>{p.day}</span>
                  <span style={{ fontSize:12, color:isToday?"var(--text)":"var(--text2)", flex:1 }}>{p.focus}</span>
                  {p.pct !== undefined && (
                    <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4,
                      background: p.pct < 30 ? "rgba(163,45,45,0.1)" : p.pct < 60 ? "rgba(186,117,23,0.1)" : "rgba(59,109,17,0.1)",
                      color: p.pct < 30 ? "#A32D2D" : p.pct < 60 ? "#BA7517" : "#3B6D11",
                    }}>{p.pct}% mastery</span>
                  )}
                  {isToday && <span style={{ fontSize:10, padding:"2px 8px", background:"rgba(24,95,165,0.12)", color:"#185FA5", borderRadius:4 }}>Today</span>}
                  {p.isRest && !isToday && <span style={{ fontSize:10, color:"var(--text3)" }}>Rest</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === "nextProblems" && (
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>
            Problems from your weakest topics · easier first for low mastery · harder first above 60%
            {recent?.submissions?.length > 0 && <span style={{ color:"#3B6D11", marginLeft:6 }}>· Recently solved filtered out</span>}
          </div>
          {nextProblems.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px", color:"var(--text3)", fontSize:13 }}>
              No recommendations — solve more problems first!
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {nextProblems.map((p, i) => {
                const ds = DIFF_STYLE[p.diff] || DIFF_STYLE.Medium
                return (
                  <a key={i} href={"https://leetcode.com/problems/"+p.slug} target="_blank" rel="noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)", textDecoration:"none", transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.background="var(--surface3)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)";  e.currentTarget.style.background="var(--surface2)" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#185FA5", flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                      <div style={{ fontSize:10, color:"var(--text3)", marginTop:2, display:"flex", gap:6 }}>
                        <span>{p.topic}</span><span>·</span>
                        <span style={{ color:p.mastery<30?"#A32D2D":p.mastery<60?"#BA7517":"#3B6D11" }}>Your mastery: {p.mastery}%</span>
                      </div>
                    </div>
                    <div style={{ padding:"3px 8px", borderRadius:4, fontSize:10, fontWeight:600, background:ds.bg, color:ds.color, flexShrink:0 }}>{p.diff}</div>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ color:"var(--text3)", fontSize:11, flexShrink:0 }} />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getTopicIcon(slug) {
  const icons = {
    "dynamic-programming":"fa-brain","graph":"fa-diagram-project","tree":"fa-tree",
    "array":"fa-layer-group","string":"fa-font","hash-table":"fa-hashtag",
    "binary-search":"fa-magnifying-glass","two-pointers":"fa-arrows-left-right",
    "stack":"fa-layer-group","heap-priority-queue":"fa-arrow-up-wide-short",
    "backtracking":"fa-rotate-left","sliding-window":"fa-window-maximize",
    "linked-list":"fa-link","trie":"fa-sitemap","bit-manipulation":"fa-microchip",
    "sorting":"fa-sort","greedy":"fa-bolt","recursion":"fa-infinity",
    "math":"fa-square-root-variable","depth-first-search":"fa-arrow-down-long",
    "breadth-first-search":"fa-arrows-to-circle",
  }
  return icons[slug] || "fa-code"
}