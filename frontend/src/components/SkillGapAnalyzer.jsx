import React, { useState, useMemo } from "react"

const COMPANY_REQUIREMENTS = {
  Google: {
    color: "#4285F4", logo: "G",
    topics: [
      { slug:"dynamic-programming", weight:22, label:"Dynamic Programming" },
      { slug:"graph",               weight:18, label:"Graphs"              },
      { slug:"array",               weight:15, label:"Arrays"              },
      { slug:"tree",                weight:12, label:"Trees"               },
      { slug:"string",              weight:10, label:"Strings"             },
      { slug:"backtracking",        weight:8,  label:"Backtracking"        },
      { slug:"binary-search",       weight:8,  label:"Binary Search"       },
      { slug:"heap-priority-queue", weight:7,  label:"Heaps"               },
    ],
    minSolved: 300, minHard: 80,
    desc: "Focuses heavily on DP and graph problems. Expects clean code and optimal complexity.",
    problems: {
      "dynamic-programming": [
        { title:"Climbing Stairs",                slug:"climbing-stairs",                         diff:"Easy"   },
        { title:"House Robber",                   slug:"house-robber",                            diff:"Medium" },
        { title:"Coin Change",                    slug:"coin-change",                             diff:"Medium" },
        { title:"Longest Increasing Subsequence", slug:"longest-increasing-subsequence",          diff:"Medium" },
        { title:"Word Break",                     slug:"word-break",                              diff:"Medium" },
        { title:"Edit Distance",                  slug:"edit-distance",                           diff:"Hard"   },
        { title:"Burst Balloons",                 slug:"burst-balloons",                          diff:"Hard"   },
        { title:"Regular Expression Matching",    slug:"regular-expression-matching",             diff:"Hard"   },
      ],
      "graph": [
        { title:"Number of Islands",              slug:"number-of-islands",                       diff:"Medium" },
        { title:"Clone Graph",                    slug:"clone-graph",                             diff:"Medium" },
        { title:"Course Schedule",                slug:"course-schedule",                         diff:"Medium" },
        { title:"Pacific Atlantic Water Flow",    slug:"pacific-atlantic-water-flow",             diff:"Medium" },
        { title:"Word Ladder",                    slug:"word-ladder",                             diff:"Hard"   },
        { title:"Alien Dictionary",               slug:"alien-dictionary",                        diff:"Hard"   },
      ],
      "array": [
        { title:"Two Sum",                        slug:"two-sum",                                 diff:"Easy"   },
        { title:"Maximum Subarray",               slug:"maximum-subarray",                        diff:"Medium" },
        { title:"Product of Array Except Self",   slug:"product-of-array-except-self",            diff:"Medium" },
        { title:"3Sum",                           slug:"3sum",                                    diff:"Medium" },
        { title:"Trapping Rain Water",            slug:"trapping-rain-water",                     diff:"Hard"   },
        { title:"First Missing Positive",         slug:"first-missing-positive",                  diff:"Hard"   },
      ],
      "tree": [
        { title:"Maximum Depth of Binary Tree",   slug:"maximum-depth-of-binary-tree",            diff:"Easy"   },
        { title:"Validate Binary Search Tree",    slug:"validate-binary-search-tree",             diff:"Medium" },
        { title:"LCA of Binary Tree",             slug:"lowest-common-ancestor-of-a-binary-tree", diff:"Medium" },
        { title:"Binary Tree Max Path Sum",       slug:"binary-tree-maximum-path-sum",            diff:"Hard"   },
        { title:"Serialize and Deserialize Tree", slug:"serialize-and-deserialize-binary-tree",   diff:"Hard"   },
      ],
      "binary-search": [
        { title:"Binary Search",                  slug:"binary-search",                           diff:"Easy"   },
        { title:"Search in Rotated Array",        slug:"search-in-rotated-sorted-array",          diff:"Medium" },
        { title:"Find Minimum in Rotated Array",  slug:"find-minimum-in-rotated-sorted-array",    diff:"Medium" },
        { title:"Median of Two Sorted Arrays",    slug:"median-of-two-sorted-arrays",             diff:"Hard"   },
      ],
    }
  },
  Meta: {
    color: "#0866FF", logo: "f",
    topics: [
      { slug:"array",               weight:20, label:"Arrays"              },
      { slug:"tree",                weight:18, label:"Trees"               },
      { slug:"graph",               weight:15, label:"Graphs"              },
      { slug:"dynamic-programming", weight:12, label:"Dynamic Programming" },
      { slug:"string",              weight:12, label:"Strings"             },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"two-pointers",        weight:8,  label:"Two Pointers"        },
      { slug:"recursion",           weight:5,  label:"Recursion"           },
    ],
    minSolved: 250, minHard: 60,
    desc: "Loves tree and array problems. Speed and communication matter a lot.",
    problems: {
      "array": [
        { title:"Best Time to Buy and Sell Stock", slug:"best-time-to-buy-and-sell-stock",        diff:"Easy"   },
        { title:"Move Zeroes",                     slug:"move-zeroes",                            diff:"Easy"   },
        { title:"Product of Array Except Self",    slug:"product-of-array-except-self",           diff:"Medium" },
        { title:"Subarray Sum Equals K",           slug:"subarray-sum-equals-k",                  diff:"Medium" },
        { title:"Trapping Rain Water",             slug:"trapping-rain-water",                    diff:"Hard"   },
      ],
      "tree": [
        { title:"Invert Binary Tree",              slug:"invert-binary-tree",                     diff:"Easy"   },
        { title:"Diameter of Binary Tree",         slug:"diameter-of-binary-tree",                diff:"Easy"   },
        { title:"Binary Tree Level Order",         slug:"binary-tree-level-order-traversal",      diff:"Medium" },
        { title:"LCA of Binary Tree",              slug:"lowest-common-ancestor-of-a-binary-tree",diff:"Medium" },
        { title:"Binary Tree Max Path Sum",        slug:"binary-tree-maximum-path-sum",           diff:"Hard"   },
      ],
      "string": [
        { title:"Valid Palindrome",                slug:"valid-palindrome",                        diff:"Easy"   },
        { title:"Longest Substring Without Repeat",slug:"longest-substring-without-repeating-characters", diff:"Medium" },
        { title:"Group Anagrams",                  slug:"group-anagrams",                         diff:"Medium" },
        { title:"Minimum Window Substring",        slug:"minimum-window-substring",               diff:"Hard"   },
      ],
      "hash-table": [
        { title:"Two Sum",                         slug:"two-sum",                                diff:"Easy"   },
        { title:"Group Anagrams",                  slug:"group-anagrams",                         diff:"Medium" },
        { title:"Longest Consecutive Sequence",    slug:"longest-consecutive-sequence",           diff:"Medium" },
        { title:"LRU Cache",                       slug:"lru-cache",                              diff:"Hard"   },
      ],
      "two-pointers": [
        { title:"Valid Palindrome",                slug:"valid-palindrome",                        diff:"Easy"   },
        { title:"3Sum",                            slug:"3sum",                                   diff:"Medium" },
        { title:"Container With Most Water",       slug:"container-with-most-water",              diff:"Medium" },
      ],
    }
  },
  Amazon: {
    color: "#FF9900", logo: "a",
    topics: [
      { slug:"array",               weight:20, label:"Arrays"              },
      { slug:"tree",                weight:15, label:"Trees"               },
      { slug:"dynamic-programming", weight:15, label:"Dynamic Programming" },
      { slug:"string",              weight:12, label:"Strings"             },
      { slug:"graph",               weight:12, label:"Graphs"              },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"sorting",             weight:8,  label:"Sorting"             },
      { slug:"heap-priority-queue", weight:8,  label:"Heaps"               },
    ],
    minSolved: 200, minHard: 40,
    desc: "Broad coverage expected. Leadership principles combined with solid DSA.",
    problems: {
      "array": [
        { title:"Two Sum",                         slug:"two-sum",                                diff:"Easy"   },
        { title:"Best Time to Buy and Sell Stock", slug:"best-time-to-buy-and-sell-stock",        diff:"Easy"   },
        { title:"Maximum Subarray",                slug:"maximum-subarray",                       diff:"Medium" },
        { title:"Product of Array Except Self",    slug:"product-of-array-except-self",           diff:"Medium" },
        { title:"Trapping Rain Water",             slug:"trapping-rain-water",                    diff:"Hard"   },
      ],
      "heap-priority-queue": [
        { title:"Kth Largest Element",             slug:"kth-largest-element-in-an-array",        diff:"Medium" },
        { title:"Top K Frequent Elements",         slug:"top-k-frequent-elements",                diff:"Medium" },
        { title:"Task Scheduler",                  slug:"task-scheduler",                         diff:"Medium" },
        { title:"Find Median from Data Stream",    slug:"find-median-from-data-stream",           diff:"Hard"   },
        { title:"Merge K Sorted Lists",            slug:"merge-k-sorted-lists",                   diff:"Hard"   },
      ],
      "dynamic-programming": [
        { title:"Climbing Stairs",                 slug:"climbing-stairs",                        diff:"Easy"   },
        { title:"Coin Change",                     slug:"coin-change",                            diff:"Medium" },
        { title:"Partition Equal Subset Sum",      slug:"partition-equal-subset-sum",             diff:"Medium" },
        { title:"Longest Increasing Subsequence",  slug:"longest-increasing-subsequence",         diff:"Medium" },
        { title:"Edit Distance",                   slug:"edit-distance",                          diff:"Hard"   },
      ],
      "graph": [
        { title:"Number of Islands",               slug:"number-of-islands",                      diff:"Medium" },
        { title:"Course Schedule",                 slug:"course-schedule",                        diff:"Medium" },
        { title:"Rotting Oranges",                 slug:"rotting-oranges",                        diff:"Medium" },
        { title:"Word Ladder",                     slug:"word-ladder",                            diff:"Hard"   },
      ],
      "sorting": [
        { title:"Merge Intervals",                 slug:"merge-intervals",                        diff:"Medium" },
        { title:"Sort Colors",                     slug:"sort-colors",                            diff:"Medium" },
        { title:"Largest Number",                  slug:"largest-number",                         diff:"Medium" },
      ],
    }
  },
  Microsoft: {
    color: "#00A4EF", logo: "M",
    topics: [
      { slug:"tree",                weight:20, label:"Trees"               },
      { slug:"array",               weight:18, label:"Arrays"              },
      { slug:"string",              weight:15, label:"Strings"             },
      { slug:"dynamic-programming", weight:12, label:"Dynamic Programming" },
      { slug:"linked-list",         weight:10, label:"Linked Lists"        },
      { slug:"graph",               weight:10, label:"Graphs"              },
      { slug:"binary-search",       weight:8,  label:"Binary Search"       },
      { slug:"stack",               weight:7,  label:"Stacks"              },
    ],
    minSolved: 180, minHard: 35,
    desc: "Strong emphasis on trees and OOP design. Good for mid-level engineers.",
    problems: {
      "tree": [
        { title:"Invert Binary Tree",              slug:"invert-binary-tree",                     diff:"Easy"   },
        { title:"Maximum Depth of Binary Tree",    slug:"maximum-depth-of-binary-tree",           diff:"Easy"   },
        { title:"Binary Tree Level Order",         slug:"binary-tree-level-order-traversal",      diff:"Medium" },
        { title:"Validate Binary Search Tree",     slug:"validate-binary-search-tree",            diff:"Medium" },
        { title:"Binary Tree Max Path Sum",        slug:"binary-tree-maximum-path-sum",           diff:"Hard"   },
      ],
      "linked-list": [
        { title:"Reverse Linked List",             slug:"reverse-linked-list",                    diff:"Easy"   },
        { title:"Merge Two Sorted Lists",          slug:"merge-two-sorted-lists",                 diff:"Easy"   },
        { title:"Linked List Cycle",               slug:"linked-list-cycle",                      diff:"Easy"   },
        { title:"Reorder List",                    slug:"reorder-list",                           diff:"Medium" },
        { title:"LRU Cache",                       slug:"lru-cache",                              diff:"Hard"   },
      ],
      "string": [
        { title:"Valid Anagram",                   slug:"valid-anagram",                          diff:"Easy"   },
        { title:"Valid Palindrome",                slug:"valid-palindrome",                       diff:"Easy"   },
        { title:"Longest Substring Without Repeat",slug:"longest-substring-without-repeating-characters", diff:"Medium" },
        { title:"Minimum Window Substring",        slug:"minimum-window-substring",               diff:"Hard"   },
      ],
      "stack": [
        { title:"Valid Parentheses",               slug:"valid-parentheses",                      diff:"Easy"   },
        { title:"Min Stack",                       slug:"min-stack",                              diff:"Medium" },
        { title:"Daily Temperatures",              slug:"daily-temperatures",                     diff:"Medium" },
        { title:"Largest Rectangle in Histogram",  slug:"largest-rectangle-in-histogram",         diff:"Hard"   },
      ],
    }
  },
  Apple: {
    color: "#555555", logo: "",
    topics: [
      { slug:"array",               weight:18, label:"Arrays"              },
      { slug:"string",              weight:18, label:"Strings"             },
      { slug:"tree",                weight:15, label:"Trees"               },
      { slug:"dynamic-programming", weight:13, label:"Dynamic Programming" },
      { slug:"graph",               weight:12, label:"Graphs"              },
      { slug:"hash-table",          weight:10, label:"Hash Tables"         },
      { slug:"sorting",             weight:8,  label:"Sorting"             },
      { slug:"two-pointers",        weight:6,  label:"Two Pointers"        },
    ],
    minSolved: 220, minHard: 50,
    desc: "Balanced difficulty. Strong systems thinking expected alongside DSA.",
    problems: {
      "array": [
        { title:"Two Sum",                         slug:"two-sum",                                diff:"Easy"   },
        { title:"Maximum Subarray",                slug:"maximum-subarray",                       diff:"Medium" },
        { title:"3Sum",                            slug:"3sum",                                   diff:"Medium" },
        { title:"Trapping Rain Water",             slug:"trapping-rain-water",                    diff:"Hard"   },
      ],
      "string": [
        { title:"Valid Anagram",                   slug:"valid-anagram",                          diff:"Easy"   },
        { title:"Longest Palindromic Substring",   slug:"longest-palindromic-substring",          diff:"Medium" },
        { title:"Group Anagrams",                  slug:"group-anagrams",                         diff:"Medium" },
        { title:"Minimum Window Substring",        slug:"minimum-window-substring",               diff:"Hard"   },
      ],
      "two-pointers": [
        { title:"Valid Palindrome",                slug:"valid-palindrome",                       diff:"Easy"   },
        { title:"Container With Most Water",       slug:"container-with-most-water",              diff:"Medium" },
        { title:"Trapping Rain Water",             slug:"trapping-rain-water",                    diff:"Hard"   },
      ],
      "sorting": [
        { title:"Merge Intervals",                 slug:"merge-intervals",                        diff:"Medium" },
        { title:"Sort Colors",                     slug:"sort-colors",                            diff:"Medium" },
        { title:"Kth Largest Element",             slug:"kth-largest-element-in-an-array",        diff:"Medium" },
      ],
    }
  },
  Netflix: {
    color: "#E50914", logo: "N",
    topics: [
      { slug:"dynamic-programming", weight:20, label:"Dynamic Programming" },
      { slug:"graph",               weight:18, label:"Graphs"              },
      { slug:"array",               weight:15, label:"Arrays"              },
      { slug:"tree",                weight:12, label:"Trees"               },
      { slug:"heap-priority-queue", weight:12, label:"Heaps"               },
      { slug:"backtracking",        weight:10, label:"Backtracking"        },
      { slug:"string",              weight:8,  label:"Strings"             },
      { slug:"binary-search",       weight:5,  label:"Binary Search"       },
    ],
    minSolved: 350, minHard: 100,
    desc: "High bar — expects senior-level problem solving. Mostly hard problems.",
    problems: {
      "dynamic-programming": [
        { title:"House Robber",                    slug:"house-robber",                           diff:"Medium" },
        { title:"Coin Change",                     slug:"coin-change",                            diff:"Medium" },
        { title:"Longest Increasing Subsequence",  slug:"longest-increasing-subsequence",         diff:"Medium" },
        { title:"Edit Distance",                   slug:"edit-distance",                          diff:"Hard"   },
        { title:"Burst Balloons",                  slug:"burst-balloons",                         diff:"Hard"   },
        { title:"Regular Expression Matching",     slug:"regular-expression-matching",            diff:"Hard"   },
      ],
      "graph": [
        { title:"Course Schedule",                 slug:"course-schedule",                        diff:"Medium" },
        { title:"Pacific Atlantic Water Flow",     slug:"pacific-atlantic-water-flow",            diff:"Medium" },
        { title:"Word Ladder",                     slug:"word-ladder",                            diff:"Hard"   },
        { title:"Alien Dictionary",                slug:"alien-dictionary",                       diff:"Hard"   },
      ],
      "heap-priority-queue": [
        { title:"Task Scheduler",                  slug:"task-scheduler",                         diff:"Medium" },
        { title:"Find Median from Data Stream",    slug:"find-median-from-data-stream",           diff:"Hard"   },
        { title:"Merge K Sorted Lists",            slug:"merge-k-sorted-lists",                   diff:"Hard"   },
        { title:"Sliding Window Maximum",          slug:"sliding-window-maximum",                 diff:"Hard"   },
      ],
      "backtracking": [
        { title:"Combination Sum",                 slug:"combination-sum",                        diff:"Medium" },
        { title:"Word Search",                     slug:"word-search",                            diff:"Medium" },
        { title:"N-Queens",                        slug:"n-queens",                               diff:"Hard"   },
        { title:"Word Search II",                  slug:"word-search-ii",                         diff:"Hard"   },
      ],
    }
  },
}

