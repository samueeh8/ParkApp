"use client";

import { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import "./login.css";
import { userStore } from "@/store/users";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify";
import { mailPermittedDomains } from "@/constants/settings";

export default function Login() {
  const { newUSerToDatabaseFirebase, setLoggedInUser, logoutUser } = userStore();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userState] = useAuthState(auth);

  useEffect(() => {
    const switchers = [...document.querySelectorAll(".switcher")];
    switchers.forEach((item) => {
      item.addEventListener("click", () => {
        // Use arrow function to bind 'this' correctly
        switchers.forEach((item) => {
          if (item.parentElement) {
            item.parentElement.classList.remove("is-active");
          }
        });
        if (item.parentElement) {
          item.parentElement.classList.add("is-active"); // Use 'item' instead of 'this'
        }
      });
    });
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailElement = document.getElementById(
      "signup-email"
    ) as HTMLInputElement;
    const passwordElement = document.getElementById(
      "signup-password"
    ) as HTMLInputElement;
    const passwordConfirmElement = document.getElementById(
      "signup-password-confirm"
    ) as HTMLInputElement;
    const matriculaElement = document.getElementById(
      "matricula"
    ) as HTMLInputElement;

    const email = emailElement.value;
    const password = passwordElement.value;
    const passwordConfirm = passwordConfirmElement.value;
    const matricula = matriculaElement.value;

    // Checkear si el email tiene un dominio permitido
    let emailIsValid = false;
    mailPermittedDomains.forEach((domain) => {
      if (email.endsWith(domain)) {
        emailIsValid = true;
      }
    });
    if (!emailIsValid) {
      toast.error("Email inválido");
      return;
    }

    if (password === passwordConfirm) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await signInWithEmailAndPassword(auth, email, password);
        await newUSerToDatabaseFirebase(email, matricula);
        await setLoggedInUser(email);

        if (auth.currentUser) await sendEmailVerification(auth.currentUser);
        else {
          toast.error(
            "Error al registrar el usuario, por favor intente de nuevo"
          );
          return;
        }

        // Redirect to verification page
        router.push("/verify");
      } catch (error) {
        console.error(error);
        const firebaseError = error as firebase.FirebaseError;

        if (firebaseError.code === "auth/email-already-in-use")
          toast.error("Email en uso, pruebe otro");
        else if (firebaseError.code === "auth/weak-password")
          toast.error("El password es muy débil");
        else if (firebaseError.code === "auth/invalid-email")
          toast.error("Email inválido");
        else
          toast.error(
            "Error desconocido, por favor intente de nuevo más tarde"
          );
      }
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logoutUser();

    const emailElement = document.getElementById(
      "login-email"
    ) as HTMLInputElement;
    const passwordElement = document.getElementById(
      "login-password"
    ) as HTMLInputElement;

    const email = emailElement.value;
    const password = passwordElement.value;

    if (!email || !password) {
      console.error("Email o contraseña vacíos");
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const result = await setLoggedInUser(email);

      if (!result) {
        toast.error("El usuario fue eliminado");
        return;
      }

      if (!userState) {
        toast.error("Error al iniciar sesión, por favor intente de nuevo");
        return;
      }

      // Si el usuario ya está verificado, redirigir a la página de mis reservas
      if (!userState.emailVerified) {
        router.push("/verify");
        return;
      } else {
        router.push("/main/my_reservations");
        return;
      }
    } catch (error) {
      console.error(error);

      toast.error("Credenciales inválidas, por favor intente de nuevo");
    }
  };

  const handleRecuperarContraseña = async (
    e: any
  ) => {
    e.preventDefault();

    const emailElement = document.getElementById(
      "login-email"
    ) as HTMLInputElement;

    const email = emailElement.value;

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email de recuperación de contraseña enviado");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el email de recuperación de contraseña");
    }
  };

  return (
    <div className="h-screen">
      <section className="forms-section">
        <div className="forms">
          <div className="form-wrapper is-active">
            <button type="button" className="switcher switcher-login">
              Login
              <span className="underline"></span>
            </button>
            <form className="form form-login" onSubmit={handleLogin}>
              <fieldset>
                <div className="input-block">
                  <label>E-mail</label>
                  <input id="login-email" type="email" required></input>
                </div>
                <div className="input-block">
                  <label>Password</label>
                  <input id="login-password" type="password" required></input>
                </div>
              </fieldset>
              <button type="submit" className="btn">
                Entrar
              </button>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline text-center"
                onClick={(e) => handleRecuperarContraseña(e)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </div>

          <div className="form-wrapper">
            <button type="button" className="switcher switcher-signup">
              Registro
              <span className="underline"></span>
            </button>
            <form
              className="form form-signup"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                handleRegister(e)
              }
            >
              <fieldset>
                <div className="input-block">
                  <label>E-mail</label>
                  <input id="signup-email" type="email" required></input>
                </div>
                <div className="input-block">
                  <label>Matrícula</label>
                  <input id="matricula" type="text" required></input>
                </div>
                <div className="input-block">
                  <label>Password</label>
                  <input id="signup-password" type="password" required></input>
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password-confirm">
                    Confirmar password
                  </label>
                  <input
                    id="signup-password-confirm"
                    type="password"
                    required
                  ></input>
                </div>
              </fieldset>
              <button type="submit" className="btn">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
