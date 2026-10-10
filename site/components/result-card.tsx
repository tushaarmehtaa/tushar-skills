import type { SkillResult } from "@/lib/profiles";

/** "You asked → what you got", designed for the kind of result a skill produces. */
export function ResultCard({
  slug,
  result,
  images,
  still,
}: {
  slug: string;
  result: SkillResult;
  images?: { before: string; after: string; wide?: boolean; alt?: { before: string; after: string } };
  still?: string;
}) {
  const phone = images?.before.includes("-mobile");
  const [w, h] = phone ? [600, 1298] : images?.wide ? [1200, 675] : [1200, 833];
  return (
    <div className="result">
      <p className="ask">
        <span>You</span>
        {result.ask}
      </p>

      {result.type === "rewrite" && result.rewrite ? (
        <div className="result-body">
          <p className="result-headline">{result.headline}</p>
          <div className="rewrite">
            <div className="rewrite-side rewrite-before">
              <span className="result-eyebrow">{result.rewrite.beforeTitle ?? "Before"}</span>
              <p>{result.rewrite.before}</p>
            </div>
            <svg className="rewrite-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <div className="rewrite-side rewrite-after">
              <span className="result-eyebrow">{result.rewrite.afterTitle ?? `After /${slug}`}</span>
              <p>{result.rewrite.after}</p>
            </div>
          </div>
          {result.rewrite.cut && result.rewrite.cut.length > 0 && (
            <p className="cut">
              <span>Cut</span>
              {result.rewrite.cut.map((phrase) => (
                <s key={phrase}>{phrase}</s>
              ))}
            </p>
          )}
          {result.rewrite.note && <p className="result-note">{result.rewrite.note}</p>}
        </div>
      ) : (
        <div className="result-card">
          {result.type === "verdict" && result.verdict ? (
            <div className="verdict">
              <span className="verdict-badge" data-tone={result.verdict.tone}>
                {result.verdict.label}
              </span>
              <p className="result-headline">{result.headline}</p>
            </div>
          ) : (
            <div>
              <span className="result-eyebrow">{result.type === "built" ? "What it built" : "What it found"}</span>
              <p className="result-headline">{result.headline}</p>
            </div>
          )}

          {result.type === "screenshots" && images && (
            <figure className={phone ? "shots phone" : images.wide ? "shots wide" : "shots"}>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images.before} alt={images.alt?.before ?? `Sample project before /${slug}`} width={w} height={h} loading="lazy" />
                <figcaption>Before</figcaption>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images.after} alt={images.alt?.after ?? `Sample project after one /${slug} run`} width={w} height={h} loading="lazy" />
                <figcaption className="strong">After</figcaption>
              </div>
            </figure>
          )}

          {still && (
            <figure className="still">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={still} alt={`A frame from the video /${slug} rendered`} width={1200} height={676} loading="lazy" />
            </figure>
          )}

          {result.bars && (
            <div className="bars">
              <span className="bars-label">{result.bars.label}</span>
              {(() => {
                const max = Math.max(...result.bars.rows.map((r) => r.value)) || 1;
                return result.bars.rows.map((row) => (
                  <div key={row.label} className="bar-row" data-tone={row.tone}>
                    <span className="bar-name">{row.label}</span>
                    <span className="bar-track" aria-hidden="true">
                      <span style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }} />
                    </span>
                    <span className="bar-value">{row.display}</span>
                  </div>
                ));
              })()}
            </div>
          )}

          {result.stats && (
            <dl className="stats">
              {result.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {result.reasons && (
            <ol className="reasons">
              {result.reasons.map((reason, i) => (
                <li key={reason.title} data-tone={reason.tone}>
                  <span className="reason-mark" aria-hidden="true">
                    {reason.tone === "good" ? "✓" : i + 1}
                  </span>
                  <span>
                    <strong>{reason.title}</strong>
                    {reason.text && <span>{reason.text}</span>}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {result.groups && (
            <div className="groups">
              {result.groups.map((group) => (
                <div key={group.title} className="group-card">
                  <span className="group-title">{group.title}</span>
                  <dl>
                    {group.rows.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {result.notes && (
            <div className="notes">
              {result.notes.map((note) => (
                <div key={note.title} data-tone={note.tone}>
                  <strong>{note.title}</strong>
                  <span>{note.text}</span>
                </div>
              ))}
            </div>
          )}

          {result.chips && (
            <p className="chips">
              {result.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
