export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-amber-200/40 bg-portal-peach">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-5 sm:px-6 lg:px-8">
        <a
          href="#contact"
          className="text-sm font-medium text-portal-brown/90 underline-offset-4 hover:text-portal-ochre hover:underline"
        >
          Contact
        </a>
        <a
          href="#faqs"
          className="text-sm font-medium text-portal-brown/90 underline-offset-4 hover:text-portal-ochre hover:underline"
        >
          FAQs
        </a>
        <a
          href="#support"
          className="text-sm font-medium text-portal-brown/90 underline-offset-4 hover:text-portal-ochre hover:underline"
        >
          Support
        </a>
      </div>
    </footer>
  );
}
