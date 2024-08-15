import { registerUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterFormSchema as FormSchema } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { registerUser } from "@/services/authService";
import { useNavigate } from "@tanstack/react-router";

export default function RegisterForm() {
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: FormSchema) {
    try {
      await registerUser(values);
      // toast

      navigate({ to: "/login" });
    } catch (error) {
      // toast
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loadingText="Registering..."
          loading={isSubmitting}
          text="Register"
        />
      </form>
    </Form>
  );
}
