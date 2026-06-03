import React from 'react'
 
function StatCard({ icon, iconBg, iconColor, value, label, sub, trendUp, trendText }) {
  return (
    <div className="card" style={{ padding: '20px 22px', position: 'relative', cursor: 'default' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, marginBottom: 14,
        background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
      }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div style={{
        fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono)',
        color: iconColor, lineHeight: 1
      }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{sub}</div>}
      {trendText && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 4,
          background: trendUp ? 'rgba(72,187,120,0.15)' : 'rgba(252,129,129,0.15)',
          color: trendUp ? 'var(--green)' : 'var(--red)',
        }}>
          <i className={`fa-solid fa-arrow-${trendUp ? 'up' : 'down'}`} style={{ fontSize: 9 }} />
          {trendText}
        </div>
      )}
    </div>
  )
}
 
export default function StatCards({ data }) {
  const { solved, contest, calendar } = data
 
  const totalSubs = solved.totalSubs || 0
  const accRate = totalSubs > 0 ? ((solved.total / totalSubs) * 100).toFixed(1) : 'N/A'
 
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
      <StatCard
        icon="fa-circle-check"
        iconBg="rgba(72,187,120,0.12)" iconColor="var(--green)"
        value={solved.total.toLocaleString()}
        label="Problems Solved"
        sub={`${accRate}% acceptance rate`}
        trendUp={true} trendText="Live data"
      />
      <StatCard
        icon="fa-star"
        iconBg="rgba(99,179,237,0.12)" iconColor="var(--accent)"
        value={contest.rating ? contest.rating.toLocaleString() : '—'}
        label="Contest Rating"
        sub={contest.globalRanking ? `Rank #${contest.globalRanking.toLocaleString()}` : 'No contests yet'}
        trendUp={true} trendText={`Top ${contest.topPercentage}%`}
      />
      <StatCard
        icon="fa-fire"
        iconBg="rgba(246,173,85,0.12)" iconColor="var(--orange)"
        value={calendar.streak || 0}
        label="Current Streak"
        sub={`${calendar.totalActiveDays || 0} active days total`}
        trendUp={calendar.streak > 0} trendText={calendar.streak > 0 ? 'Active' : 'Inactive'}
      />
      <StatCard
        icon="fa-medal"
        iconBg="rgba(183,148,244,0.12)" iconColor="var(--purple)"
        value={contest.attended || 0}
        label="Contests Entered"
        sub={contest.badge ? `Badge: ${contest.badge}` : 'Keep competing!'}
        trendUp={true} trendText="LeetCode"
      />
    </div>
  )
}