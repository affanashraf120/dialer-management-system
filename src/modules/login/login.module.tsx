import { Button } from "@components/button";
import { Input } from "@components/input";
import { useLogin } from "./hooks";
import { Label } from "@components/label";
import { Loader } from "lucide-react";

const LoginModule = () => {
  const {
    formMethods: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
  } = useLogin();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-[400px] w-[400px] flex flex-col items-center p-6 border rounded-lg space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to ICS Dashboard
        </h1>
        <form className="w-full space-y-4" onSubmit={onSubmit}>
          <div>
            <Input placeholder="Email Address" {...register("email")} />
            <Label className="text-red-500">{errors.email?.message}</Label>
          </div>
          <div>
            <Input placeholder="Password" type="password" {...register("password")} />
            <Label className="text-red-500">{errors.password?.message}</Label>
          </div>
          <Button disabled={isLoading} className="w-full">
            Submit
            {isLoading && <Loader className="ml-2 animate-spin" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginModule;
