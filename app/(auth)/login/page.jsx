import LoginClient from './LoginClient';

export default function LoginPage({ searchParams }) {
    const nextParam = Array.isArray(searchParams?.next)
        ? searchParams.next[0]
        : searchParams?.next;
    const nextPath = typeof nextParam === 'string' ? nextParam : '';

    return <LoginClient nextPath={nextPath} />;
}
