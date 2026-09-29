import { NavLink } from 'react-router'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={`${styles.nav} no-print`}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true" />
        Tomar Lugar
      </NavLink>
      <nav className={styles.links} aria-label="Seções">
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
          Exposição
        </NavLink>
        <NavLink to="/tour" className={({ isActive }) => (isActive ? styles.active : undefined)}>
          Tour 3D
        </NavLink>
        <NavLink to="/catalogo" className={({ isActive }) => (isActive ? styles.active : undefined)}>
          Catálogo
        </NavLink>
      </nav>
    </header>
  )
}