const KNOWN_TOTALS = {
  "array":1600,"dynamic-programming":590,"string":590,"math":560,"tree":360,
  "depth-first-search":420,"greedy":410,"binary-search":280,"breadth-first-search":270,
  "graph":290,"sorting":370,"hash-table":590,"two-pointers":230,"bit-manipulation":170,
  "stack":290,"heap-priority-queue":240,"backtracking":210,"sliding-window":200,
  "linked-list":175,"trie":90,"recursion":100,"matrix":210,
}

const DIFF_STYLE = {
  Easy:   { bg:"rgba(59,109,17,0.1)",  color:"#3B6D11", border:"rgba(59,109,17,0.25)"  },
  Medium: { bg:"rgba(186,117,23,0.1)", color:"#BA7517", border:"rgba(186,117,23,0.25)" },
  Hard:   { bg:"rgba(163,45,45,0.1)",  color:"#A32D2D", border:"rgba(163,45,45,0.25)"  },
}

function buildTopicLookup(topics) {
  const all = [
    ...(topics?.fundamental   || []),
    ...(topics?.intermediate  || []),
    ...(topics?.advanced      || []),
  ]
  const map = {}
  all.forEach(t => {
    const s = t.problemsSolved || 0
    if (t.tagSlug) map[t.tagSlug.toLowerCase()] = s
    if (t.tagName) {
      map[t.tagName.toLowerCase()] = s
      map[t.tagName.toLowerCase().replace(/\s+/g,"-")] = s
      map[t.tagName.toLowerCase().replace(/[^a-z0-9]/g,"-")] = s
    }
  })
  return map
}

