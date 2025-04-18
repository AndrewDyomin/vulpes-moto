import Image from "next/image";
import styles from "./page.module.css";
import heroImage from "../../public/hero-bike.png";
import windshield from "../../public/windshield.webp";
import guard from "../../public/guard.webp";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section id="hero" className={`${styles.section}`}>
          <div className={`${styles.heroBckgrnd}`}>
            <Image
              src={heroImage}
              alt="Backgrond bike"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <h1 className={`${styles.heroTitle}`}>
              професійний тюнінг та захист для вашого мотоцикла
            </h1>
            <p className={styles.heroText}>
              Ми пропонуємо якісні аксесуари та надійні комплектуючі від
              провідних європейських брендів. Відчуй новий рівень стилю та
              безпеки разом з VULPES Moto.
            </p>
          </div>
        </section>

        {/* Products */}

        <section
          id="products"
          className={styles.section}
        >
          <div className={styles.products}>
            <div className={styles.productCard}>
              <div className={styles.cardInfo}>
                <h2>Вітрове скло</h2>
                <p>Захист від вітру та покращена аеродинаміка.</p>
                <a 
                  href="https://vulpes.com.ua/vetrovoe-steklo/"
                  className={styles.linkButton}
                >Докладніше</a>
              </div>
              <div>
                <Image
                src={windshield}
                alt="windshield on bike"
                fill
                style={{ objectFit: "cover"}}
              />
              </div>
            </div>
            <div className={styles.productCard}>
              <div>
                <Image
                src={guard}
                alt="Motoguard on bike"
                fill
                style={{ objectFit: "cover"}}
              />
              </div>
              <div className={styles.cardInfo}>
                <h2>Захісні дуги</h2>
                <p>Надійний захист двигуна та рами від пошкоджень.</p>
                <a 
                  href="https://vulpes.com.ua/zashchitnye-dugi/1122/"
                  className={styles.linkButton}
                >Докладніше</a>
              </div>
            </div>
          </div>
        </section>

        {/* <section id="contact" className={`${styles.section} ${styles.contact}`}>
          <div className={styles.container}>
            <h2>Контакти</h2>
            <p>Зв&apos;яжіться з нами для замовлення:</p>
            <p>Телефон: +38 (123) 456-78-90</p>
            <p>Email: zephyr@example.com</p>
          </div>
        </section> */}
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2021 Vulpes Moto. Усі права захищено.</p>
        </div>
      </footer>
    </div>
  );
}
