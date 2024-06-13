"use client";

import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [userState] = useAuthState(auth);

  const handleResendEmail = async () => {
    if (userState) {
      await sendEmailVerification(userState);
      toast.success("Correo reenviado");
    } else {
      toast.error("No hay usuario logueado");
    }
  };

  const handleRedirect = () => {
    if (userState) {
      auth.signOut();
    }

    window.location.href = "/";
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl">
        Verifique su correo electrónico para completar el registro.
      </h1>

      <div className="mt-4 flex flex-col items-center">
        <h1 className="text-center">¿No recibió el correo electrónico?</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleResendEmail}
        >
          Reenviar correo
        </button>
      </div>

      <p className="text-center mt-5">
        ¿Ya verificaste tu correo? Haz click en el botón de abajo para
        continuar.
      </p>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={handleRedirect}
      >
        Continuar
      </button>
    </div>
  );
}
