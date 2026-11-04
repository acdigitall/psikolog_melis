export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 lg:px-10 pt-20 pb-40" aria-busy="true" aria-label="Yükleniyor">
      <div className="h-4 w-40 rounded bg-sand" />
      <div className="mt-8 h-14 w-full max-w-2xl rounded bg-sand" />
      <div className="mt-4 h-14 w-2/3 max-w-xl rounded bg-sand" />
    </div>
  );
}
