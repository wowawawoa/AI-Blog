import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '@/components/AppLayout';

export default function Post() {
  return (
    <div>
      <h1>this is the post page</h1>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired();