import { PageHeader } from "@/components/admin/ui";
import { PackageForm } from "@/components/admin/package-form";

export default function NewPackagePage() {
  return (
    <>
      <PageHeader title="New package" description="Save first, then add photos and the itinerary." />
      <div className="mt-6 max-w-3xl">
        <PackageForm />
      </div>
    </>
  );
}
