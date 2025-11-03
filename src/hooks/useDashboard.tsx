import { errorToast, successToast } from "@/helper-methods/Toaster";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const useDashboard = () => {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const _handleSignOutAlert = async () => {
    Swal.fire({
      title: "Are you sure you want to sign out?",
      text: "You will be redirected to the login page",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        _handleSignOut();
      }
    });
  };

  const _handleSignOut = async () => {
    try {
      await signOut();
      successToast("Signed out successfully");
      router.push("/login");
    } catch (error) {
      errorToast(error || "Failed to sign out");
    }
  };

  return {
    handleSignOutAlert: _handleSignOutAlert,
    user,
  };
};

export default useDashboard;
