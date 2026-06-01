export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-yellow-500 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
    >
      Langsung ke konten utama
    </a>
  );
}
