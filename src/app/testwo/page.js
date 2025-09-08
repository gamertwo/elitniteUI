'use client';

import { useState, useEffect } from 'react';
import styles from './PerformanceBroll.module.css';

const PerformanceBroll = () => {
  const [currentMetric, setCurrentMetric] = useState(0);

  const metrics = [
    {
      id: 'speed',
      title: 'Page Load Speed',
      subtitle: 'First impressions matter',
      custom: {
        value: '0.8s',
        score: 98,
        label: 'Lightning Fast',
        details: [
          'Optimized React components',
          'Code splitting & lazy loading',
          'Compressed assets',
          'CDN optimization'
        ],
        userImpact: '+127% conversion rate',
        animation: 'fastLoad'
      },
      template: {
        value: '4.2s',
        score: 23,
        label: 'Slow & Bloated',
        details: [
          'Heavy template files',
          'Unused CSS/JS',
          'No optimization',
          'Generic hosting'
        ],
        userImpact: '67% users bounce',
        animation: 'slowLoad'
      }
    },
    {
      id: 'seo',
      title: 'SEO Performance',
      subtitle: 'Google ranking factors',
      custom: {
        value: '96/100',
        score: 96,
        label: 'SEO Optimized',
        details: [
          'Perfect semantic HTML',
          'Custom meta optimization',
          'Schema markup',
          'Core Web Vitals'
        ],
        userImpact: '340% more organic traffic',
        animation: 'seoGrowth'
      },
      template: {
        value: '34/100',
        score: 34,
        label: 'Poor SEO',
        details: [
          'Generic meta tags',
          'Duplicate content',
          'Slow loading',
          'No structured data'
        ],
        userImpact: 'Buried on page 5+',
        animation: 'seoDecline'
      }
    },
    {
      id: 'mobile',
      title: 'Mobile Experience',
      subtitle: '60% of traffic is mobile',
      custom: {
        value: '100%',
        score: 100,
        label: 'Mobile First',
        details: [
          'Responsive breakpoints',
          'Touch-optimized UI',
          'Progressive Web App',
          'Offline functionality'
        ],
        userImpact: '+89% mobile conversions',
        animation: 'mobileOptimal'
      },
      template: {
        value: '31%',
        score: 31,
        label: 'Mobile Broken',
        details: [
          'Desktop-only design',
          'Tiny touch targets',
          'Horizontal scrolling',
          'Slow on mobile'
        ],
        userImpact: '78% mobile users leave',
        animation: 'mobileBroken'
      }
    },
    {
      id: 'security',
      title: 'Security Score',
      subtitle: 'Protect your business',
      custom: {
        value: 'A+',
        score: 98,
        label: 'Enterprise Security',
        details: [
          'Regular security updates',
          'Custom authentication',
          'SSL/TLS optimization',
          'Security headers'
        ],
        userImpact: 'Zero security incidents',
        animation: 'secureShield'
      },
      template: {
        value: 'D-',
        score: 18,
        label: 'Vulnerable',
        details: [
          'Outdated dependencies',
          'Common exploits',
          'Weak authentication',
          'No security monitoring'
        ],
        userImpact: 'High risk of breaches',
        animation: 'securityRisk'
      }
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      subtitle: 'Turn visitors into customers',
      custom: {
        value: '8.4%',
        score: 84,
        label: 'Conversion Optimized',
        details: [
          'A/B tested elements',
          'Psychological triggers',
          'Clear call-to-actions',
          'Frictionless UX'
        ],
        userImpact: '+312% revenue increase',
        animation: 'conversionUp'
      },
      template: {
        value: '1.2%',
        score: 12,
        label: 'Poor Performance',
        details: [
          'Generic design',
          'Confusing navigation',
          'Weak CTAs',
          'Trust issues'
        ],
        userImpact: 'Lost revenue daily',
        animation: 'conversionDown'
      }
    }
  ];

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  const nextMetric = () => {
    setCurrentMetric((prev) => (prev + 1) % metrics.length);
  };

  const prevMetric = () => {
    setCurrentMetric((prev) => (prev - 1 + metrics.length) % metrics.length);
  };

  const currentData = metrics[currentMetric];

  const MetricCard = ({ data, type }) => (
    <div className={`${styles.metricCard} ${type === 'custom' ? styles.customCard : styles.templateCard}`}>
      <div className={styles.cardHeader}>
        <div className={`${styles.badge} ${type === 'custom' ? styles.customBadge : styles.templateBadge}`}>
          {type === 'custom' ? 'CUSTOM BUILT' : 'TEMPLATE'}
        </div>
        <div className={styles.scoreContainer}>
          <div className={`${styles.scoreCircle} ${styles[data.animation]}`}>
            <div className={styles.scoreValue}>{data.value}</div>
            <div className={styles.scoreLabel}>{data.label}</div>
          </div>
          <div className={`${styles.progressBar} ${type}`}>
            <div 
              className={styles.progress} 
              style={{ width: `${data.score}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.detailsList}>
          {data.details.map((detail, index) => (
            <div key={index} className={styles.detailItem}>
              <span className={type === 'custom' ? styles.checkIcon : styles.crossIcon}>
                {type === 'custom' ? '✓' : '✗'}
              </span>
              {detail}
            </div>
          ))}
        </div>

        <div className={`${styles.impact} ${type === 'custom' ? styles.positiveImpact : styles.negativeImpact}`}>
          <div className={styles.impactIcon}>
            {type === 'custom' ? '📈' : '📉'}
          </div>
          <div className={styles.impactText}>{data.userImpact}</div>
        </div>
      </div>
    </div>
  );

  const LiveDemo = () => {
    if (currentData.id === 'speed') {
      return (
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Live Loading Comparison</div>
          <div className={styles.loadingDemo}>
            <div className={styles.customDemo}>
              <div className={styles.demoLabel}>Custom Site</div>
              <div className={`${styles.loadingBar} ${styles.fastLoading}`}>
                <div className={styles.loadingProgress} />
              </div>
              <div className={styles.loadTime}>0.8s ⚡</div>
            </div>
            <div className={styles.templateDemo}>
              <div className={styles.demoLabel}>Template Site</div>
              <div className={`${styles.loadingBar} ${styles.slowLoading}`}>
                <div className={styles.loadingProgress} />
              </div>
              <div className={styles.loadTime}>4.2s 🐌</div>
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'seo') {
      return (
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Google Search Results</div>
          <div className={styles.searchResults}>
            <div className={styles.searchResult}>
              <div className={styles.resultPosition}>#1</div>
              <div className={styles.resultTitle}>Your Custom Website</div>
              <div className={styles.resultUrl}>yoursite.com</div>
              <div className={styles.resultSnippet}>Perfectly optimized meta description...</div>
            </div>
            <div className={styles.searchGap}>...</div>
            <div className={styles.searchResult + ' ' + styles.buried}>
              <div className={styles.resultPosition}>#47</div>
              <div className={styles.resultTitle}>Template Website</div>
              <div className={styles.resultUrl}>template-site.com</div>
              <div className={styles.resultSnippet}>Generic template description...</div>
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'mobile') {
      return (
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Mobile Experience</div>
          <div className={styles.mobileDemo}>
            <div className={styles.phoneFrame + ' ' + styles.customPhone}>
              <div className={styles.phoneScreen}>
                <div className={styles.mobileHeader}>Perfect Mobile</div>
                <div className={styles.mobileContent}>
                  <div className={styles.mobileButton}>Large Touch Targets</div>
                  <div className={styles.mobileText}>Readable text size</div>
                </div>
              </div>
            </div>
            <div className={styles.phoneFrame + ' ' + styles.templatePhone}>
              <div className={styles.phoneScreen}>
                <div className={styles.mobileHeader + ' ' + styles.brokenHeader}>Broken Mobile</div>
                <div className={styles.mobileContent + ' ' + styles.brokenContent}>
                  <div className={styles.mobileButton + ' ' + styles.tinyButton}>Tiny buttons</div>
                  <div className={styles.mobileText + ' ' + styles.tinyText}>Unreadable text</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'security') {
      return (
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Security Monitor</div>
          <div className={styles.securityDemo}>
            <div className={styles.securityPanel + ' ' + styles.secure}>
              <div className={styles.securityIcon}>🛡️</div>
              <div className={styles.securityStatus}>SECURE</div>
              <div className={styles.securityDetails}>
                <div className={styles.securityItem}>SSL: ✓ A+ Rating</div>
                <div className={styles.securityItem}>Updates: ✓ Current</div>
                <div className={styles.securityItem}>Threats: ✓ 0 Detected</div>
              </div>
            </div>
            <div className={styles.securityPanel + ' ' + styles.vulnerable}>
              <div className={styles.securityIcon}>⚠️</div>
              <div className={styles.securityStatus}>VULNERABLE</div>
              <div className={styles.securityDetails}>
                <div className={styles.securityItem}>SSL: ✗ F Rating</div>
                <div className={styles.securityItem}>Updates: ✗ 247 days old</div>
                <div className={styles.securityItem}>Threats: ✗ 15 Critical</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentData.id === 'conversion') {
      return (
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Revenue Comparison</div>
          <div className={styles.revenueChart}>
            <div className={styles.chartBars}>
              <div className={styles.customBar}>
                <div className={styles.barValue}>$84,000</div>
                <div className={styles.barLabel}>Custom Site</div>
              </div>
              <div className={styles.templateBar}>
                <div className={styles.barValue}>$12,000</div>
                <div className={styles.barLabel}>Template Site</div>
              </div>
            </div>
            <div className={styles.chartFooter}>Monthly Revenue (1000 visitors)</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Performance Impact Analysis</h1>
          <p>Real metrics that affect your bottom line</p>
        </div>
        <div className={styles.navigation}>
          <button onClick={prevMetric} className={styles.navButton}>
            ←
          </button>
          <div className={styles.indicator}>
            <span className={styles.currentStep}>{currentMetric + 1}</span>
            <span className={styles.totalSteps}>/ {metrics.length}</span>
            <div className={styles.stepTitle}>{currentData.title}</div>
          </div>
          <button onClick={nextMetric} className={styles.navButton}>
            →
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.metricsSection}>
          <div className={styles.sectionTitle}>
            <h2>{currentData.title}</h2>
            <p>{currentData.subtitle}</p>
          </div>
          
          <div className={styles.comparison}>
            <MetricCard data={currentData.custom} type="custom" />
            <MetricCard data={currentData.template} type="template" />
          </div>
        </div>

        <div className={styles.demoSection}>
          <LiveDemo />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.dots}>
          {metrics.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentMetric ? styles.activeDot : ''}`}
              onClick={() => setCurrentMetric(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceBroll;