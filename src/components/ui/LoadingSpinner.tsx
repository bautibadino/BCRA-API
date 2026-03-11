export default function LoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="w-6 h-6 border-2 border-bcra-blue/20 border-t-bcra-blue rounded-full animate-spin" />
      <span className="text-gray-500 text-sm">{text}</span>
    </div>
  );
}
