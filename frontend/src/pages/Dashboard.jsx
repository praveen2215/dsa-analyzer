import React from "react"
import ProfileBanner from "../components/ProfileBanner"
import StatCards from "../components/StatCards"
import DifficultyCard from "../components/DifficultyCard"
import RatingChart from "../components/RatingChart"
import TopicHeatmap from "../components/TopicHeatmap"
import ActivityHeatmap from "../components/ActivityHeatmap"
import RecentSubmissions from "../components/RecentSubmissions"
import InterviewReadiness from "../components/InterviewReadiness"
import GoalTracker from "../components/GoalTracker"
import LanguageBreakdown from "../components/LanguageBreakdown"
import AIStudyPlan from "../components/AIStudyPlan"
import ShareBar from "../components/ShareBar"
import ProgressTimeline from "../components/ProgressTimeline"
import RankTracker from "../components/RankTracker"
import DailyChallenge from "../components/DailyChallenge"
import SkillGapAnalyzer from "../components/SkillGapAnalyzer"

export default function Dashboard({ data, recent, onAnalyze, shareUrl }) {
  return (
    <div className="fade-in" style={{ maxWidth:1400, margin:"0 auto", padding:"32px 28px 60px" }}>

      <ShareBar username={data.username} shareUrl={shareUrl} />
      <ProfileBanner data={data} />

      <div className="section-label">Performance Overview</div>
      <StatCards data={data} />

      <div className="section-label">Daily Challenge</div>
      <DailyChallenge data={data} />

      <div className="section-label">Skill Gap Analyzer</div>
      <SkillGapAnalyzer data={data} />

      <div className="section-label">Progress Timeline</div>
      <ProgressTimeline data={data} />

      <div className="section-label">Global Ranking</div>
      <RankTracker data={data} />

      <div className="section-label">Interview Readiness</div>
      <InterviewReadiness data={data} />

      <div className="section-label">Rating Progression</div>
      <RatingChart contest={data.contest} />

      <div className="section-label">Solved Problems Breakdown</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <DifficultyCard data={data} />
        <RecentSubmissions recent={recent} username={data.username} />
      </div>

      <div className="section-label">AI Study Plan</div>
      <AIStudyPlan data={data} recent={recent} />

      <div className="section-label">Topic Mastery</div>
      <TopicHeatmap topics={data.topics} solved={data.solved} />

      <div className="section-label">Language & Goals</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <LanguageBreakdown languages={data.languages} recent={recent} />
        <GoalTracker data={data} />
      </div>

      <div className="section-label">Activity</div>
      <ActivityHeatmap calendar={data.calendar} />

    </div>
  )
}