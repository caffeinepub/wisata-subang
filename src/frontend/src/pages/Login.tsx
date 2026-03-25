import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Login() {
  const { login, loginStatus, isLoginError, identity } = useInternetIdentity();
  const router = useRouter();

  useEffect(() => {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      router.navigate({ to: "/admin" });
    }
  }, [identity, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="bg-white rounded-2xl shadow-card p-10 w-full max-w-md text-center"
        data-ocid="login.panel"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#0E5A3F" }}
        >
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Masuk ke Visit Subang</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Masuk menggunakan Internet Identity untuk mengakses fitur booking dan
          admin panel.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          className="w-full rounded-full py-6 text-base font-semibold"
          style={{ background: "#0E5A3F", color: "white" }}
          data-ocid="login.submit_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Masuk...
            </>
          ) : (
            "Masuk / Daftar"
          )}
        </Button>
        {isLoginError && loginStatus === "loginError" && (
          <p
            className="mt-4 text-sm text-destructive"
            data-ocid="login.error_state"
          >
            Login gagal. Silakan coba lagi.
          </p>
        )}
      </div>
    </div>
  );
}
