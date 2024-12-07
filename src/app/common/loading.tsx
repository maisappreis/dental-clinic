import styles from './styles/Loading.module.css';

export default function Loading({ children }: { children: string }) {
  return (
    <div className={`${styles.overlay}`}>
      <div className="flex flex-col items-center justify-center">
        <div className={`${styles.spinner}`} />
        <h1 className="mt-5 font-bold text-xl text-white">
          { children }
        </h1>
      </div>
    </div>
  );
}
