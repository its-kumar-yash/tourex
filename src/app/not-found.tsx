import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center sm:px-8">
      <p className="text-sm text-ink-muted">404</p>
      <h1 className="display mt-2 text-4xl font-medium">Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you are looking for does not exist.</p>
      <ButtonLink href="/" className="mt-6">
        Back to home
      </ButtonLink>
    </div>
  );
}
