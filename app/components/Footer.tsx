export default function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Jash Techno. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#why" className="hover:text-sky-700">Why Us</a>
          <a href="#works" className="hover:text-sky-700">Works</a>
          <a href="#testimonials" className="hover:text-sky-700">Testimonials</a>
          <a href="#contact" className="hover:text-sky-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}
