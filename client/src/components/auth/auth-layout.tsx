import useAuth from "@/hooks/use-auth";

interface AuthLayoutProps {
   authentication: boolean;
   children: React.ReactNode;
};

const AuthLayout = ({
   authentication = true,
   children,
}: AuthLayoutProps) => {
   const { isLoading, error } = useAuth({ authentication });

   if (isLoading) {
      return <div>Loading...</div>;
   };

   if (error) {
      return <div>Error: {error.message}</div>;
   };

   return (
      <>
         {children}
      </>
   )
};

export default AuthLayout;