import React, { useState, useMemo } from "react"

const KNOWN_TOTALS = {"array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,"depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,"graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,"stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,"linked-list":175,"trie":90}

const PLAN_DAYS = [
  {day:"Mon",focus:"Arrays & Hashing",       icon:"fa-layer-group"},
  {day:"Tue",focus:"Two Pointers & Sliding",  icon:"fa-arrows-left-right"},
  {day:"Wed",focus:"Trees & Graphs",          icon:"fa-diagram-project"},
  {day:"Thu",focus:"Dynamic Programming",     icon:"fa-brain"},
  {day:"Fri",focus:"Heap & Binary Search",    icon:"fa-magnifying-glass"},
  {day:"Sat",focus:"Backtracking & Trie",     icon:"fa-sitemap"},
  {day:"Sun",focus:"Mock Interview / Review", icon:"fa-clock-rotate-left"},
]

// Large pool — more problems per topic so filtering still leaves options
const PROBLEMS = {
  "dynamic-programming":[
    {title:"Climbing Stairs",                    slug:"climbing-stairs",                              diff:"Easy"},
    {title:"House Robber",                       slug:"house-robber",                                 diff:"Medium"},
    {title:"Coin Change",                        slug:"coin-change",                                  diff:"Medium"},
    {title:"Longest Increasing Subsequence",     slug:"longest-increasing-subsequence",               diff:"Medium"},
    {title:"Unique Paths",                       slug:"unique-paths",                                 diff:"Medium"},
    {title:"Jump Game",                          slug:"jump-game",                                    diff:"Medium"},
    {title:"Partition Equal Subset Sum",         slug:"partition-equal-subset-sum",                   diff:"Medium"},
    {title:"Edit Distance",                      slug:"edit-distance",                                diff:"Hard"},
    {title:"Burst Balloons",                     slug:"burst-balloons",                               diff:"Hard"},
    {title:"Regular Expression Matching",        slug:"regular-expression-matching",                  diff:"Hard"},
  ],
  "graph":[
    {title:"Number of Islands",                  slug:"number-of-islands",                            diff:"Medium"},
    {title:"Clone Graph",                        slug:"clone-graph",                                  diff:"Medium"},
    {title:"Course Schedule",                    slug:"course-schedule",                              diff:"Medium"},
    {title:"Pacific Atlantic Water Flow",        slug:"pacific-atlantic-water-flow",                  diff:"Medium"},
    {title:"Rotting Oranges",                    slug:"rotting-oranges",                              diff:"Medium"},
    {title:"Word Ladder",                        slug:"word-ladder",                                  diff:"Hard"},
    {title:"Alien Dictionary",                   slug:"alien-dictionary",                             diff:"Hard"},
  ],
  "tree":[
    {title:"Maximum Depth of Binary Tree",       slug:"maximum-depth-of-binary-tree",                 diff:"Easy"},
    {title:"Invert Binary Tree",                 slug:"invert-binary-tree",                           diff:"Easy"},
    {title:"Diameter of Binary Tree",            slug:"diameter-of-binary-tree",                      diff:"Easy"},
    {title:"Validate Binary Search Tree",        slug:"validate-binary-search-tree",                  diff:"Medium"},
    {title:"LCA of Binary Tree",                 slug:"lowest-common-ancestor-of-a-binary-tree",      diff:"Medium"},
    {title:"Level Order Traversal",              slug:"binary-tree-level-order-traversal",            diff:"Medium"},
    {title:"Binary Tree Max Path Sum",           slug:"binary-tree-maximum-path-sum",                 diff:"Hard"},
    {title:"Serialize and Deserialize Tree",     slug:"serialize-and-deserialize-binary-tree",        diff:"Hard"},
  ],
  "binary-search":[
    {title:"Binary Search",                      slug:"binary-search",                                diff:"Easy"},
    {title:"Find Minimum in Rotated Array",      slug:"find-minimum-in-rotated-sorted-array",         diff:"Medium"},
    {title:"Search in Rotated Array",            slug:"search-in-rotated-sorted-array",               diff:"Medium"},
    {title:"Koko Eating Bananas",                slug:"koko-eating-bananas",                          diff:"Medium"},
    {title:"Time Based Key-Value Store",         slug:"time-based-key-value-store",                   diff:"Medium"},
    {title:"Median of Two Sorted Arrays",        slug:"median-of-two-sorted-arrays",                  diff:"Hard"},
  ],
  "bit-manipulation":[
    {title:"Single Number",                      slug:"single-number",                                diff:"Easy"},
    {title:"Number of 1 Bits",                   slug:"number-of-1-bits",                             diff:"Easy"},
    {title:"Counting Bits",                      slug:"counting-bits",                                diff:"Easy"},
    {title:"Reverse Bits",                       slug:"reverse-bits",                                 diff:"Easy"},
    {title:"Missing Number",                     slug:"missing-number",                               diff:"Easy"},
    {title:"Sum of Two Integers",                slug:"sum-of-two-integers",                          diff:"Medium"},
    {title:"Reverse Integer",                    slug:"reverse-integer",                              diff:"Medium"},
  ],
  "heap-priority-queue":[
    {title:"Kth Largest Element",                slug:"kth-largest-element-in-an-array",              diff:"Medium"},
    {title:"Top K Frequent Elements",            slug:"top-k-frequent-elements",                      diff:"Medium"},
    {title:"Task Scheduler",                     slug:"task-scheduler",                               diff:"Medium"},
    {title:"Design Twitter",                     slug:"design-twitter",                               diff:"Medium"},
    {title:"Find Median from Data Stream",       slug:"find-median-from-data-stream",                 diff:"Hard"},
    {title:"Merge K Sorted Lists",               slug:"merge-k-sorted-lists",                         diff:"Hard"},
  ],
  "backtracking":[
    {title:"Subsets",                            slug:"subsets",                                      diff:"Medium"},
    {title:"Permutations",                       slug:"permutations",                                 diff:"Medium"},
    {title:"Combination Sum",                    slug:"combination-sum",                              diff:"Medium"},
    {title:"Word Search",                        slug:"word-search",                                  diff:"Medium"},
    {title:"Palindrome Partitioning",            slug:"palindrome-partitioning",                      diff:"Medium"},
    {title:"Letter Combinations of Phone Number",slug:"letter-combinations-of-a-phone-number",        diff:"Medium"},
    {title:"N-Queens",                           slug:"n-queens",                                     diff:"Hard"},
    {title:"Sudoku Solver",                      slug:"sudoku-solver",                                diff:"Hard"},
  ],
  "sliding-window":[
    {title:"Best Time to Buy Stock II",          slug:"best-time-to-buy-and-sell-stock-ii",           diff:"Medium"},
    {title:"Longest Repeating Character Replace",slug:"longest-repeating-character-replacement",      diff:"Medium"},
    {title:"Permutation in String",              slug:"permutation-in-string",                        diff:"Medium"},
    {title:"Max Consecutive Ones III",           slug:"max-consecutive-ones-iii",                     diff:"Medium"},
    {title:"Minimum Window Substring",           slug:"minimum-window-substring",                     diff:"Hard"},
    {title:"Sliding Window Maximum",             slug:"sliding-window-maximum",                       diff:"Hard"},
  ],
  "trie":[
    {title:"Implement Trie",                     slug:"implement-trie-prefix-tree",                   diff:"Medium"},
    {title:"Design Add and Search Words",        slug:"design-add-and-search-words-data-structure",   diff:"Medium"},
    {title:"Word Search II",                     slug:"word-search-ii",                               diff:"Hard"},
  ],
  "two-pointers":[
    {title:"Valid Palindrome",                   slug:"valid-palindrome",                             diff:"Easy"},
    {title:"Two Sum II",                         slug:"two-sum-ii-input-array-is-sorted",             diff:"Medium"},
    {title:"3Sum",                               slug:"3sum",                                         diff:"Medium"},
    {title:"Container With Most Water",          slug:"container-with-most-water",                    diff:"Medium"},
    {title:"Trapping Rain Water",                slug:"trapping-rain-water",                          diff:"Hard"},
  ],
  "stack":[
    {title:"Valid Parentheses",                  slug:"valid-parentheses",                            diff:"Easy"},
    {title:"Min Stack",                          slug:"min-stack",                                    diff:"Medium"},
    {title:"Evaluate Reverse Polish Notation",   slug:"evaluate-reverse-polish-notation",             diff:"Medium"},
    {title:"Daily Temperatures",                 slug:"daily-temperatures",                           diff:"Medium"},
    {title:"Car Fleet",                          slug:"car-fleet",                                    diff:"Medium"},
    {title:"Largest Rectangle in Histogram",     slug:"largest-rectangle-in-histogram",               diff:"Hard"},
  ],
  "array":[
    {title:"Contains Duplicate",                 slug:"contains-duplicate",                           diff:"Easy"},
    {title:"Best Time to Buy and Sell Stock",    slug:"best-time-to-buy-and-sell-stock",              diff:"Easy"},
    {title:"Two Sum",                            slug:"two-sum",                                      diff:"Easy"},
    {title:"Product of Array Except Self",       slug:"product-of-array-except-self",                 diff:"Medium"},
    {title:"Maximum Subarray",                   slug:"maximum-subarray",                             diff:"Medium"},
    {title:"3Sum",                               slug:"3sum",                                         diff:"Medium"},
    {title:"Trapping Rain Water",                slug:"trapping-rain-water",                          diff:"Hard"},
    {title:"First Missing Positive",             slug:"first-missing-positive",                       diff:"Hard"},
  ],
  "linked-list":[
    {title:"Reverse Linked List",                slug:"reverse-linked-list",                          diff:"Easy"},
    {title:"Merge Two Sorted Lists",             slug:"merge-two-sorted-lists",                       diff:"Easy"},
    {title:"Linked List Cycle",                  slug:"linked-list-cycle",                            diff:"Easy"},
    {title:"Reorder List",                       slug:"reorder-list",                                 diff:"Medium"},
    {title:"Remove Nth Node From End",           slug:"remove-nth-node-from-end-of-list",             diff:"Medium"},
    {title:"Copy List with Random Pointer",      slug:"copy-list-with-random-pointer",                diff:"Medium"},
    {title:"LRU Cache",                          slug:"lru-cache",                                    diff:"Hard"},
    {title:"Merge K Sorted Lists",               slug:"merge-k-sorted-lists",                         diff:"Hard"},
  ],
  "hash-table":[
    {title:"Two Sum",                            slug:"two-sum",                                      diff:"Easy"},
    {title:"Valid Anagram",                      slug:"valid-anagram",                                diff:"Easy"},
    {title:"Group Anagrams",                     slug:"group-anagrams",                               diff:"Medium"},
    {title:"Top K Frequent Elements",            slug:"top-k-frequent-elements",                      diff:"Medium"},
    {title:"Longest Consecutive Sequence",       slug:"longest-consecutive-sequence",                 diff:"Medium"},
    {title:"Insert Delete GetRandom",            slug:"insert-delete-getrandom-o1",                   diff:"Medium"},
    {title:"LRU Cache",                          slug:"lru-cache",                                    diff:"Hard"},
  ],
}

