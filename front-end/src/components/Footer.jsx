export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 py-8 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Irawan Ardiantoro. Digital & Visual Portfolio.
      </p>
    </footer>
  );
}