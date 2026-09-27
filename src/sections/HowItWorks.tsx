const STEPS = [
  {
    title: "Tell us who you are",
    body: "Your name and 10-digit mobile number. That's the whole form — no OTP, no sign-up.",
  },
  {
    title: "Get your code instantly",
    body: "A code like MORROW-7F2K appears right on this screen. Copy it or take a screenshot.",
  },
  {
    title: "Show it at the counter",
    body: "On your next visit, show the code before you pay and ₹150 comes off your bill.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="section bg-paper" data-steps>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="section-kicker">How it works</p>
        <h2 id="how-title" className="section-title max-w-[16ch]" data-split>
          Three steps. About ten seconds.
        </h2>

        <div className="steps">
          <div className="steps-rail" aria-hidden="true">
            <div className="steps-progress" data-steps-progress />
          </div>
          <ol className="steps-list">
            {STEPS.map((step, index) => (
              <li key={step.title} className="step" data-reveal>
                <span className="step-badge" aria-hidden="true">
                  <span className="step-badge-fill" data-step-fill />
                  <span className="step-badge-num">{index + 1}</span>
                </span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
