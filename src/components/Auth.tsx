import AuthShell, { Hot, BrandLogo } from './AuthShell';
import AuthRedirect from './AuthRedirect';
import MobileLoginForm from './MobileLoginForm';

// /auth landing — server component; client JS is limited to the number form and the logged-in redirect
export default function AuthPage() {
  return (
    <>
      <AuthRedirect />
      <AuthShell>
        <div className="text-center">
          <BrandLogo />
          <h1 className="mt-5 text-[26px] font-extrabold leading-tight sm:text-[28px]">
            <Hot>Premium</Hot> Originals, <span className="whitespace-nowrap">Made for You</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-white/65">Sign in with your mobile number to start watching</p>
        </div>

        <MobileLoginForm className="mt-6" />
      </AuthShell>
    </>
  );
}
