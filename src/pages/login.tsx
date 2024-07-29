import { LoginModule } from "@modules/login";
import Head from "next/head";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login | ICS Dasboard</title>
      </Head>
      <LoginModule />
    </>
  );
};

export default LoginPage;
