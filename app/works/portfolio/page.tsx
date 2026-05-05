'use client';

import { useEffect, useRef } from 'react';
import type { Metadata } from 'next';
import styles from './portfolio.module.css';

// NOTE: Because this file uses 'use client' for the scroll-reveal effect,
// metadata must live in a separate `layout.tsx` for this route, OR you can
// remove 'use client' and move the IntersectionObserver into a small client
// child component. The simplest path: keep this client and add metadata
// via a route-level layout. See the instructions message for details.

export default function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealIn);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    root.querySelectorAll(`.${styles.reveal}`).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      {/* === NAV === */}
      <nav className={styles.nav}>
        <div className={styles.wrap}>
          <a href="#top" className={styles.navMark}>
            jas<span>.</span>
          </a>
          <div className={styles.navLinks}>
            <a href="#featured">3D / Music</a>
            <a href="#music">Music</a>
            <a href="#engineering">Engineering</a>
            <a href="#film">Film</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className={styles.hero} id="top">
        <div className={styles.wrap}>
          <div className={styles.heroEyebrow}>
            Portfolio · 2026
            <span className={styles.liveDot}></span>
            Available
          </div>
          <span className={styles.heroName}>Palleti Jashwanth — &ldquo;Jas&rdquo;</span>
          <h1 className={styles.heroTitle}>
            Creative<br />
            Technologist <em>at the<br />seam</em> of music,<br />
            film, 3D &amp; AI.
          </h1>
          <p className={styles.heroSub}>
            I compose, perform, model in Blender, direct short films, and ship production AI
            software. <strong>Most candidates have one of these.</strong> The work below is the
            proof.
          </p>
          <div className={styles.heroMeta}>
            <span><strong>Based</strong>Toms River, NJ</span>
            <span><strong>Open to</strong>Relocation, hybrid, 25% travel</span>
            <span><strong>Years engineering</strong>5+</span>
          </div>
        </div>
      </section>

      {/* === FEATURED === */}
      <section className={styles.featured} id="featured">
        <div className={styles.wrap}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.num}>01 ·</span> The Single Clearest Artifact
          </div>
          <h2 className={styles.sectionTitle}>
            An interactive 3D music video, <em>built end-to-end alone.</em>
          </h2>

          <a
            href="https://jashtechno.com/coffee-shop"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div className={`${styles.featuredCard} ${styles.reveal}`}>
              <div className={styles.featuredTag}>Featured · Live</div>
              <div className={styles.featuredGrid}>
                <div className={styles.featuredVisual}>
                  <div className={styles.floatingBlocks}>
                    <div className={`${styles.block} ${styles.b1}`}></div>
                    <div className={`${styles.block} ${styles.b2}`}></div>
                    <div className={`${styles.block} ${styles.b3}`}></div>
                    <div className={`${styles.block} ${styles.b4}`}></div>
                  </div>
                  <div className={styles.featuredVisualLabel}>
                    <div className={styles.playCircle}></div>
                    <p>Open jashtechno.com/coffee-shop</p>
                  </div>
                </div>
                <div className={styles.featuredContent}>
                  <h2>3D Coffee Shop</h2>
                  <p>
                    I composed and produced the music. I performed in it. Every object — chairs,
                    lamps, cups, the whole scene — modeled and animated from scratch in{' '}
                    <strong style={{ color: 'var(--accent)' }}>Blender</strong>. Then I integrated
                    the assets onto a Three.js / WebGL web app and made the whole experience
                    playable. Users interact with the music and the scene together.
                  </p>
                  <p>One person. One pipeline. Real shipped work.</p>
                  <div className={styles.featuredPipeline}>
                    <span>Composition</span>
                    <span>Performance</span>
                    <span>Blender</span>
                    <span>Three.js</span>
                    <span>WebGL</span>
                    <span>Interactive</span>
                  </div>
                  <span className={styles.featuredCta}>Open the experience</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* === MUSIC === */}
      <section className={styles.section} id="music">
        <div className={styles.wrap}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.num}>02 ·</span> Music
          </div>
          <h2 className={styles.sectionTitle}>
            Composer, lyricist, <em>music director.</em>
          </h2>

          <div className={styles.musicGrid}>
            <div className={`${styles.musicCard} ${styles.reveal}`}>
              <div className={styles.musicThumb}>
                <iframe
                  src="https://www.youtube.com/embed/w4PkfqfRdaE"
                  title="Web series composition"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className={styles.musicMeta}>
                <div className={styles.role}>Music Director · Web Series</div>
                <h3>Indian Web Series Score</h3>
                <p>
                  Music direction for an Indian web series — composition, song direction, and
                  audio production decisions across episodes.
                </p>
              </div>
            </div>

            <div className={`${styles.musicCard} ${styles.reveal}`}>
              <div className={styles.musicThumb}>
                <iframe
                  src="https://www.youtube.com/embed/QwjZKPfB_TA"
                  title="Original composition 1"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className={styles.musicMeta}>
                <div className={styles.role}>Original · Composition</div>
                <h3>Original Work I</h3>
                <p>Independent composition and production. Mixed and mastered solo.</p>
              </div>
            </div>

            <div className={`${styles.musicCard} ${styles.reveal}`}>
              <div className={styles.musicThumb}>
                <iframe
                  src="https://www.youtube.com/embed/j4PbeGBqhac"
                  title="Original composition 2"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className={styles.musicMeta}>
                <div className={styles.role}>Original · Composition</div>
                <h3>Original Work II</h3>
                <p>Independent composition and production. Mixed and mastered solo.</p>
              </div>
            </div>
          </div>

          <p className={`${styles.musicContext} ${styles.reveal}`}>
            I&apos;m a <strong>music composer, lyricist, and audio engineer</strong> — I mix and
            master my own productions. The reason this matters in software-and-AI contexts: I
            know what audio post sounds like when it&apos;s right, what a director cares about in
            a recording session, and how scoring decisions interact with picture edit.
          </p>
        </div>
      </section>

      {/* === ENGINEERING === */}
      <section className={styles.section} id="engineering">
        <div className={styles.wrap}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.num}>03 ·</span> Software &amp; AI Engineering
          </div>
          <h2 className={styles.sectionTitle}>
            Production AI, <em>shipped to paying customers.</em>
          </h2>

          <div className={styles.workList}>
            <div className={`${styles.workRow} ${styles.reveal}`}>
              <div className={styles.workNum}>— 01</div>
              <div className={styles.workInfo}>
                <h3 className={styles.workName}>
                  PropFlow <em>— AI document intelligence</em>
                </h3>
                <p className={styles.workDesc}>
                  Production AI platform deployed to a paying customer running a 300+ property
                  multi-entity portfolio.{' '}
                  <strong style={{ color: 'var(--ink)' }}>73 versions</strong> of customer-driven
                  iteration over the past year. Multi-API fallback chains, structural validators,
                  audit logging with replay.
                </p>
                <div className={styles.workStack}>
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Python</span>
                  <span>FastAPI</span>
                  <span>PostgreSQL</span>
                  <span>AWS</span>
                  <span>Anthropic Claude</span>
                </div>
              </div>
              <a
                href="https://youtu.be/8PYxVx3SHuQ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.workLink}
              >
                2-min Demo →
              </a>
            </div>

            <div className={`${styles.workRow} ${styles.reveal}`}>
              <div className={styles.workNum}>— 02</div>
              <div className={styles.workInfo}>
                <h3 className={styles.workName}>
                  Friday Rent <em>— 9-stage agentic AI</em>
                </h3>
                <p className={styles.workDesc}>
                  Autonomous lead-to-call workflow: Gmail → OpenAI → web scraping → OpenAI →
                  Google Calendar → Vapi → Twilio voice agent. Two sequential LLM calls with
                  structured JSON parsing, fuzzy address normalization, end-to-end orchestration.
                  Same shape as multi-node generative video pipelines.
                </p>
                <div className={styles.workStack}>
                  <span>OpenAI</span>
                  <span>Vapi</span>
                  <span>Twilio</span>
                  <span>Google Calendar API</span>
                  <span>Make.com</span>
                  <span>Webhooks</span>
                </div>
              </div>
              <a
                href="https://fridayrent.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.workLink}
              >
                fridayrent.com →
              </a>
            </div>

            <div className={`${styles.workRow} ${styles.reveal}`}>
              <div className={styles.workNum}>— 03</div>
              <div className={styles.workInfo}>
                <h3 className={styles.workName}>
                  Insight360 <em>— real-time analytics</em>
                </h3>
                <p className={styles.workDesc}>
                  Real-time analytics dashboard with React, WebSockets, complex chart UIs, full
                  WCAG-compliant component library, end-to-end CI/CD with Jest and Cypress.
                </p>
                <div className={styles.workStack}>
                  <span>React</span>
                  <span>WebSockets</span>
                  <span>Node.js</span>
                  <span>WCAG 2.1 AA</span>
                </div>
              </div>
              <a
                href="https://jashtechno.com/works"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.workLink}
              >
                View →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === FILM === */}
      <section className={styles.section} id="film">
        <div className={styles.wrap}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.num}>04 ·</span> Film &amp; Video Production
          </div>
          <h2 className={styles.sectionTitle}>
            I&apos;ve worked <em>every seat</em> in the linear pipeline.
          </h2>

          <div className={`${styles.filmBlock} ${styles.reveal}`}>
            <p>
              I direct, shoot, edit, color grade in <strong>DaVinci Resolve</strong>, and finish
              my own short films — from script and storyboard through final render.
            </p>
            <p>
              NLE editing, sound design, color, final delivery. Lived experience of what artists
              and directors actually care about during production — where AI tools meaningfully
              help vs. where they get in the way.
            </p>
            <p>
              Which means when I look at a generative video model dropping into a partner&apos;s
              existing After Effects / Premiere / Houdini / Nuke pipeline, I&apos;m not theorizing
              about where the friction lives. I&apos;ve been the person staring at a render queue
              waiting for a take that didn&apos;t quite work.
            </p>
            <div className={styles.filmTools}>
              <span>DaVinci Resolve</span>
              <span>Adobe Premiere</span>
              <span>Direction</span>
              <span>Color</span>
              <span>Sound Design</span>
              <span>Final Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* === ABOUT / CONTACT === */}
      <section className={styles.section} id="contact">
        <div className={styles.wrap}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.num}>05 ·</span> About / Contact
          </div>
          <h2 className={styles.sectionTitle}>
            Let&apos;s <em>talk.</em>
          </h2>

          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutText} ${styles.reveal}`}>
              <p>
                I&apos;m <strong>Palleti Jashwanth</strong> — Jas. I run JashTechno, my
                independent software studio, alongside a senior frontend contract at Verizon
                (TypeScript, React, Next.js — led an internal portal rebuild that dropped page
                loads ~30%).
              </p>
              <p>
                Before Verizon, I spent <strong>3+ years</strong> at State Street Corporation
                building real-time, data-heavy financial web applications. M.S. Computer Science
                from Rowan University (May 2025). 5+ years total in production software
                engineering, plus the creative work above.
              </p>
              <p>
                The combination of <strong>creative production craft</strong> (music, Blender,
                film) and <strong>production-grade AI engineering</strong> (LLM systems with
                paying customers, multi-step agentic pipelines, AWS) is what I&apos;m building
                toward — and the kind of role I&apos;m looking for.
              </p>
              <p className={styles.aboutFooter}>
                AI-native daily workflow: Cursor · Claude Code · ComfyUI / Stable Diffusion · MCPs
              </p>
            </div>

            <div className={`${styles.contactCard} ${styles.reveal}`}>
              <h3>Get in touch</h3>
              <div className={styles.available}>
                <span className={styles.dot}></span>Available now
              </div>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.label}>Email</span>
                  <a href="mailto:jashwanthpalleti@gmail.com">jashwanthpalleti@gmail.com</a>
                </li>
                <li>
                  <span className={styles.label}>Studio</span>
                  <a href="https://jashtechno.com" target="_blank" rel="noopener noreferrer">
                    jashtechno.com
                  </a>
                </li>
                <li>
                  <span className={styles.label}>GitHub</span>
                  <a
                    href="https://github.com/jashwanthpalleti"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/jashwanthpalleti
                  </a>
                </li>
                <li>
                  <span className={styles.label}>3D · Music</span>
                  <a
                    href="https://jashtechno.com/coffee-shop"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    jashtechno.com/coffee-shop
                  </a>
                </li>
                <li>
                  <span className={styles.label}>Friday Rent</span>
                  <a href="tel:+18882606707">+1 888 260 6707</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <p>
            Designed &amp; built by Jas <span>·</span> 2026 <span>·</span> One file, no frameworks
          </p>
        </div>
      </footer>
    </div>
  );
}
