import Layout from "../components/Layout";
import Link from "next/link";

export default function About() {
  return (
    <Layout>
      <div className="w-full h-full container text-center mt-4">
        <p>Sorry, This page isn't available.</p>
        <p>The link you followed may be broken, or the page may have been removed.</p>
        <Link href={`/`} passHref>
          <a className="font-bold text-lg font-underline">Go back to Home Page</a>
        </Link>
      </div>
    </Layout>
  );
}
