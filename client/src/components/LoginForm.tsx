import { loginUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema as FormSchema } from "@/types";
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
import { loginUser } from "@/services/authService";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "./ui/use-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: FormSchema) {
    try {
      await loginUser(values);
      toast({
        title: "Logging in Successful",
        description: "Redirecting to home page",
      });
      navigate({ to: "/home" });
    } catch {
      toast({
        title: "Logging in Error",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
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
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loadingText="Logging in..."
          className="w-full"
          loading={isSubmitting}
          text="Login"
        />
      </form>
    </Form>
  );
}
