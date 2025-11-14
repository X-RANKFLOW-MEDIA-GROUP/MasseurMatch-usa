"use client";

import { FaInstagram, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        {/* Brand */}
        <div className={styles["footer-brand"]}>
          <h3 className={styles["footer-logo"]}>
            <span className={styles["brand-gradient"]}>Masseur</span>Match
          </h3>
          <p>
            A maior plataforma inclusiva de massagistas do Brasil. Conectando
            bem-estar e tecnologia.
          </p>
          <div className={styles["footer-socials"]}>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="E-mail">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className={styles["footer-links"]}>
          <div>
            <h4>Plataforma</h4>
            <ul>
              <li>
                <a href="#">Explorar</a>
              </li>
              <li>
                <a href="#">Como Funciona</a>
              </li>
              <li>
                <a href="#">Sobre Nós</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Para Massagistas</h4>
            <ul>
              <li>
                <a href="#">Criar Conta</a>
              </li>
              <li>
                <a href="#">Dashboard</a>
              </li>
              <li>
                <a href="#">Planos e Preços</a>
              </li>
              <li>
                <a href="#">Central de Ajuda</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Termos de Uso</a>
              </li>
              <li>
                <a href="#">Privacidade</a>
              </li>
              <li>
                <a href="#">Código de Conduta</a>
              </li>
              <li>
                <a href="#">Segurança</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles["footer-bottom"]}>
        <p>© 2025 MasseurMatch. Todos os direitos reservados.</p>
        <span>Feito com 💜 para o bem-estar de todos</span>
      </div>
    </footer>
  );
}
