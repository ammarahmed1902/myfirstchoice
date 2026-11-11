import { Account } from "@/components/account";
export const metadata = {
  title: "Trade account & quotation history",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR BUSINESS, CONNECTED</span>
        <h1>Your trade account.</h1>
      </div>
      <section className="section pt-0">
        <Account />
      </section>
    </>
  );
}