function getTopicMastery(slug, lookup) {
  const keys = [slug, slug.toLowerCase(), slug.replace(/-/g," "), slug.replace(/-/g," ").toLowerCase()]
  let solved = null
  for (const k of keys) {
    if (lookup[k] !== undefined) { solved = lookup[k]; break }
  }
  if (solved === null) return 0
  const total = KNOWN_TOTALS[slug] || Math.max(50, Math.round(solved * 2.5))
  return Math.min(100, Math.round((solved / total) * 100))
}

function computeReadiness(company, data) {
  const { solved, topics } = data
  const cfg    = COMPANY_REQUIREMENTS[company]
  const lookup = buildTopicLookup(topics)

  const topicScores = cfg.topics.map(t => ({
    ...t, mastery: getTopicMastery(t.slug, lookup),
  }))
  const totalWeight = topicScores.reduce((s,t) => s + t.weight, 0)
  const topicScore  = Math.round(topicScores.reduce((s,t) => s + (t.mastery * t.weight / totalWeight), 0))
  const volScore    = Math.min(100, Math.round((solved.total / cfg.minSolved) * 100))
  const hardScore   = Math.min(100, Math.round((solved.hard  / cfg.minHard)   * 100))
  const overall     = Math.round(topicScore * 0.50 + volScore * 0.30 + hardScore * 0.20)

  const gaps = topicScores
    .filter(t => t.mastery < 70)
    .map(t => ({ ...t, gap: Math.max(0, 70 - t.mastery), urgency: t.weight * Math.max(0, 70 - t.mastery) }))
    .sort((a,b) => b.urgency - a.urgency)
    .slice(0, 3)

  const tier =
    overall >= 85 ? { label:"Ready to apply! ✓", color:"#3B6D11", bg:"rgba(59,109,17,0.1)"  } :
    overall >= 65 ? { label:"Almost there",       color:"#185FA5", bg:"rgba(24,95,165,0.1)"  } :
    overall >= 45 ? { label:"3–6 months away",    color:"#BA7517", bg:"rgba(186,117,23,0.1)" } :
                   { label:"6–12 months away",    color:"#A32D2D", bg:"rgba(163,45,45,0.1)"  }

  return { overall, topicScore, volScore, hardScore, topicScores, gaps, tier }
}

