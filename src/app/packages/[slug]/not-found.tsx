import { ButtonLink } from "@/components/ui/button";

export default function PackageNotFound() {
  return (
    <div className="px-4 py-24 text-center sm:px-8">
      <h1 className="display text-4xl font-medium">This package is not available</h1>
      <p className="mt-3 text-ink-soft">It may have been removed or is not published yet.</p>
      <ButtonLink href="/packages" className="mt-6">
        Browse all packages
      </ButtonLink>
    </div>
  );
}
