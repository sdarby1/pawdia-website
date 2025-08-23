import { Suspense } from "react";
import TierListe from "./Tierliste";

export const dynamic = "force-dynamic"; // optional, falls SSG Druck macht
// export const revalidate = 0;         // alternative Option

export default function TiervermittlungPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Lade Filter & Tiere…</div>}>
      <TierListe />
    </Suspense>
  );
}
