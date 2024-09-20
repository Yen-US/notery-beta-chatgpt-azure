import Footer from "@/components/footer";
import NavbarNoteParentComponent from "@/components/navbar-note";
import { getServerSession } from "next-auth";


export default async function Home() {
  const session = await getServerSession();
  return (
    <main className="flex min-h-screen min-w-screen flex-col justify-between font-mono">
      <NavbarNoteParentComponent session={session}/>
      <Footer/>
    </main>
  );
}
