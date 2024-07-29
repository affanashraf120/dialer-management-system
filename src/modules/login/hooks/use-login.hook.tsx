import { UserDetails } from "../../../types/misc.types";
import { useToast, ToastAction } from "@components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateAdminAccess } from "@lib/utils";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

/* --------------------------------- schema --------------------------------- */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const useLogin = () => {
  /* --------------------------------- states --------------------------------- */
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------------------------- hooks --------------------------------- */
  const formMethods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const supabaseClient = useSupabaseClient();
  const { toast } = useToast();
  const router = useRouter();

  /* --------------------------------- methods -------------------------------- */
  const onSubmit = formMethods.handleSubmit(async (data) => {
    setIsLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword(data);

    if (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      return;
    }

    const hasAdminAccess = await validateAdminAccess(data.email);

    if (!hasAdminAccess) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "You have no permission to access this dashboard",
      });
      return;
    }
    router.push("/");
  });

  return {
    formMethods,
    onSubmit,
    isLoading,
  };
};
