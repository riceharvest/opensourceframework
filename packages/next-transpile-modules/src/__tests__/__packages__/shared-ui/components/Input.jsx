import styles from './Input.module.scss';

function Input() {
  return <input type='text' className={styles.input} defaultValue='' />;
}

export default Input;
