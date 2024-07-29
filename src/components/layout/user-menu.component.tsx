import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/dropdown";
import { usePageProps } from "@lib/context";
import { PageProps } from "../../types/misc.types";
import { LogOutIcon, Settings, User } from "lucide-react";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const UserMenu = () => {
  const { user } = usePageProps<PageProps>();

  const supabaseClient = useSupabaseClient();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <span className="font-medium flex items-center">
            {user.user_metadata?.firstName && user.user_metadata?.lastName ? (
              <>
                <span>{user.user_metadata?.firstName[0]}. </span>
                <span>{user.user_metadata?.lastName}</span>
              </>
            ) : (
              user.email?.split("@")[0]
            )}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabaseClient.auth.signOut();
            window.location.replace("/login");
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
