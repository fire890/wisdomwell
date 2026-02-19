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
          <CardTitle className="text-3xl font-bold">다시 오신 것을 환영합니다</CardTitle>
          <CardDescription>
            WisdomWell에 계속하려면 로그인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full h-12 text-lg">
            <GoogleIcon className="mr-2 h-6 w-6" />
            Google로 계속하기
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
            카카오로 계속하기
          </Button>
          <p className="pt-4 text-center text-sm text-muted-foreground">
            계속하면{' '}
            <Link href="#" className="underline hover:text-primary">
              서비스 약관
            </Link>
            과{' '}
            <Link href="#" className="underline hover:text-primary">
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
