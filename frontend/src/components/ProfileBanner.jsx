import React from 'react'
 
export default function ProfileBanner({ data }) {
  const { profile, solved, contest } = data
 
  const initials = (profile.realName || data.username)
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
 
  const badgeColor = {
    Guardian: { bg: 'rgba(183,148,244,0.15)', color: '#b794f4', border: 'rgba(183,148,244,0.3)' },
    Knight:   { bg: 'rgba(99,179,237,0.15)',  color: '#63b3ed', border: 'rgba(99,179,237,0.3)' },
    default:  { bg: 'rgba(246,173,85,0.15)',  color: '#f6ad55', border: 'rgba(246,173,85,0.3)' },
  }
  const cb = badgeColor[contest.badge] || badgeColor.default
 
  return (
    <div className="card" style={{
      padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24,
      marginBottom: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,rgba(99,179,237,0.04) 0%,rgba(183,148,244,0.04) 100%)',
        pointerEvents: 'none'
      }} />
 
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {profile.avatar ? (
          <img src={profile.avatar} alt={data.username}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover',
              boxShadow: '0 0 0 3px rgba(99,179,237,0.25)' }} />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg,#63b3ed,#b794f4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#fff',
            boxShadow: '0 0 0 3px rgba(99,179,237,0.2)'
          }}>{initials}</div>
        )}
        <div style={{
          position: 'absolute', bottom: 2, right: 2,
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--green)', border: '2px solid var(--surface)'
        }} />
      </div>
 
      {/* Info */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>
          {profile.realName || data.username}
          {data.cached && (
            <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 8,
              background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>
              cached
            </span>
          )}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
          <a href={`https://leetcode.com/${data.username}`} target="_blank" rel="noreferrer"
            style={{ color: 'var(--text2)' }}>
            leetcode.com/{data.username}
          </a>
          {profile.country && <span> · {profile.country}</span>}
          {profile.company && <span> · {profile.company}</span>}
        </p>
 
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {profile.ranking && (
            <span className="badge" style={{
              background: 'rgba(72,187,120,0.15)', color: 'var(--green)',
              border: '1px solid rgba(72,187,120,0.3)'
            }}>
              🏆 Rank #{profile.ranking.toLocaleString()}
            </span>
          )}
          {data.calendar?.streak > 0 && (
            <span className="badge" style={{
              background: 'rgba(246,173,85,0.15)', color: 'var(--orange)',
              border: '1px solid rgba(246,173,85,0.3)'
            }}>
              🔥 {data.calendar.streak}d streak
            </span>
          )}
          {contest.badge && (
            <span className="badge" style={{
              background: cb.bg, color: cb.color, border: `1px solid ${cb.border}`
            }}>
              ⭐ {contest.badge}
            </span>
          )}
          {profile.activeBadge?.displayName && (
            <span className="badge" style={{
              background: 'rgba(99,179,237,0.15)', color: 'var(--accent)',
              border: '1px solid rgba(99,179,237,0.3)'
            }}>
              🥇 {profile.activeBadge.displayName}
            </span>
          )}
          {profile.skills?.slice(0, 3).map(s => (
            <span key={s} className="badge" style={{
              background: 'var(--surface2)', color: 'var(--text2)',
              border: '1px solid var(--border)'
            }}>{s}</span>
          ))}
        </div>
      </div>
 
      {/* Quick stats */}
      <div style={{
        display: 'flex', gap: 32,
        borderLeft: '1px solid var(--border2)', paddingLeft: 28
      }}>
        {[
          { val: solved.total.toLocaleString(), lbl: 'Solved',  color: 'var(--green)' },
          { val: contest.rating || '—',         lbl: 'Rating',  color: 'var(--accent)' },
          { val: contest.topPercentage !== 'N/A' ? `Top ${contest.topPercentage}%` : '—',
                                                lbl: 'Percentile', color: 'var(--yellow)' },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color, lineHeight: 1
            }}>{val}</div>
            <div style={{
              fontSize: 10, color: 'var(--text3)', marginTop: 5,
              textTransform: 'uppercase', letterSpacing: '0.6px'
            }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}