function GapBar({ label, mastery, color }) {
  const target  = 70
  const reached = mastery >= target
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:"var(--text2)" }}>{label}</span>
        <span style={{ fontFamily:"var(--font-mono)", color: reached ? "#3B6D11" : "var(--text3)" }}>
          {mastery}% {reached ? "✓" : `/ ${target}% target`}
        </span>
      </div>
      <div style={{ position:"relative", height:7, background:"var(--surface3)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", background: reached ? "#3B6D11" : color, borderRadius:4, width:Math.min(100,mastery)+"%", transition:"width 1s ease" }} />
      </div>
    </div>
  )
}

export default function SkillGapAnalyzer({ data }) {
  const [selected, setSelected] = useState("Google")
  const [tab,      setTab]      = useState("overview")  // overview | problems

  const company  = COMPANY_REQUIREMENTS[selected]
  const analysis = useMemo(() => computeReadiness(selected, data), [selected, data])
  const lookup   = useMemo(() => buildTopicLookup(data.topics), [data.topics])

  // Get problems to solve — prioritize topics with lowest mastery first
  const recommendedProblems = useMemo(() => {
    const companyProblems = company.problems || {}
    const result = []

    // Sort topics by mastery (weakest first)
    const sortedTopics = [...company.topics]
      .map(t => ({ ...t, mastery: getTopicMastery(t.slug, lookup) }))
      .sort((a,b) => a.mastery - b.mastery)

    for (const topic of sortedTopics) {
      const pool = companyProblems[topic.slug] || []
      if (!pool.length) continue
      pool.forEach(p => result.push({ ...p, topic: topic.label, topicSlug: topic.slug, mastery: topic.mastery }))
    }

    return result
  }, [selected, lookup, company])

  const minChecks = [
    { label:"Problems solved", yours:data.solved.total, min:company.minSolved, color:"#3B6D11" },
    { label:"Hard problems",   yours:data.solved.hard,  min:company.minHard,   color:"#A32D2D" },
  ]

  return (
    <div className="card" style={{ padding:"22px 24px", marginBottom:24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Skill gap analyzer</div>
          <div className="card-subtitle">Your real topic mastery vs what top companies actually ask</div>
        </div>
      </div>

      {/* Company selector */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {Object.entries(COMPANY_REQUIREMENTS).map(([name, cfg]) => (
          <button key={name} onClick={() => { setSelected(name); setTab("overview") }}
            style={{
              padding:"7px 14px", borderRadius:8, cursor:"pointer",
              border:"0.5px solid "+(selected===name ? cfg.color+"88" : "var(--border)"),
              background: selected===name ? cfg.color+"18" : "var(--surface2)",
              color: selected===name ? cfg.color : "var(--text2)",
              fontSize:12, fontWeight: selected===name ? 600 : 400,
              fontFamily:"var(--font-main)", transition:"all 0.15s",
              display:"flex", alignItems:"center", gap:6,
            }}>
            <span style={{ fontSize:13, fontWeight:700, color: selected===name ? cfg.color : "var(--text3)" }}>{cfg.logo}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[["overview","📊 Overview"],["problems","📋 Problems to Solve"]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight: tab===key ? 600 : 400,
              border:"0.5px solid "+(tab===key ? company.color+"66" : "var(--border)"),
              background: tab===key ? company.color+"18" : "var(--surface2)",
              color: tab===key ? company.color : "var(--text2)",
              fontFamily:"var(--font-main)", transition:"all 0.15s",
            }}>{label}</button>
        ))}
      </div>

      {/* Company description */}
      <div style={{ padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)", marginBottom:16, fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:10 }}>
        <i className="fa-solid fa-circle-info" style={{ color:company.color, flexShrink:0 }} />
        {company.desc}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Left */}
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>Overall readiness</div>

            <div style={{ padding:"20px", background:"var(--surface2)", borderRadius:12, border:"0.5px solid "+company.color+"44", textAlign:"center", marginBottom:14 }}>
              <div style={{ fontSize:52, fontWeight:700, fontFamily:"var(--font-mono)", color:company.color, lineHeight:1, marginBottom:6 }}>
                {analysis.overall}%
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:analysis.tier.color, marginBottom:4 }}>{analysis.tier.label}</div>
              <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:20, background:analysis.tier.bg, color:analysis.tier.color, fontSize:11, border:"0.5px solid "+analysis.tier.color+"44" }}>
                {selected} Interview Readiness
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
              {[
                { label:"Topic mastery (50%)",  val:analysis.topicScore, color:"#185FA5", icon:"fa-brain"       },
                { label:"Problem volume (30%)", val:analysis.volScore,   color:"#3B6D11", icon:"fa-layer-group" },
                { label:"Hard problems (20%)",  val:analysis.hardScore,  color:"#A32D2D", icon:"fa-fire"        },
              ].map(({ label, val, color, icon }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                  <i className={"fa-solid "+icon} style={{ color, fontSize:13, flexShrink:0 }} />
                  <span style={{ flex:1, fontSize:12, color:"var(--text2)" }}>{label}</span>
                  <span style={{ fontSize:16, fontWeight:600, fontFamily:"var(--font-mono)", color }}>{Math.min(100,val)}%</span>
                </div>
              ))}
            </div>

            <div style={{ padding:"12px 14px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8, fontWeight:500 }}>{selected} minimum bar</div>
              {minChecks.map(({ label, yours, min, color }) => {
                const met = yours >= min
                return (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, fontSize:12 }}>
                    <i className={"fa-solid "+(met ? "fa-circle-check" : "fa-circle-xmark")} style={{ color:met?"#3B6D11":"#A32D2D", fontSize:13, flexShrink:0 }} />
                    <span style={{ flex:1, color:"var(--text2)" }}>{label}</span>
                    <span style={{ fontFamily:"var(--font-mono)", fontWeight:600, color:met?"#3B6D11":"#A32D2D" }}>
                      {yours} / {min}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>
              Topic coverage · dashed line = 70% target
            </div>
            <div style={{ marginBottom:16 }}>
              {analysis.topicScores.map(t => (
                <GapBar key={t.slug} label={t.label} mastery={t.mastery} color={company.color} />
              ))}
            </div>

            {analysis.gaps.length > 0 ? (
              <div style={{ padding:"14px 16px", background:"rgba(186,117,23,0.06)", border:"0.5px solid rgba(186,117,23,0.2)", borderRadius:10 }}>
                <div style={{ fontSize:12, fontWeight:500, color:"#BA7517", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ fontSize:13 }} />
                  Priority gaps to close · <span style={{ fontSize:11, color:"var(--text3)" }}>click "Problems to Solve" tab to see what to practice</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {analysis.gaps.map((t, i) => (
                    <div key={t.slug} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"var(--surface2)", borderRadius:8, border:"0.5px solid var(--border)" }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(186,117,23,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#BA7517", flexShrink:0 }}>{i+1}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{t.label}</div>
                        <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>Currently {t.mastery}% · Need 70% · Weight {t.weight}%</div>
                      </div>
                      <div style={{ fontSize:11, fontWeight:600, color:"#A32D2D", fontFamily:"var(--font-mono)" }}>+{Math.max(0, 70-t.mastery)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding:"14px 16px", background:"rgba(59,109,17,0.08)", border:"0.5px solid rgba(59,109,17,0.2)", borderRadius:10, textAlign:"center" }}>
                <i className="fa-solid fa-trophy" style={{ color:"#3B6D11", fontSize:24, display:"block", marginBottom:8 }} />
                <div style={{ fontSize:13, fontWeight:600, color:"#3B6D11" }}>All topics above 70%!</div>
                <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>You meet the topic requirements for {selected}. Apply now! 🚀</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROBLEMS TO SOLVE TAB ── */}
      {tab === "problems" && (
        <div>
          <div style={{ fontSize:12, color:"var(--text3)", marginBottom:16 }}>
            Problems curated for <span style={{ color:company.color, fontWeight:600 }}>{selected}</span> · sorted by your weakest topics first · click any to open on LeetCode
          </div>

          {recommendedProblems.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px", color:"var(--text3)", fontSize:13 }}>
              No problems available for this company yet.
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {recommendedProblems.map((p, i) => {
                const ds = DIFF_STYLE[p.diff] || DIFF_STYLE.Medium
                return (
                  <a key={i} href={"https://leetcode.com/problems/"+p.slug} target="_blank" rel="noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"var(--surface2)", borderRadius:10, border:"0.5px solid var(--border)", textDecoration:"none", transition:"all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=company.color+"66"; e.currentTarget.style.background="var(--surface3)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)";   e.currentTarget.style.background="var(--surface2)" }}>

                    {/* Difficulty dot */}
                    <div style={{ width:8, height:8, borderRadius:"50%", background:ds.color, flexShrink:0 }} />

                    {/* Problem info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{p.title}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:10, color:"var(--text3)" }}>{p.topic}</span>
                        <span style={{ fontSize:10, color:"var(--text3)" }}>·</span>
                        <span style={{ fontSize:10, color: p.mastery < 30 ? "#A32D2D" : p.mastery < 60 ? "#BA7517" : "#3B6D11" }}>
                          Your mastery: {p.mastery}%
                        </span>
                      </div>
                    </div>

                    {/* Difficulty badge */}
                    <span style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:20, background:ds.bg, color:ds.color, border:"0.5px solid "+ds.border, flexShrink:0 }}>
                      {p.diff}
                    </span>

                    {/* Urgency badge */}
                    {p.mastery < 30 && (
                      <span style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(163,45,45,0.1)", color:"#A32D2D", border:"0.5px solid rgba(163,45,45,0.25)", flexShrink:0 }}>
                        Priority
                      </span>
                    )}
                    {p.mastery >= 30 && p.mastery < 60 && (
                      <span style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(186,117,23,0.1)", color:"#BA7517", border:"0.5px solid rgba(186,117,23,0.25)", flexShrink:0 }}>
                        Improve
                      </span>
                    )}
                    {p.mastery >= 60 && (
                      <span style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(59,109,17,0.1)", color:"#3B6D11", border:"0.5px solid rgba(59,109,17,0.25)", flexShrink:0 }}>
                        Polish
                      </span>
                    )}

                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ color:"var(--text3)", fontSize:11, flexShrink:0 }} />
                  </a>
                )
              })}
            </div>
          )}

          <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(24,95,165,0.06)", border:"0.5px solid rgba(24,95,165,0.15)", borderRadius:8, fontSize:11, color:"var(--text2)", display:"flex", alignItems:"center", gap:8 }}>
            <i className="fa-solid fa-lightbulb" style={{ color:"#BA7517" }} />
            Problems marked <span style={{ color:"#A32D2D", fontWeight:600, margin:"0 3px" }}>Priority</span> are from your weakest topics — solve these first to maximize your {selected} readiness score!
          </div>
        </div>
      )}
    </div>
  )
}