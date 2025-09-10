import { Info } from "lucide-react";

export default function Header() {
  return (
    <>
    <div className="flex">SpQL Workbench <a
        href="https://github.com/minnysoop/siteshack2025"
        target="_blank"
        rel="noopener noreferrer"
        title="More info"
        style={{ display: "flex", alignItems: "center" }}
        className="ml-2 text-green-500"
      >
        <Info size={20} strokeWidth={2} />
      </a></div>
   
    </>
  );
}
