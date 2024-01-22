import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "@/components/AppLayout";
import { getAppProps } from "@/utils/getAppProps";

export default function TokenTopUp() {
  const handleClick = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
    });

    const json = await response.json();
    window.location.href = json.session.url;
  };

  return (
    <div>
      <h1>this is the token top-up page</h1>
      {/* <button className="btn" onClick={handleClick}> */}
      <button className="btn" disabled>
        Add tokens
      </button>
    </div>
  );
}

TokenTopUp.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props,
    };
  },
});
