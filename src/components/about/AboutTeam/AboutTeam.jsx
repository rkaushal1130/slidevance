import React from 'react';
import t1 from '../../../assets/about/team-01-strategy.png';
import t2 from '../../../assets/about/team-02-design.png';
import t3 from '../../../assets/about/team-03-storytelling.png';
import t4 from '../../../assets/about/team-04-research.png';
import t5 from '../../../assets/about/team-05-detail.png';
import teamNote from '../../../assets/about/team-handwritten-note.png';
import styles from './AboutTeam.module.css';

const TEAM_MEMBERS = [
  {
    role: 'STRATEGY',
    description: 'Big picture thinking. Clear direction.',
    avatar: t1,
    alt: 'Strategy lead avatar'
  },
  {
    role: 'DESIGN',
    description: 'Turning ideas into visual experiences.',
    avatar: t2,
    alt: 'Design lead avatar'
  },
  {
    role: 'STORYTELLING',
    description: 'Because every message needs a journey.',
    avatar: t3,
    alt: 'Storytelling director avatar'
  },
  {
    role: 'RESEARCH',
    description: 'Real insights. Better solutions.',
    avatar: t4,
    alt: 'Research analyst avatar'
  },
  {
    role: 'DETAIL',
    description: 'Small things. Big difference.',
    avatar: t5,
    alt: 'Detail and QA specialist avatar'
  }
];

export default function AboutTeam() {
  return (
    <section id="the-team" className={styles.teamSection} aria-label="The Slidevance Team">
      <div className={`container ${styles.container}`}>
        {/* Left Column: Team Philosophy */}
        <div className={`${styles.introCol} reveal-on-scroll`}>
          <div className={styles.tagWrap}>
            <span className={styles.sectionTag}>THE TEAM</span>
            <span className={styles.tagLine} />
          </div>

          <h2 className={styles.heading}>
            Different minds.<br />
            Same goal.
          </h2>

          <p className={styles.description}>
            We’re a small, passionate team of designers, thinkers and problem-solvers who care about clarity,
            creativity and real-world impact.
          </p>

          <div className={styles.handwrittenWrap}>
            <img
              src={teamNote}
              alt="Ideas look better in good company"
              className={styles.handwrittenImg}
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: 5 Team Cards */}
        <div className={`${styles.cardsCol} reveal-on-scroll`}>
          <div className={styles.teamGrid}>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.role} className={styles.memberCard}>
                <div className={styles.avatarBox}>
                  <img
                    src={member.avatar}
                    alt={member.alt}
                    className={styles.avatarImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.roleTitle}>{member.role}</h3>
                  <p className={styles.roleDesc}>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
