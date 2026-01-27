import SignupForm from '@/components/auth/SignupForm';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function SignupPage() {
  return (
    <ErrorBoundary>
      <main className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <SignupForm />
        </div>
      </main>
    </ErrorBoundary>
  );
}
