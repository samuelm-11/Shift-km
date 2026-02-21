import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(e) {
    e.preventDefault();
    setStatus("Envoi...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    setStatus(error ? error.message : "Lien envoyé !");
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Shift KM</h1>

      {!session ? (
        <>
          <form onSubmit={sendMagicLink}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 10, width: "100%", marginBottom: 10 }}
            />
            <button type="submit" style={{ padding: 10, width: "100%" }}>
              Connexion Magic Link
            </button>
          </form>
          <p>{status}</p>
        </>
      ) : (
        <p>Connecté : {session.user.email}</p>
      )}
    </div>
  );
}
