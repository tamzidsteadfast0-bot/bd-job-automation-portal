const jobs = [
  { title: "Management Trainee Officer", company: "Example Bank PLC", type: "Private", location: "Dhaka", deadline: "Verify on source", match: 88, tags: ["Graduate", "Banking", "Full-time"] },
  { title: "Field Officer", company: "Example Development Foundation", type: "NGO", location: "Bangladesh", deadline: "Verify on source", match: 82, tags: ["Field work", "Operations"] },
  { title: "Customer Service Executive", company: "Example Logistics Ltd.", type: "Private", location: "Gazipur", deadline: "Verify on source", match: 79, tags: ["Customer care", "Logistics"] },
  { title: "Office / Administrative Assistant", company: "Example Public Institution", type: "Government", location: "As stated in circular", deadline: "Verify on source", match: 71, tags: ["Official circular", "Administration"] }
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">BD <span>JobPilot</span></div>
        <div className="pill">MVP Preview · Sample data only</div>
      </header>
      <section className="hero">
        <div>
          <h1>Your next career move, in one place.</h1>
          <p>বাংলাদেশের সরকারি ও বেসরকারি চাকরি খুঁজুন, CV অনুযায়ী ম্যাচ দেখুন এবং আবেদন পাঠানোর আগে নিজের অনুমোদন দিন।</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20}}>
            <a className="btn" href="#jobs">Explore jobs</a>
            <a className="btn secondary" href="#workflow">How it works</a>
          </div>
        </div>
        <div className="heroMark">⌕</div>
      </section>

      <section className="stats">
        <div className="stat"><small>Jobs collected</small><strong>—</strong><p className="muted">Connect approved sources</p></div>
        <div className="stat"><small>CV matches</small><strong>—</strong><p className="muted">Upload CV to calculate</p></div>
        <div className="stat"><small>Pending approval</small><strong>—</strong><p className="muted">Review before sending</p></div>
        <div className="stat"><small>Applications sent</small><strong>—</strong><p className="muted">Gmail OAuth required</p></div>
      </section>

      <div className="sectionTitle" id="jobs">
        <h2>Job discovery preview</h2><span className="muted">Illustrative cards · not live vacancies</span>
      </div>
      <section className="jobs">
        {jobs.map((job) => <article className="job" key={job.title}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}>
            <span className="tag">{job.type}</span><span className="muted">Potential match: {job.match}%*</span>
          </div>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p className="muted">{job.location} · Deadline: {job.deadline}</p>
          <div className="tags">{job.tags.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div>
          <button className="btn secondary" type="button" disabled title="Live data is not connected yet">Connect job sources first</button>
        </article>)}
      </section>

      <div className="sectionTitle" id="workflow"><h2>Approval-first workflow</h2></div>
      <section className="workflow">
        <div className="step"><span className="tag">01 · Discover</span><b>Collect and deduplicate</b><p className="muted">Pull permitted job data and retain the original source link.</p></div>
        <div className="step"><span className="tag">02 · Match</span><b>Compare with your CV</b><p className="muted">Evaluate skills, education, experience, location and deadlines.</p></div>
        <div className="step"><span className="tag">03 · Approve</span><b>Review before sending</b><p className="muted">Inspect recipient, subject, email body and CV before Gmail sends anything.</p></div>
      </section>
      <p className="footer">MVP scaffold only. No account, live job feed, CV upload or email sending is active in this preview.</p>
    </main>
  );
}
