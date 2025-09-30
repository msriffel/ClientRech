import { AddClientForm } from './_components/add-client-form';

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddClientForm />
      </div>
    </div>
  );
}
