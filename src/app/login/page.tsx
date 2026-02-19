import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleIcon } from '@/components/icons/google';
import { KakaoIcon } from '@/components/icons/kakao';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Log in to continue to WisdomWell.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full h-12 text-lg">
            <GoogleIcon className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            style={{
              backgroundColor: '#FEE500',
              color: '#000000',
              borderColor: '#FEE500',
            }}
          >
            <KakaoIcon className="mr-2 h-6 w-6" />
            Continue with Kakao
          </Button>
          <p className="pt-4 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
