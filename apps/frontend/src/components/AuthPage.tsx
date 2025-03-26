"use client";
import {
  signInSchema,
  SignInSchemaType,
  signUpSchema,
  SignUpSchemaType,
} from "@repo/validations/src/validation";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm, zodResolver } from "@workspace/ui/hooks";
import { FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { config } from "@/config";

// AuthPage component
interface AuthPageProps {
  isSignIn: boolean;
}

// AuthPage component
export default function AuthPage({ isSignIn }: AuthPageProps) {
  // Router
  const router = useRouter();

  // Form
  const form = useForm<SignInSchemaType | SignUpSchemaType>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // On submit
  const onSubmit = async (data: SignInSchemaType | SignUpSchemaType) => {
    // Sign in
    if (isSignIn) {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // If error
      if (res?.error) {
        if (res.error === "Configuration") {
          toast.error("Invalid credentails", {
            style: {
              backgroundColor: "#f87171",
              color: "#1f2937",
            },
          });
        } else {
          toast.error("Something went wrong.", {
            style: {
              backgroundColor: "#f87171",
              color: "#1f2937",
            },
          });
        }
      }

      if (res?.url) {
        router.replace("/task");
        toast.success("Signed in successfully", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
      }
    }
    // Sign up
    else {
      const response = await fetch(
        `${config.NEXT_PUBLIC_HTTP_BACKEND_URL}/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Response data
      const res = await response.json();

      // Redirect to the task page
      if (res.success || res.status === 201) {
        router.push("/signin");
        toast.success("Account created successfully", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
      }
      // Show error message
      else {
        toast.error(res.message, {
          style: {
            backgroundColor: "#f87171",
            color: "#1f2937",
          },
        });
      }
    }
  };

  // Return the AuthPage component
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter the title of the task"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="w-full"
                    />
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
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="w-full"
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignIn ? (
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
