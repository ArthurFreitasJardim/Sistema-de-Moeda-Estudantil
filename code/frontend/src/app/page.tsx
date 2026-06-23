"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(198, 241, 53, 0.16), transparent 32%), #080B0F",
        color: "#F9FAFB",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "28px 56px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontSize: 22,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#C6F135",
              color: "#080B0F",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            M
          </div>
          Moeda Estudantil
        </div>

        <nav style={{ display: "flex", gap: 12 }}>
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "#F9FAFB",
              border: "1px solid rgba(255,255,255,0.16)",
              padding: "11px 18px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            style={{
              textDecoration: "none",
              color: "#080B0F",
              background: "#C6F135",
              padding: "11px 18px",
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            Cadastrar
          </Link>
        </nav>
      </header>

      <section
        style={{
          minHeight: "calc(100vh - 100px)",
          display: "grid",
          placeItems: "center",
          padding: "32px 24px 72px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 980,
            textAlign: "center",
          }}
        >
          <div
            style={{
              margin: "0 auto 28px",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "rgba(198, 241, 53, 0.12)",
              border: "1px solid rgba(198, 241, 53, 0.35)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 0 60px rgba(198, 241, 53, 0.18)",
            }}
          >
            <span
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: "#C6F135",
                letterSpacing: "-0.08em",
              }}
            >
              $
            </span>
          </div>

          <p
            style={{
              color: "#C6F135",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            Reconhecimento acadêmico digital
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 82px)",
              lineHeight: 0.95,
              letterSpacing: "-0.08em",
              margin: "0 auto",
              maxWidth: 900,
              fontWeight: 900,
            }}
          >
            Sistema de Moeda Estudantil
          </h1>

          <p
            style={{
              maxWidth: 720,
              margin: "26px auto 0",
              color: "#A7B0BE",
              fontSize: 18,
              lineHeight: 1.7,
            }}
          >
            Uma plataforma para professores reconhecerem alunos por mérito,
            alunos acumularem moedas e empresas parceiras oferecerem vantagens
            para resgate.
          </p>

          <div
            style={{
              marginTop: 42,
              display: "flex",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                background: "#C6F135",
                color: "#080B0F",
                padding: "15px 26px",
                borderRadius: 999,
                fontWeight: 900,
                fontSize: 15,
              }}
            >
              Acessar sistema
            </Link>

            <Link
              href="/cadastro"
              style={{
                textDecoration: "none",
                color: "#F9FAFB",
                padding: "15px 26px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Criar cadastro
            </Link>
          </div>

          <div
            style={{
              margin: "56px auto 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              maxWidth: 760,
            }}
          >
            {[
              ["Professores", "Enviam moedas por mérito"],
              ["Alunos", "Recebem moedas e resgatam vantagens"],
              ["Empresas", "Cadastram benefícios e cupons"],
            ].map(([titulo, texto]) => (
              <div
                key={titulo}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 22,
                  padding: 20,
                  textAlign: "left",
                }}
              >
                <strong
                  style={{
                    color: "#F9FAFB",
                    display: "block",
                    marginBottom: 6,
                    fontSize: 15,
                  }}
                >
                  {titulo}
                </strong>
                <span
                  style={{
                    color: "#8F9BAA",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}