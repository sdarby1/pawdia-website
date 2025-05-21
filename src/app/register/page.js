
import Link from 'next/link';
import { RegisterForm } from './form';

export default function RegisterPage() {
  return (
    <div>
      <div className='bd-container'>
        <h1>Registrieren</h1>
        <h2>Freut uns, dass du Interesse hast</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