const DIFF_STYLE = {
  Easy:   {bg:"rgba(59,109,17,0.1)",  color:"#3B6D11"},
  Medium: {bg:"rgba(186,117,23,0.1)", color:"#BA7517"},
  Hard:   {bg:"rgba(163,45,45,0.1)",  color:"#A32D2D"},
}

export default function AIStudyPlan({ data, recent }) {
  const { topics } = data
  const [tab, setTab] = useState("weakTopics")
  const today = new Date().getDay()
  const todayPlan = PLAN_DAYS[today === 0 ? 6 : today - 1]

  const allTags = useMemo(() => [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ].filter(t => t.problemsSolved >= 0), [topics])

  const weakTopics = useMemo(() => allTags.map(t => {
    const total = KNOWN_TOTALS[t.tagSlug] || Math.round(t.problemsSolved * 1.6)
    const pct   = Math.min(100, Math.round((t.problemsSolved / total) * 100))
    return { ...t, pct, total }
  }).sort((a, b) => a.pct - b.pct).slice(0, 6), [allTags])

  // Build a set of already-solved slugs from recent submissions
  const solvedSlugs = useMemo(() => {
    const recentSlugs = new Set(
      (recent?.submissions || []).map(s => s.slug)
    )
    return recentSlugs
  }, [recent])

  // For each weak topic, get unsolved problems only
  // We determine "likely solved" by cross-referencing solved count vs total pool
  const nextProblems = useMemo(() => {
    const results = []
    for (const t of weakTopics.slice(0, 4)) {
      const pool = PROBLEMS[t.tagSlug] || []
      if (!pool.length) continue

      // Sort by difficulty — recommend easier ones first for weak topics
      const sorted = [...pool].sort((a, b) => {
        const order = { Easy:0, Medium:1, Hard:2 }
        return order[a.diff] - order[b.diff]
      })

      // Filter out problems already in recent solved slugs
      const unsolved = sorted.filter(p => !solvedSlugs.has(p.slug))

      // If user has solved a high % of this topic, push harder problems
      const recommended = t.pct >= 60
        ? unsolved.filter(p => p.diff !== "Easy").slice(0, 2)
        : unsolved.slice(0, 2)

      // Fallback to any unsolved if filter is too aggressive
      const final = recommended.length ? recommended : unsolved.slice(0, 2)

      final.forEach(p => results.push({ ...p, topic: t.tagName, topicSlug: t.tagSlug, mastery: t.pct }))
    }
    return results.slice(0, 8)
  }, [weakTopics, solvedSlugs])

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:500 }}>AI study plan</div>
          <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>Personalized recommendations based on your weak areas</div>
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
            <i className={"fa-solid "+todayPlan.icon} style={{ color:"#185FA5", fontSize:18 }} />
            <div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>Today ({todayPlan.day})</div>
              <div style={{ fontSize:13, fontWeight:500, color:"#185FA5" }}>{todayPlan.focus}</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {PLAN_DAYS.map((p, i) => {
              const isToday = i === (today === 0 ? 6 : today - 1)
              return (
                <div key={p.day} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 12px", borderRadius:7, background:isToday?"rgba(24,95,165,0.08)":"transparent", border:"0.5px solid "+(isToday?"rgba(24,95,165,0.2)":"transparent") }}>
                  <i className={"fa-solid "+p.icon} style={{ color:isToday?"#185FA5":"var(--text3)", fontSize:14, width:16, textAlign:"center" }} />
                  <span style={{ fontSize:11, fontWeight:600, color:isToday?"#185FA5":"var(--text3)", width:28 }}>{p.day}</span>
                  <span style={{ fontSize:12, color:isToday?"var(--text)":"var(--text3)", flex:1 }}>{p.focus}</span>
                  {isToday && <span style={{ fontSize:10, padding:"2px 8px", background:"rgba(24,95,165,0.12)", color:"#185FA5", borderRadius:4 }}>Today</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === "nextProblems" && (
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>
            Unsolved problems from your weakest topics · easier first for low mastery · harder first above 60%
          </div>
          {nextProblems.length === 0 ? (
            <div style={{ textAlign:"center", padding:"24px", color:"var(--text3)", fontSize:13 }}>
              No recommendations available — try solving more problems first!
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
                        <span>{p.topic}</span>
                        <span>·</span>
                        <span>Your mastery: {p.mastery}%</span>
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