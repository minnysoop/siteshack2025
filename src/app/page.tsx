import Dashboard from "@/components/dashboard";
import Header from "@/components/header/header";
import SignIn from "@/components/header/signin";

export default function Home() {
  return (
    <>
      <div className="w-full bg-black rounded p-3 flex justify-evenly mb-2" >
        <div><Header /></div>
        <div><SignIn /></div>
      </div>
      <Dashboard />
    </>
  );
}
