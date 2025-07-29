export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Clean Layout ohne Header/Footer für Coming Soon
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}