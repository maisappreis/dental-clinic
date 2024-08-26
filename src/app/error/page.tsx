import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Página Não Encontrada</h1>
      <p className={styles.description}>
        Desculpe, a página que você está procurando não existe.
      </p>
    </div>
  );
}
