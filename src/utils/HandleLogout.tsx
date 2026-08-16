import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";

const HandleLogout = () => {
  const [loggingOut] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await loggingOut({}).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };
  return handleLogout;
};

export default HandleLogout;
