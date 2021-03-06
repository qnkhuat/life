import Layout from "../components/Layout";
import Link from "next/link";

export default function About() {
  return (
    <Layout>
      <div className="w-full h-full container my-8">
        <article className="prose">
          <h1>About</h1>
          <h2>What <span className="underline">The Life Book</span> is?</h2>
          <p>We'd like our users to think of <span className="underline">The Life Book</span> as a personal storybook that keeps their memorable stories:</p>
          <ul>
            <li>The stunning places they have been to</li>
            <li>Achievements they're proud of</li>
            <li>Awesome people they have met</li>
            <li>Experiences they will never forget</li>
            <li>Failures they encountered but have taught them life lessons</li>
            <li>...</li>
            <li>And also, their goals.</li>
          </ul>

          <h2>What <span className="underline">The Life Book</span> is NOT?</h2>
          <p>A social network: there will be no interactions between users or any kind of notifications to attract users spending too much time on platform.</p>

          <h2>Why we build this?</h2>
          <p>To visualize and put life in perspective</p>
          <p>We believe none of us want to waste our time, but sometimes we just forget how precious and short life is.</p>
          <p>That's why we hope <span className="underline">The Life Book</span> could help all of us look at our life from the big picture, so we have a better sense of what we had done in the past, and how much we have left.</p>
          <p>From there we can treasure the past, learn from mistakes, plan for the future, and live a life we are proud of.</p>
        </article>

      </div>
    </Layout>
  );
}
