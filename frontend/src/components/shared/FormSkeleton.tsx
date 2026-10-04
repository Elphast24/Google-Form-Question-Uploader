import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

const CARD_COUNT = 3;

const FormSkeleton = () => {
  const { reduceMotion } = useGSAPAnimation();

  return (
    <main className="page-maritime library-page">
      <span className="sr-only">Loading your forms…</span>
      <div className="library-shell">
        <section className="library-hero">
          <div className="library-hero-copy">
            <span className="skeleton-shimmer skeleton-line skeleton-breadcrumb" />
            <span className="skeleton-shimmer skeleton-line skeleton-hero-title" />
            <span className="skeleton-shimmer skeleton-line skeleton-hero-subtitle" />
          </div>
          <div className="library-hero-aside">
            <span className="skeleton-shimmer skeleton-block skeleton-count" />
            <span className="skeleton-shimmer skeleton-line skeleton-count-label" />
            <span className="skeleton-shimmer skeleton-block skeleton-count-rule" />
            <span className="skeleton-shimmer skeleton-line skeleton-hero-btn" />
          </div>
        </section>

        <section className="library-listing">
          <div className="library-listing-head">
            <div>
              <span className="skeleton-shimmer skeleton-line skeleton-section-label" />
              <span className="skeleton-shimmer skeleton-line skeleton-listing-title" />
            </div>
          </div>

          <div className="library-grid">
            {Array.from({ length: CARD_COUNT }).map((_item, index) => (
              <article
                className="skeleton-card"
                key={`skeleton-${index}`}
                style={reduceMotion ? undefined : { animationDelay: `${index * 90}ms` }}
              >
                <div className="skeleton-card-top">
                  <span className="skeleton-shimmer skeleton-block skeleton-card-icon" />
                  <span className="skeleton-shimmer skeleton-line skeleton-card-date" />
                </div>
                <div className="skeleton-card-copy">
                  <span className="skeleton-shimmer skeleton-line" />
                  <span className="skeleton-shimmer skeleton-line" />
                  <span className="skeleton-shimmer skeleton-line" />
                  <span className="skeleton-shimmer skeleton-line" />
                </div>
                <div className="skeleton-card-actions">
                  <div className="skeleton-action-row">
                    <div className="skeleton-action-copy">
                      <span className="skeleton-shimmer skeleton-line" />
                      <span className="skeleton-shimmer skeleton-line" />
                    </div>
                    <span className="skeleton-shimmer skeleton-block skeleton-action-btn" />
                    <span className="skeleton-shimmer skeleton-block skeleton-action-btn" />
                  </div>
                  <div className="skeleton-action-row">
                    <div className="skeleton-action-copy">
                      <span className="skeleton-shimmer skeleton-line" />
                      <span className="skeleton-shimmer skeleton-line" />
                    </div>
                    <span className="skeleton-shimmer skeleton-block skeleton-action-btn" />
                    <span className="skeleton-shimmer skeleton-block skeleton-action-btn" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FormSkeleton;
