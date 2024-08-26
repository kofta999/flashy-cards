import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="mx-auto lg:w-1/4">
      <h2 className="text-center text-4xl font-bold mb-10">Login to your account</h2>
      <LoginForm />
    </div>
  );
}
