/**
 * Многослойный фон для лендинга: несколько крупных размытых пятен фирменных
 * цветов, медленно "дышащих" (float), плюс лёгкая техническая сетка сверху.
 * position: fixed — покрывает всю страницу как единая атмосфера, а не
 * привязывается к конкретной секции. Полностью декоративен (aria-hidden),
 * не перехватывает клики.
 */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-blob ambient-blob--1" />
      <div className="ambient-blob ambient-blob--2" />
      <div className="ambient-blob ambient-blob--3" />
      <div className="ambient-grid" />
    </div>
  );
}
