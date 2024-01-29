import Image from "next/image";
import styles from "./page.module.css";
import Pipeline from "./components/pipeline";

export default function Home() {
  return (
    <main className={styles.main}>
      <Pipeline />
    </main>
  );
}
