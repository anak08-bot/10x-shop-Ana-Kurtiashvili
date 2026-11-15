import { Container } from "./Container";

/** Thin velvet strip above the header with the shop's two standing offers. */
export function AnnouncementBar() {
  return (
    <div className="border-b border-gold-500/40 bg-linear-to-r from-navy-950 via-crimson-900 to-navy-950 text-ivory">
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-xs tracking-wide">
        <span>By royal decree: free shipping on orders over $100</span>
        <span className="hidden text-gold-400 sm:inline" aria-hidden="true">
          ✦
        </span>
        <span>
          Present the seal <strong className="font-semibold text-gold-400">10X10</strong> for a 10% royal discount
        </span>
      </Container>
    </div>
  );
}
