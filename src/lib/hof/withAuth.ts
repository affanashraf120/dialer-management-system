import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { UserDetails } from "../../types/misc.types";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { validateAdminAccess } from "@lib/utils";

/**
 * The options for the withAuth higher-order function.
 */
interface WithAuthOptions {
  hasPublicAccess?: boolean;
  redirectOnAuth?: boolean;
}

/**
 * The options passed to the getServerSideProps callback function.
 */
interface GetServerSidePropsCbOption {
  ctx: GetServerSidePropsContext;
  user: UserDetails;
}

/**
 * The response returned from the getServerSideProps callback function.
 */
interface GetServerSidePropsCbResponse<T> {
  props?: T;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
  notFound?: boolean;
}

/**
 * The type definition for the getServerSideProps callback function.
 */
type GetServerSidePropsCb<T> = (
  options: GetServerSidePropsCbOption
) => Promise<GetServerSidePropsCbResponse<T>> | GetServerSidePropsCbResponse<T>;

/**
 * Manages authentication and enhances the getServerSideProps function with authentication logic.
 */
class AuthManager<T> {
  getServerSideProps?: GetServerSidePropsCb<T>;
  options?: WithAuthOptions;

  /**
   * Creates an instance of AuthManager.
   * @param {GetServerSidePropsCb<T>} [getServerSideProps] - The getServerSideProps callback function.
   * @param {WithAuthOptions} [options] - The options for authentication.
   */
  constructor(
    getServerSideProps?: GetServerSidePropsCb<T>,
    options?: WithAuthOptions
  ) {
    if (getServerSideProps) {
      this.getServerSideProps = getServerSideProps;
    }
    this.options = options;
  }

  /**
   * Retrieves user information from the session.
   * @param {GetServerSidePropsContext} ctx - The Next.js context object.
   * @returns {Promise<UserDetails | null>} - The user details or null if there's an error or the user is not an admin.
   */
  private async getUser(ctx: GetServerSidePropsContext) {
    const supabaseServerClient = createPagesServerClient(ctx);
    const { data, error } = await supabaseServerClient.auth.getSession();
    const user = data?.session?.user as UserDetails | undefined;
    if (user && data.session) {
      user.access_token = data.session?.access_token;
    }

    // check if user has admin access

    const hasAdminAccess = await validateAdminAccess(user?.email as string);
    return !error && hasAdminAccess ? user : null;
  }

  /**
   * Authenticates the user and enhances the getServerSideProps function with authentication logic.
   * @param {GetServerSidePropsContext} ctx - The Next.js context object.
   * @returns {Promise<GetServerSidePropsCbResponse<T>>} - The response containing props or redirect information.
   */
  async authenticate(ctx: GetServerSidePropsContext) {
    // Attempt to get the user data by calling the "getUser" function asynchronously.
    const user = await this.getUser(ctx);

    // Check if there is no user data, and if so, redirect the user to the login page.
    if (!user) {
      return {
        redirect: {
          destination: "/login", // Redirect destination to the login page.
          permanent: false, // Set "permanent" to false for a temporary redirect.
        },
      };
    }

    // Check if there is user data and if a redirection on authentication is configured.
    if (user && this.options?.redirectOnAuth) {
      return {
        redirect: {
          destination: "/", // Redirect destination to the home page.
          permanent: false, // Set "permanent" to false for a temporary redirect.
        },
      };
    }

    // If there is a function called "getServerSideProps" defined in this instance,
    // execute it and pass the "ctx" and "user" as arguments.
    if (this.getServerSideProps) {
      // Call "getServerSideProps" function asynchronously.
      const gssr = await this.getServerSideProps({
        ctx,
        user,
      });

      // If the result from "getServerSideProps" does not contain "props," return it as is.
      if (!gssr.props) {
        return gssr;
      }

      // If "props" is present in the result from "getServerSideProps," return it along with the "user" data.
      return {
        props: { ...gssr.props, user }, // Spread the properties from gssr.props and include "user" data.
      };
    }

    // If there is no "getServerSideProps" function, simply return the "user" data as props.
    return {
      props: { user }, // Return user data as props.
    };
  }
}

export default AuthManager;
