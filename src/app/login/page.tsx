import LoginForm from '@/components/auth/LoginForm';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <main className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </main>
    </ErrorBoundary>
  );
}
