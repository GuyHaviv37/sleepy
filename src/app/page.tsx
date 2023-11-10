import type { Metadata, NextPage } from "next";
import FlexibleContainer from "@/components/layout/FlexibleContainer";
import KofiButton from "@/features/kofi/KofiButton";
import LoginForm from "@/features/login-form";

export const metadata: Metadata = {
  title: 'Sleepy'
}

const Home: NextPage = () => {
  return (
    <main className="mx-auto flex flex-col items-center justify-center h-screen p-5 bg-primary w-screen">
      <FlexibleContainer>
        <section className="w-full h-1/2 md:w-1/2">
          <h1 className="text-xl md:text-2xl text-primary-text font-bold
            absolute top-5 left-3
            md:relative md:top-0 md:left-0 md:mb-3"
          >
            🏈 Sleepy
          </h1>
          <h3 className="text-3xl lg:text-5xl tracking-wide text-primary-text font-thin">
            Complete weekly summary of your sleeper leagues
          </h3>
        </section>
        <LoginForm />
      </FlexibleContainer>
      <KofiButton absolute />
    </main>
  );
};

export default Home;
