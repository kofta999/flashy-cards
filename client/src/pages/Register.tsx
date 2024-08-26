import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto lg:w-1/4">
      <h2 className="text-center text-4xl font-bold mb-10">
        Register a new account
      </h2>
      <RegisterForm />
    </div>
  );
}
