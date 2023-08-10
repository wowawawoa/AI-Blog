import { AppLayout } from "@/components/AppLayout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function NewPost(props) {
  console.log("new post props", props);
  const handleClick = async () => {
    const response = await fetch("/api/generatePost", {
      method: "POST",
    });
    const json = await response.json();
    console.log("result", json);
  };

  return (
    <div>
      <h1>this is the new post page</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired();
